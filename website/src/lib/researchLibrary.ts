import fs from "node:fs";
import path from "node:path";
import { PUBLIC_BLOB_ROOT } from "@/lib/publicLinks";

export type PaperItem = {
  title: string;
  href: string;
  venue?: string | null;
  type?: string | null;
};

export type LibraryGroup = {
  id: string;
  title: string;
  count: number;
  jsonHref: string;
  benchmarkHref?: string;
  papers: PaperItem[];
};

type RawPaper = Record<string, unknown>;

const GITHUB_ROOT = PUBLIC_BLOB_ROOT;

function repoFile(...segments: string[]): string {
  return path.join(/* turbopackIgnore: true */ process.cwd(), "..", ...segments);
}

const NLPCC_GROUPS: Array<{
  id: string;
  title: string;
  localJson: string;
  jsonHref: string;
  benchmarkHref: string;
}> = [
  {
    id: "T1",
    title: "T1 Agentic Coding & Research Engineering",
    localJson: repoFile("AISB", "Agentic_Coding", "papers.json"),
    jsonHref: `${GITHUB_ROOT}/AISB/Agentic_Coding/papers.json`,
    benchmarkHref: `${GITHUB_ROOT}/benchmarks/nlpcc/T1`,
  },
  {
    id: "T2",
    title: "T2 Formal Mathematical Proof",
    localJson: repoFile("AISB", "MathProof", "papers.json"),
    jsonHref: `${GITHUB_ROOT}/AISB/MathProof/papers.json`,
    benchmarkHref: `${GITHUB_ROOT}/benchmarks/nlpcc/T2`,
  },
  {
    id: "T3",
    title: "T3 LifeSci/ADMET Scientific Discovery",
    localJson: repoFile("AISB", "LifeSciDrug", "papers.json"),
    jsonHref: `${GITHUB_ROOT}/AISB/LifeSciDrug/papers.json`,
    benchmarkHref: `${GITHUB_ROOT}/benchmarks/nlpcc/T3`,
  },
];

const AISB_GROUPS: Array<{ id: string; title: string }> = [
  { id: "Agentic_Coding", title: "Agentic Coding" },
  { id: "AgentSystems", title: "Agent Systems" },
  { id: "ClimateEarth", title: "Climate & Earth" },
  { id: "EmbodiedAI", title: "Embodied AI" },
  { id: "LifeSciDrug", title: "LifeSci & Drug Discovery" },
  { id: "LMReasoning", title: "LM Reasoning" },
  { id: "MaterialScience", title: "Material Science" },
  { id: "MathProof", title: "Math Proof" },
  { id: "ModelEfficiency", title: "Model Efficiency" },
  { id: "MultimodalFusion", title: "Multimodal Fusion" },
  { id: "ResearchProcess", title: "Research Process" },
  { id: "SelfEvolvingRL", title: "Self-Evolving RL" },
];

function loadJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function rawPapers(data: unknown): RawPaper[] {
  if (Array.isArray(data)) {
    return data.filter((item): item is RawPaper => !!item && typeof item === "object");
  }
  if (data && typeof data === "object" && Array.isArray((data as { papers?: unknown[] }).papers)) {
    return (data as { papers: unknown[] }).papers.filter((item): item is RawPaper => !!item && typeof item === "object");
  }
  return [];
}

function paperHref(item: RawPaper): string | null {
  const direct = [
    item.paper_url,
    item.url,
    item.website,
  ].find((value): value is string => typeof value === "string" && value.length > 0);
  if (direct) return direct;

  const arxiv = [item.arxiv, item.arxiv_id].find((value): value is string => typeof value === "string" && value.length > 0);
  if (arxiv) return `https://arxiv.org/abs/${arxiv}`;

  const bioRxiv = item.bioRxiv;
  if (typeof bioRxiv === "string" && bioRxiv.length > 0) {
    return `https://www.biorxiv.org/content/10.1101/${bioRxiv}v1`;
  }

  const doi = item.doi;
  if (typeof doi === "string" && doi.length > 0) {
    return `https://doi.org/${doi}`;
  }

  return null;
}

function normalizePapers(data: unknown, limit: number): PaperItem[] {
  return rawPapers(data)
    .map((item) => {
      const href = paperHref(item);
      const title = typeof item.title === "string" ? item.title : null;
      if (!href || !title) return null;
      return {
        title,
        href,
        venue: typeof item.venue === "string" ? item.venue : null,
        type: typeof item.type === "string" ? item.type : null,
      } satisfies PaperItem;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .slice(0, limit);
}

export function getNlpccPaperGroups(limit = 8): LibraryGroup[] {
  return NLPCC_GROUPS.map((group) => {
    const data = loadJson(group.localJson);
    const papers = normalizePapers(data, limit);
    return {
      id: group.id,
      title: group.title,
      count: rawPapers(data).length,
      jsonHref: group.jsonHref,
      benchmarkHref: group.benchmarkHref,
      papers,
    };
  });
}

export function getAisbPaperGroups(limit = 4): LibraryGroup[] {
  return AISB_GROUPS.map((group) => {
    const localJson = repoFile("AISB", group.id, "papers.json");
    const data = loadJson(localJson);
    return {
      id: group.id,
      title: group.title,
      count: rawPapers(data).length,
      jsonHref: `${GITHUB_ROOT}/AISB/${group.id}/papers.json`,
      papers: normalizePapers(data, limit),
    };
  });
}
