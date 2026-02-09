import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:1b",
        prompt: message,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error("Ollama API error");
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) return;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = new TextDecoder().decode(value);
            const lines = text.split("\n").filter((line) => line.trim());

            for (const line of lines) {
              try {
                const json = JSON.parse(line);
                if (json.response) {
                  controller.enqueue(encoder.encode(json.response));
                }
              } catch (e) {
                console.error("Parse error:", e);
              }
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Ollama error:", error);
    return NextResponse.json(
      { error: "Failed to get response from Ollama" },
      { status: 500 },
    );
  }
}
