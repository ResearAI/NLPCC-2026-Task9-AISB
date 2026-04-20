import SectionHeading from "@/components/SectionHeading";
import { AGENT_TOOLS_URL, NLPCC_PACKAGE_URL, PUBLIC_REPO_URL } from "@/lib/publicLinks";

const HUMAN_STEPS = [
  "Choose one direction: T1, T2, or T3.",
  "Give your AI Scientist the prepared workspace and ask it to read the track materials first.",
  "Let it summarize which direction fits your goal, then run experiments locally.",
  "Ask it to show you the direction choice, method idea, and experiment evidence before final packaging.",
  "Validate, package, and optionally replay the submission locally.",
];

const AGENT_FILES = [
  "AGENT.md",
  "bench.yaml",
  "data/data.md",
  "papers library",
  "examples/starter_submission/",
];

const AI_SCIENTIST_PROMPT = `Use current NLPCC public package: ${NLPCC_PACKAGE_URL}. Inspect T1,T2,T3 under benchmarks/nlpcc, read the scientific question, AGENT.md, bench.yaml, data/data.md, paper links, and starter submission for each direction, tell me which direction best fits my goal and why, then run the chosen benchmark end to end, show me the method choice and experiment evidence, and prepare a strict submission with validate/package/replay commands ready.`;

const QUICK_LINKS = [
  { label: "NLPCC Package", href: NLPCC_PACKAGE_URL },
  { label: "Public Repository", href: PUBLIC_REPO_URL },
  { label: "NLPCC Tracks", href: "/tracks" },
  { label: "Paper Library", href: "/papers" },
  { label: "Competition Overview", href: "/competitions" },
  { label: "agent_tools.py", href: AGENT_TOOLS_URL },
];

const AGENT_REPORT_ITEMS = [
  "chosen direction and why it matches the goal",
  "which benchmark package and papers were read",
  "planned method and baseline comparison",
  "current experiment evidence and score summary",
  "whether submission validate/package/replay already passed",
];

export default function RulesPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <SectionHeading
        title="How to Participate"
        titleCn="如何参赛"
        subtitle="This page is human-facing. It tells a team how to hand the benchmark to its AI Scientist, what the infrastructure is, how to run locally, and how to prepare a valid submission."
      />

      <section className="card-gold rounded-2xl p-6 bg-white mb-8">
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl text-[var(--navy-700)] mb-4">
          Agent Instruction
        </h2>
        <p className="text-sm text-[var(--gray-500)] mb-4">
          This is the human-facing copyable instruction. Paste it to your AI Scientist together with the current NLPCC public package. The agent is expected to inspect that package, run code, and report back its direction choice before continuing.
        </p>
        <pre className="rounded-xl p-4 bg-gray-50 border border-[var(--gray-200)] text-sm text-[var(--gray-600)] overflow-x-auto"
             style={{ fontFamily: "'Source Code Pro', monospace" }}>
{AI_SCIENTIST_PROMPT}
        </pre>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card rounded-2xl p-6 bg-white">
          <h3 className="text-xl font-semibold mb-3">For Humans</h3>
          <p className="text-sm text-[var(--gray-500)] mb-4">
            The repository already contains the benchmark package, reference papers, starter submission, local evaluator,
            validation tool, and optional local backend replay.
          </p>
          <ol className="space-y-3 text-sm text-[var(--gray-500)] list-decimal list-inside">
            {HUMAN_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="card rounded-2xl p-6 bg-white">
          <h3 className="text-xl font-semibold mb-3">For Your AI Scientist</h3>
          <p className="text-sm text-[var(--gray-500)] mb-4">
            After `workspace init`, tell the agent to read these files before it starts running experiments:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {AGENT_FILES.map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 rounded-full text-xs"
                style={{
                  background: "var(--gray-50)",
                  color: "var(--gray-600)",
                  border: "1px solid var(--gray-200)",
                  fontFamily: "'Source Code Pro', monospace",
                }}
              >
                {item}
              </span>
            ))}
          </div>
          <pre className="rounded-xl p-4 bg-gray-50 border border-[var(--gray-200)] text-sm text-[var(--gray-600)] overflow-x-auto"
               style={{ fontFamily: "'Source Code Pro', monospace" }}>
{`Read .work/T1/AGENT.md, bench.yaml, data/data.md, and the linked paper library.
First tell me which direction is most suitable and why.
Then run experiments, write submission/, validate it, and show me the final package summary before submission.`}
          </pre>
        </div>
      </section>

      <section className="card rounded-2xl p-6 bg-white mb-8">
        <h3 className="text-xl font-semibold mb-4">Public Entry Points</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          {QUICK_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="px-4 py-2 rounded-lg text-sm border hover:underline"
              style={{
                borderColor: "var(--gray-200)",
                color: "var(--navy-700)",
                background: "var(--gray-50)",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
        <p className="text-sm text-[var(--gray-500)]">
          Send the repository and the one-line prompt to your AI Scientist. It should use these entry points to choose a direction, read the benchmark package, and then run locally.
        </p>
      </section>

      <section className="card rounded-2xl p-6 bg-white mb-8">
        <h3 className="text-xl font-semibold mb-4">Local Infrastructure</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-[var(--gray-500)]">
          <div className="rounded-xl p-4 bg-gray-50 border border-[var(--gray-200)]">
            <h4 className="font-medium text-[var(--navy-700)] mb-2">Benchmark Package</h4>
            <p>Each track directory contains benchmark description, data card, references, evaluator, Docker files, and starter submission.</p>
          </div>
          <div className="rounded-xl p-4 bg-gray-50 border border-[var(--gray-200)]">
            <h4 className="font-medium text-[var(--navy-700)] mb-2">Evaluation Tools</h4>
            <p>`scripts/agent_tools.py` prepares the workspace, runs local evaluation, validates the submission, packages it, and can replay it locally.</p>
          </div>
          <div className="rounded-xl p-4 bg-gray-50 border border-[var(--gray-200)]">
            <h4 className="font-medium text-[var(--navy-700)] mb-2">Submission Contract</h4>
            <p>The final artifact is a strict `submission/` directory with paper, logs, metadata, results, and optional `code/run.py` for replay.</p>
          </div>
        </div>
      </section>

      <section className="card rounded-2xl p-6 bg-white mb-8">
        <h3 className="text-xl font-semibold mb-4">Minimal Command Flow</h3>
        <p className="text-sm text-[var(--gray-500)] mb-4">
          If you want to prepare the workspace manually before handing it to the agent, use this command flow. Replace `T1` with `T2` or `T3`.
        </p>
        <pre className="rounded-xl p-4 bg-gray-50 border border-[var(--gray-200)] text-sm text-[var(--gray-600)] overflow-x-auto"
             style={{ fontFamily: "'Source Code Pro', monospace" }}>
{`python scripts/agent_tools.py workspace init T1 --dest .work/T1
python scripts/agent_tools.py evaluate T1 --bench-dir .work/T1 --submission .work/T1/submission
python scripts/agent_tools.py submission validate .work/T1/submission
python scripts/agent_tools.py submission package .work/T1/submission
python scripts/agent_tools.py submission replay .work/T1/submission --track T1`}
        </pre>
        <p className="text-sm text-[var(--gray-500)] mt-4">
          The local replay path is the current public infrastructure for checking whether a package is structurally ready.
        </p>
      </section>

      <section className="card rounded-2xl p-6 bg-white mb-8">
        <h3 className="text-xl font-semibold mb-4">What Your Agent Should Show You</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {AGENT_REPORT_ITEMS.map((item) => (
            <div key={item} className="rounded-xl p-4 bg-gray-50 border border-[var(--gray-200)] text-sm text-[var(--gray-500)]">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="card rounded-2xl p-6 bg-white">
        <h3 className="text-xl font-semibold mb-4">What To Submit</h3>
        <pre className="rounded-xl p-4 bg-gray-50 border border-[var(--gray-200)] text-sm text-[var(--gray-600)] overflow-x-auto"
             style={{ fontFamily: "'Source Code Pro', monospace" }}>
{`submission/
  metadata.json
  results.json
  code/run.py                # optional but recommended for replay
  paper/
    paper.pdf
    source/main.tex
    source/refs.bib
    source/figures/
    claims.json
  logs/
    iterations.jsonl
    experiment_log.jsonl
    api_calls.jsonl`}
        </pre>
      </section>
    </div>
  );
}
