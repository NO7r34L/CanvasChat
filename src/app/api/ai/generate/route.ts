import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/lib/stack/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: NextRequest) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt" },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are a creative SVG path generator for a canvas application. 
Generate a simple SVG path element based on this description: "${prompt}".
Return ONLY the SVG path data (the 'd' attribute value), nothing else.
Make it clean, simple, and visually appealing.
The path should be centered around coordinates (0,0) with a reasonable size (200-400 units).

Example output format:
M 150 0 L 75 200 L 225 200 Z

Your SVG path:`,
    });

    return NextResponse.json({
      svgPath: text.trim(),
      prompt,
    });
  } catch (error) {
    console.error("Error generating AI drawing:", error);
    return NextResponse.json(
      { error: "Failed to generate drawing" },
      { status: 500 }
    );
  }
}

