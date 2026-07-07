import { NextResponse } from "next/server";

const AI_SYS = `You are the official AI assistant for Monarch Blends, a premium cigarette brand by Shree Siddheshwari Enterprise Pvt. Ltd., Gujarat India.
Key facts:
- Tobacco: hand-picked, highest quality
- Formula: developed in North America by expert scientists
- Made in India (Gujarat)
- 2+ years R&D before launch
- 100% COTPA and GST compliant
- Exclusive master rights to sell cigarette manufacturing machinery across India and neighbouring countries
- Customisable tube system for machinery partners
- Three dealer tiers: Retail Dealer, Area Distributor, State Distributor
Be professional, concise, and helpful. No markdown formatting. Answer only what is asked.`;

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { text: "AI chat is not configured yet. Please add ANTHROPIC_API_KEY on the server." },
        { status: 200 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
        max_tokens: 800,
        system: AI_SYS,
        messages: [{ role: "user", content: message }]
      })
    });

    if (!response.ok) {
      return NextResponse.json(
        { text: "Sorry, I could not process that right now." },
        { status: 200 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      text: data.content?.[0]?.text || "Sorry, I could not process that."
    });
  } catch {
    return NextResponse.json({ text: "Connection error. Please try again." }, { status: 200 });
  }
}
