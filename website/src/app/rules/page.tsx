import SectionHeading from "@/components/SectionHeading";

export default function RulesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <SectionHeading
        title="Submission Rules"
        subtitle="Requirements, format specifications, and resource limits for all AISB 2026 competition tracks."
      />

      {/* Submission Format */}
      <section className="mb-12">
        <h3
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl mb-6"
        >
          Submission Format
        </h3>
        <div className="card rounded-xl p-6 bg-white">
          <p className="text-sm text-[var(--gray-500)] leading-relaxed mb-6">
            Each submission is a Docker image that, when executed with the
            provided task inputs, produces outputs in the specified format. The
            image must be self-contained: all code, model weights, and
            dependencies must be included.
          </p>
          <div className="rounded-lg p-4 bg-gray-50 border border-[var(--gray-200)] mb-4">
            <div
              className="text-xs text-[var(--gray-400)] uppercase tracking-wider mb-3"
              style={{ fontFamily: "'Source Code Pro', monospace" }}
            >
              Required Directory Structure
            </div>
            <pre
              className="text-sm text-[var(--gray-500)]"
              style={{ fontFamily: "'Source Code Pro', monospace" }}
            >
{`submission/
  Dockerfile              # Build instructions
  run.sh                  # Entry point script
  src/                    # Source code
  models/                 # Model weights (if any)
  config.yaml             # System configuration
  metadata.json           # Team info, system description
  output/                 # Generated at runtime
    results.json          # Final results
    iterations.jsonl      # Step-by-step execution log
    claims.json           # Self-reported numerical claims`}
            </pre>
          </div>
          <div className="rounded-lg p-4 bg-gray-50 border border-[var(--gray-200)]">
            <div
              className="text-xs text-[var(--gray-400)] uppercase tracking-wider mb-3"
              style={{ fontFamily: "'Source Code Pro', monospace" }}
            >
              metadata.json Schema
            </div>
            <pre
              className="text-sm text-[var(--gray-500)]"
              style={{ fontFamily: "'Source Code Pro', monospace" }}
            >
{`{
  "team_name": "string",
  "system_name": "string",
  "track": "T1 | T2 | T3",
  "contact_email": "string",
  "description": "string (max 500 chars)",
  "base_models": ["list of LLM/model names used"],
  "estimated_cost": "float (USD)",
  "submission_date": "YYYY-MM-DD"
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="mb-12">
        <h3
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl mb-6"
        >
          Requirements
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card rounded-xl p-6 bg-white">
            <h4 className="font-semibold text-sm mb-4 text-[var(--emerald-500)]">
              Must
            </h4>
            <ul className="space-y-3 text-sm text-[var(--gray-500)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--emerald-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>+</span>
                <span>Run inside the provided Docker sandbox without modification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--emerald-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>+</span>
                <span>Produce output/results.json and output/iterations.jsonl</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--emerald-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>+</span>
                <span>Complete within the track-specific time limit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--emerald-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>+</span>
                <span>Stay within the API cost budget</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--emerald-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>+</span>
                <span>Include accurate metadata.json with team and system details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--emerald-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>+</span>
                <span>Report all numerical claims in output/claims.json for CAS verification</span>
              </li>
            </ul>
          </div>
          <div className="card rounded-xl p-6 bg-white">
            <h4 className="font-semibold text-sm mb-4 text-[var(--red-500)]">
              Must Not
            </h4>
            <ul className="space-y-3 text-sm text-[var(--gray-500)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--red-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>x</span>
                <span>Attempt to access the internet or external APIs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--red-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>x</span>
                <span>Modify the Docker container or escape the sandbox</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--red-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>x</span>
                <span>Access test labels, answer keys, or canary tokens</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--red-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>x</span>
                <span>Hard-code benchmark-specific answers in source code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--red-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>x</span>
                <span>Report results not produced during the evaluation run</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--red-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>x</span>
                <span>Use more than the allocated compute resources (GPU, memory, disk)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Resource Limits */}
      <section className="mb-12">
        <h3
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl mb-6"
        >
          Resource Limits
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.12] text-[var(--gray-400)] text-xs uppercase tracking-wider">
                <th className="py-3 px-4 text-left font-medium">Resource</th>
                <th className="py-3 px-4 text-center font-medium">T1: LM Reasoning</th>
                <th className="py-3 px-4 text-center font-medium">T2: Math and Proof</th>
                <th className="py-3 px-4 text-center font-medium">T3: Discovery</th>
              </tr>
            </thead>
            <tbody className="text-[var(--gray-500)]" style={{ fontFamily: "'Source Code Pro', monospace" }}>
              <tr className="border-b border-[var(--gray-200)]">
                <td className="py-3 px-4 font-medium text-[var(--navy-700)]" style={{ fontFamily: "'Sora', sans-serif" }}>Wall-clock time</td>
                <td className="py-3 px-4 text-center">4 hours</td>
                <td className="py-3 px-4 text-center">6 hours</td>
                <td className="py-3 px-4 text-center">6 hours</td>
              </tr>
              <tr className="border-b border-[var(--gray-200)]">
                <td className="py-3 px-4 font-medium text-[var(--navy-700)]" style={{ fontFamily: "'Sora', sans-serif" }}>API budget</td>
                <td className="py-3 px-4 text-center">$20</td>
                <td className="py-3 px-4 text-center">$30</td>
                <td className="py-3 px-4 text-center">$30</td>
              </tr>
              <tr className="border-b border-[var(--gray-200)]">
                <td className="py-3 px-4 font-medium text-[var(--navy-700)]" style={{ fontFamily: "'Sora', sans-serif" }}>GPU</td>
                <td className="py-3 px-4 text-center">1x A100 40GB</td>
                <td className="py-3 px-4 text-center">1x A100 40GB</td>
                <td className="py-3 px-4 text-center">1x A100 80GB</td>
              </tr>
              <tr className="border-b border-[var(--gray-200)]">
                <td className="py-3 px-4 font-medium text-[var(--navy-700)]" style={{ fontFamily: "'Sora', sans-serif" }}>RAM</td>
                <td className="py-3 px-4 text-center">64 GB</td>
                <td className="py-3 px-4 text-center">64 GB</td>
                <td className="py-3 px-4 text-center">128 GB</td>
              </tr>
              <tr className="border-b border-[var(--gray-200)]">
                <td className="py-3 px-4 font-medium text-[var(--navy-700)]" style={{ fontFamily: "'Sora', sans-serif" }}>Disk</td>
                <td className="py-3 px-4 text-center">100 GB</td>
                <td className="py-3 px-4 text-center">100 GB</td>
                <td className="py-3 px-4 text-center">200 GB</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-[var(--navy-700)]" style={{ fontFamily: "'Sora', sans-serif" }}>Docker image size</td>
                <td className="py-3 px-4 text-center">20 GB max</td>
                <td className="py-3 px-4 text-center">20 GB max</td>
                <td className="py-3 px-4 text-center">30 GB max</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Evaluation Procedure */}
      <section className="mb-12">
        <h3
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl mb-6"
        >
          Evaluation Procedure
        </h3>
        <div className="card rounded-xl p-6 bg-white">
          <div className="space-y-4 text-sm text-[var(--gray-500)]">
            <div className="flex gap-4">
              <span
                className="text-[var(--gold-500)] shrink-0 w-6"
                style={{ fontFamily: "'Source Code Pro', monospace" }}
              >
                1.
              </span>
              <div>
                <strong className="text-[var(--navy-700)]">Submission Upload</strong> --
                Teams upload their Docker image to the AISB submission portal.
                The image is scanned for security issues and size compliance.
              </div>
            </div>
            <div className="flex gap-4">
              <span
                className="text-[var(--gold-500)] shrink-0 w-6"
                style={{ fontFamily: "'Source Code Pro', monospace" }}
              >
                2.
              </span>
              <div>
                <strong className="text-[var(--navy-700)]">Sandbox Execution</strong> --
                The image is launched inside the Docker sandbox (Layer 1) with
                task inputs. Execution traces are recorded (Layer 2).
              </div>
            </div>
            <div className="flex gap-4">
              <span
                className="text-[var(--gold-500)] shrink-0 w-6"
                style={{ fontFamily: "'Source Code Pro', monospace" }}
              >
                3.
              </span>
              <div>
                <strong className="text-[var(--navy-700)]">Output Collection</strong> --
                Results, execution logs, and claims are extracted from the
                container output directory.
              </div>
            </div>
            <div className="flex gap-4">
              <span
                className="text-[var(--gold-500)] shrink-0 w-6"
                style={{ fontFamily: "'Source Code Pro', monospace" }}
              >
                4.
              </span>
              <div>
                <strong className="text-[var(--navy-700)]">Integrity Check</strong> --
                CAS is computed (Layer 3). Canary tokens are checked (Layer 4).
                Integrity status is assigned (PASS / FLAGGED / FAIL).
              </div>
            </div>
            <div className="flex gap-4">
              <span
                className="text-[var(--gold-500)] shrink-0 w-6"
                style={{ fontFamily: "'Source Code Pro', monospace" }}
              >
                5.
              </span>
              <div>
                <strong className="text-[var(--navy-700)]">Scoring</strong> -- Raw task
                score is computed. DualScore = RawScore x CAS. Results are
                posted to the leaderboard.
              </div>
            </div>
            <div className="flex gap-4">
              <span
                className="text-[var(--gold-500)] shrink-0 w-6"
                style={{ fontFamily: "'Source Code Pro', monospace" }}
              >
                6.
              </span>
              <div>
                <strong className="text-[var(--navy-700)]">Review Period</strong> --
                FLAGGED submissions enter a 7-day review period. Teams may
                provide explanations for unverified claims. Final status is
                determined by organizers.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disqualification */}
      <section>
        <h3
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl mb-6"
        >
          Disqualification Criteria
        </h3>
        <div className="card rounded-xl p-6 bg-white border-[var(--red-500)]/20">
          <ul className="space-y-3 text-sm text-[var(--gray-500)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--red-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>--</span>
              <span>CAS below 0.5 (significant result fabrication)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--red-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>--</span>
              <span>Canary token detected in output (test set contamination)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--red-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>--</span>
              <span>Sandbox escape attempt detected</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--red-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>--</span>
              <span>Exceeding resource limits by more than 10%</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--red-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>--</span>
              <span>Evidence of hard-coded benchmark answers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--red-500)] mt-0.5" style={{ fontFamily: "'Source Code Pro', monospace" }}>--</span>
              <span>Multiple submissions from the same team under different names</span>
            </li>
          </ul>
          <p className="text-xs text-[var(--gray-400)] mt-4">
            Disqualified submissions remain on the leaderboard with FAIL status
            for transparency but are ineligible for prizes or rankings.
          </p>
        </div>
      </section>
    </div>
  );
}
