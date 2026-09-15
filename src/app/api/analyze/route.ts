import { getEqualPointAllocation } from "@/lib/scoring";

const GEMINI_MODEL = "gemini-3.5-flash-lite";

type AnalyzeRequest = {
  draft?: string;
  eventName?: string;
  category?: string;
  criteria?: string[];
  eventPage?: string;
  eventCode?: string;
};

type GeminiAnalysis = {
  overallScore?: number;
  rubricScores?: { criterion?: string; percent?: number; score?: number; evidence?: string; missing?: string[]; nextStep?: string }[];
  feedbackMarkdown?: string;
};

function clampScore(value: unknown) {
  const score = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : 0;
  return Math.max(0, Math.min(100, score));
}

async function collectEventPdfs(eventPage: string, eventCode: string | undefined, requestUrl: string) {
  const pageResponse = await fetch(eventPage, {
    headers: { "User-Agent": "DECA-Draftroom/1.0" },
    next: { revalidate: 3600 },
  });
  if (!pageResponse.ok) return { parts: [], sources: [] };

  const html = await pageResponse.text();
  const anchors = html.match(/<a\b[\s\S]*?<\/a>/gi) ?? [];
  const requestedDocuments = [
    { label: "official guidelines", pattern: /Guidelines/i },
    { label: "sample event", pattern: /Sample Event/i },
    { label: "penalty checklist", pattern: /Penalty Point Checklist/i },
  ];
  const documents: { label: string; url: string }[] = [];

  for (const requested of requestedDocuments) {
    const anchor = anchors.find((item) => requested.pattern.test(item));
    const href = anchor?.match(/href="([^"]+)"/i)?.[1];
    if (!href || href === "#") continue;
    documents.push({ label: requested.label, url: new URL(href, eventPage).href });
  }

  const localGuides: Record<string, string[]> = {
    BOR: ["/resources/BOR-introduction-2026-2027.pdf", "/resources/BOR-advisor-guide.pdf"],
    "IMC-E": ["/resources/IMCE-advisor-tips.pdf"],
    "IMC-P": ["/resources/IMCP-advisor-tips.pdf"],
    "IMC-S": ["/resources/IMCS-advisor-tips.pdf"],
  };
  for (const path of localGuides[eventCode ?? ""] ?? []) {
    documents.push({ label: "uploaded advisor guide", url: new URL(path, requestUrl).href });
  }

  const parts: { inline_data: { mime_type: string; data: string } }[] = [];
  const sources: string[] = [];
  const fetchedDocuments = await Promise.all(documents.map(async (document) => {
    try {
      const response = await fetch(document.url, { headers: { "User-Agent": "DECA-Draftroom/1.0" } });
      if (!response.ok) return null;
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength > 8 * 1024 * 1024) return null;
      return {
        label: document.label,
        part: {
          inline_data: {
            mime_type: "application/pdf",
            data: Buffer.from(bytes).toString("base64"),
          },
        },
      };
    } catch {
      return null;
    }
  }));
  for (const document of fetchedDocuments) {
    if (!document) continue;
    parts.push(document.part);
    sources.push(document.label);
  }

  return { parts, sources };
}

function parseGeminiAnalysis(rawText: string): GeminiAnalysis {
  const unfencedText = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  const objectStart = unfencedText.indexOf("{");
  const objectEnd = unfencedText.lastIndexOf("}");
  if (objectStart < 0 || objectEnd <= objectStart) throw new Error("No JSON object returned");
  const analysis = JSON.parse(unfencedText.slice(objectStart, objectEnd + 1)) as GeminiAnalysis;
  if (!analysis.feedbackMarkdown?.trim() || !analysis.rubricScores?.length) {
    throw new Error("Incomplete structured response");
  }
  return analysis;
}

async function requestGemini(
  apiKey: string,
  prompt: string,
  referenceParts: { inline_data: { mime_type: string; data: string } }[],
) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }, ...referenceParts] }],
        generationConfig: {
          temperature: 0.25,
          maxOutputTokens: 2200,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              overallScore: { type: "NUMBER" },
              rubricScores: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    criterion: { type: "STRING" },
                    percent: { type: "NUMBER" },
                    evidence: { type: "STRING" },
                    missing: { type: "ARRAY", items: { type: "STRING" } },
                    nextStep: { type: "STRING" },
                  },
                  required: ["criterion", "percent", "evidence", "missing", "nextStep"],
                },
              },
              feedbackMarkdown: { type: "STRING" },
            },
            required: ["rubricScores", "feedbackMarkdown"],
          },
        },
      }),
    },
  );

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
    throw new Error(errorData?.error?.message ?? "The configured Gemini model could not analyze this draft.");
  }

  const data = (await response.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const rawText = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
  if (!rawText) throw new Error("Gemini returned an empty analysis.");
  return parseGeminiAnalysis(rawText);
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Gemini is not configured. Add GEMINI_API_KEY in Vercel Project Settings > Environment Variables." },
      { status: 503 },
    );
  }

  let body: AnalyzeRequest;
  try {
    body = (await request.json()) as AnalyzeRequest;
  } catch {
    return Response.json({ error: "The analysis request was not valid JSON." }, { status: 400 });
  }

  if (!body.draft?.trim() || !body.eventName || !body.category || !body.criteria?.length || !body.eventPage) {
    return Response.json({ error: "A draft and event rubric are required." }, { status: 400 });
  }
  const draft = body.draft;

  let referenceParts: { inline_data: { mime_type: string; data: string } }[] = [];
  let referenceNames: string[] = [];
  try {
    const references = await collectEventPdfs(body.eventPage, body.eventCode, request.url);
    referenceParts = references.parts;
    referenceNames = references.sources;
  } catch {
    // Continue with the rubric and draft if DECA is temporarily unavailable.
  }

  try {
    const batches: string[][] = [];
    for (let index = 0; index < body.criteria.length; index += 5) {
      batches.push(body.criteria.slice(index, index + 5));
    }
    const analyses = await Promise.all(batches.map((batch) => {
      const prompt = `You are a precise DECA prepared-event writing coach.
Analyze only the selected rubric subsections below. Do not score or discuss unselected sections.
The attached PDFs are official event references. Treat the guidelines as the authority, use the sample event as a high-quality structural anchor, and use the penalty checklist for deductions.

Event: ${body.eventName}
Category: ${body.category}
Selected subsections: ${batch.join("; ")}
Reference PDFs attached: ${referenceNames.length ? referenceNames.join(", ") : "none"}

Draft:
${draft.slice(0, 50000)}

Return only valid JSON. Include exactly one rubricScores item for every selected subsection:
{"overallScore":0,"rubricScores":[{"criterion":"exact subsection","percent":0,"evidence":"evidence present","missing":["missing element"],"nextStep":"specific revision"}],"feedbackMarkdown":"## What is working\n...\n## Priority revisions\n...\n## Rubric notes\n..."}

Score only evidence present in the draft. Missing required information must materially lower the score. Do not infer facts. Keep feedback specific and useful.
The percent field is mandatory and must be a normalized percentage from 0 to 100. Do not return the native point value from the DECA evaluation form, such as 4/5, 8/10, or 17/20. Convert any native rubric points into a percentage before returning percent.`;
      return requestGemini(apiKey, prompt, referenceParts);
    }));

    // Preserve request order. Gemini may paraphrase criterion labels, so matching by
    // returned text can silently turn valid scores into zeros.
    const modelScores = analyses.flatMap((analysis) => analysis.rubricScores ?? []);
    const pointAllocation = getEqualPointAllocation(body.criteria.length);
    const rubricScores = body.criteria.map((criterion, index) => {
      const modelScore = modelScores[index];
      const rawScore = clampScore(modelScore?.percent ?? modelScore?.score);
      return {
        label: criterion,
        score: Math.round((rawScore / 100) * pointAllocation[index] * 100) / 100,
        maxScore: pointAllocation[index],
        evidence: modelScore?.evidence ?? "No criterion-level result was returned.",
        missing: modelScore?.missing ?? ["Run this subsection again for a complete result."],
        nextStep: modelScore?.nextStep ?? "Review this subsection against the attached event guidelines.",
      };
    });
    const overallScore = Math.round(rubricScores.reduce((total, item) => total + item.score, 0) * 100) / 100;
    const feedbackMarkdown = analyses.map((analysis, index) => `## Focus batch ${index + 1}\n\n${analysis.feedbackMarkdown}`).join("\n\n");

    return Response.json({
      overallScore,
      rubricScores,
      feedbackMarkdown,
    });
  } catch {
    return Response.json({ error: "The analysis service could not be reached." }, { status: 502 });
  }
}
