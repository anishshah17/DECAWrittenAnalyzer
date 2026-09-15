import { preparedEvents } from "@/lib/preparedEvents";

const GEMINI_MODEL = "gemini-3.5-flash-lite";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Gemini is not configured on the server." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { draft?: string } | null;
  if (!body?.draft?.trim()) {
    return Response.json({ error: "Written text is required for event detection." }, { status: 400 });
  }

  const eventChoices = preparedEvents
    .map((event) => `${event.code}: ${event.name} (${event.category})`)
    .join("\n");
  const prompt = `Identify which DECA prepared event best matches this written project.
Use the event names and categories below. Consider the project's purpose, audience, deliverables, research, and language. Do not guess from one keyword.

Events:
${eventChoices}

Written project:
${body.draft.slice(0, 40000)}

Return only JSON in this shape:
{"code":"exact event code","confidence":0,"reason":"one concise sentence"}
Confidence must be an integer from 0 to 100.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 180 },
        }),
      },
    );

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
      return Response.json({ error: data?.error?.message ?? "Gemini could not identify the event." }, { status: 502 });
    }

    const data = (await response.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const rawText = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    if (!rawText) return Response.json({ error: "Gemini returned no event match." }, { status: 502 });

    const detected = JSON.parse(rawText.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim()) as {
      code?: string;
      confidence?: number;
      reason?: string;
    };
    const event = preparedEvents.find((item) => item.code === detected.code);
    if (!event) return Response.json({ error: "Gemini returned an unknown event match." }, { status: 502 });

    return Response.json({
      code: event.code,
      name: event.name,
      category: event.category,
      confidence: Math.max(0, Math.min(100, Math.round(detected.confidence ?? 0))),
      reason: detected.reason ?? "The written appears to match this event.",
    });
  } catch {
    return Response.json({ error: "The event detection service could not be reached." }, { status: 502 });
  }
}
