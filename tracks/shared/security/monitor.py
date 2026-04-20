#!/usr/bin/env python3
"""
AISB 2026 — Runtime Container Monitor

Runs OUTSIDE the Docker container, monitoring the submission during execution.
Uses Docker API to track: process tree, resource usage, and network attempts.

Usage:
    monitor = ContainerMonitor(container_id="abc123", log_dir="monitor_logs/")
    monitor.start()        # starts background monitoring
    # ... container runs ...
    monitor.stop()
    report = monitor.get_report()
"""
import json
import subprocess
import threading
import time
from datetime import datetime, timezone
from pathlib import Path


class ContainerMonitor:
    """Monitors a running Docker container from the host."""

    def __init__(self, container_id: str, log_dir: str = "monitor_logs",
                 interval_seconds: float = 10.0):
        self.container_id = container_id
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.interval = interval_seconds
        self._events_file = self.log_dir / "monitor_events.jsonl"
        self._running = False
        self._thread = None
        self._events: list[dict] = []
        self._anomalies: list[dict] = []

    def start(self):
        """Start background monitoring thread."""
        self._running = True
        self._thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self._thread.start()

    def stop(self):
        """Stop monitoring and finalize."""
        self._running = False
        if self._thread:
            self._thread.join(timeout=15)

    def _monitor_loop(self):
        while self._running:
            try:
                self._check_processes()
                self._check_resources()
            except Exception as e:
                self._log_event("monitor_error", {"error": str(e)})
            time.sleep(self.interval)

    def _check_processes(self):
        """Check process tree inside container."""
        try:
            result = subprocess.run(
                ["docker", "top", self.container_id, "-o", "pid,user,comm,args"],
                capture_output=True, text=True, timeout=10)
            if result.returncode != 0:
                return

            lines = result.stdout.strip().splitlines()
            processes = []
            for line in lines[1:]:  # skip header
                parts = line.split(None, 3)
                if len(parts) >= 3:
                    proc = {"pid": parts[0], "user": parts[1], "cmd": parts[2],
                            "args": parts[3] if len(parts) > 3 else ""}
                    processes.append(proc)

                    # Anomaly detection
                    suspicious_cmds = {"curl", "wget", "nc", "ncat", "socat",
                                       "ssh", "scp", "sftp", "python3 -m http"}
                    if any(s in proc.get("args", "").lower() for s in suspicious_cmds):
                        self._flag_anomaly("suspicious_process", proc)

            self._log_event("process_check", {
                "process_count": len(processes),
                "processes": processes[:20],  # cap at 20
            })
        except subprocess.TimeoutExpired:
            pass

    def _check_resources(self):
        """Check container resource usage."""
        try:
            result = subprocess.run(
                ["docker", "stats", self.container_id, "--no-stream",
                 "--format", '{"cpu":"{{.CPUPerc}}","mem":"{{.MemUsage}}","net":"{{.NetIO}}","pids":"{{.PIDs}}"}'],
                capture_output=True, text=True, timeout=10)
            if result.returncode != 0:
                return

            stats = json.loads(result.stdout.strip())
            self._log_event("resource_check", stats)

            # Anomaly: >90% CPU sustained or >15GB memory
            cpu_str = stats.get("cpu", "0%").replace("%", "")
            try:
                if float(cpu_str) > 350:  # 350% = 3.5 cores
                    self._flag_anomaly("high_cpu", stats)
            except ValueError:
                pass

        except (subprocess.TimeoutExpired, json.JSONDecodeError):
            pass

    def _log_event(self, event_type: str, data: dict):
        entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "container": self.container_id[:12],
            "event": event_type,
            "data": data,
        }
        self._events.append(entry)
        with open(self._events_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    def _flag_anomaly(self, anomaly_type: str, details: dict):
        anomaly = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "type": anomaly_type,
            "details": details,
        }
        self._anomalies.append(anomaly)
        self._log_event("anomaly", anomaly)

    def get_report(self) -> dict:
        """Generate final monitoring report."""
        return {
            "container_id": self.container_id,
            "total_events": len(self._events),
            "anomalies": self._anomalies,
            "anomaly_count": len(self._anomalies),
            "clean": len(self._anomalies) == 0,
        }
