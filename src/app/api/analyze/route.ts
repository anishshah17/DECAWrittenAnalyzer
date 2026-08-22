const GEMINI_MODEL = "gemini-3.5-flash-lite";

type AnalyzeRequest = {
  draft?: string;
  eventName?: string;
  category?: string;
  criteria?: string[];
};

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Gemini is not configured on the server." }, { status: 503 });
  }

  let body: AnalyzeRequest;
  try {
    body = (await request.json()) as AnalyzeRequest;
  } catch {
    return Response.json({ error: "The analysis request was not valid JSON." }, { status: 400 });
  }

  if (!body.draft?.trim() || !body.eventName || !body.category || !body.criteria?.length) {
    return Response.json({ error: "A draft and event rubric are required." }, { status: 400 });
  }

  const prompt = `You are a precise DECA prepared-event writing coach.
Analyze the student's draft against the selected event. Do not invent facts or claim to be an official DECA judge.

Event: ${body.eventName}
Category: ${body.category}
Rubric criteria: ${body.criteria.join("; ")}

Draft:
${body.draft.slice(0, 50000)}

Return concise Markdown with exactly these sections:
## What is working
## Priority revisions
## Rubric notes
For each priority revision, include a concrete rewrite direction. Be supportive, specific, and honest about missing evidence.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.35, maxOutputTokens: 1200 },
        }),
      },
    );

    if (!response.ok) {
      const errorData = (await response.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      return Response.json(
        { error: errorData?.error?.message ?? "The configured Gemini model could not analyze this draft." },
        { status: response.status === 401 || response.status === 403 ? 502 : response.status },
      );
    }

    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    if (!text) return Response.json({ error: "Gemini returned an empty analysis." }, { status: 502 });

    return Response.json({ text });
  } catch {
    return Response.json({ error: "The analysis service could not be reached." }, { status: 502 });
  }
}
