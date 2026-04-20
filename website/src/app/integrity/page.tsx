import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";

const PRINCIPLES = [
  "The benchmark only trusts results that can be tied back to executed experiments.",
  "Organizer replay is used to check that a submission can run and produce traceable outputs.",
  "Claims in the paper must match the logs and structured claim file.",
  "Test contamination, hidden-answer access, and suspicious outputs are checked before ranking.",
];

const WHAT_WE_CHECK = [
  {
    title: "Replayability",
    detail: "A submission should be runnable again through the organizer-side replay path when `code/run.py` is provided.",
  },
  {
    title: "Traceability",
    detail: "Important numerical claims must be supported by logs and structured claims rather than only narrative text.",
  },
  {
    title: "Claim Verification",
    detail: "Reported numbers are checked against the experiment record instead of being accepted at face value.",
  },
  {
    title: "Contamination Detection",
    detail: "Hidden-answer access, label leakage, and suspicious benchmark-specific outputs are treated as integrity violations.",
  },
];

export default function IntegrityPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <SectionHeading
        title="Integrity Verification"
        subtitle="AISB does not treat benchmark scoring as enough. A submission must be replayable, traceable, and defensible before it is accepted as a real research result."
      />

      <div className="flex justify-center mb-10">
        <Image
          src="/integrity-pipeline.png"
          alt="AISB integrity pipeline"
          width={2000}
          height={400}
          className="rounded-xl"
          style={{ maxWidth: "860px", width: "100%", height: "auto" }}
        />
      </div>

      <section className="card-gold rounded-2xl p-6 bg-white mb-8">
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl text-[var(--navy-700)] mb-4">
          Core Idea
        </h2>
        <div className="space-y-3 text-sm text-[var(--gray-500)]">
          {PRINCIPLES.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        {WHAT_WE_CHECK.map((item) => (
          <div key={item.title} className="card rounded-2xl p-6 bg-white">
            <h3 className="text-xl font-semibold text-[var(--navy-700)] mb-3">{item.title}</h3>
            <p className="text-sm text-[var(--gray-500)] leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="card rounded-2xl p-6 bg-white mt-8">
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl text-[var(--navy-700)] mb-4">
          What This Means For Participants
        </h2>
        <div className="space-y-3 text-sm text-[var(--gray-500)]">
          <p>Do not submit speculative papers without experiments.</p>
          <p>Do not report numbers that your own logs cannot support.</p>
          <p>Do not treat a self-reported benchmark score as the final official score.</p>
          <p>Use the local replay and validation tools before treating a package as submission-ready.</p>
        </div>
      </section>
    </div>
  );
}
