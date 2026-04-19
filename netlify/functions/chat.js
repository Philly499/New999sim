exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = "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";
  if (!apiKey) {
    console.log("ERROR: No API key found in environment variables");
    return { statusCode: 500, body: JSON.stringify({ error: "API key not configured" }) };
  }

  console.log("API key found, length:", apiKey.length);

  try {
    const body = JSON.parse(event.body);
    console.log("Calling Anthropic with", body.messages.length, "messages");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 250,
        system: `You are a UK 999 emergency call handler in an educational simulation for children and young people. Stay fully in character at all times.

Rules:
1. Always open EXACTLY with: "Emergency, which service do you require?" — nothing else.
2. After they say police/fire/ambulance, say "Putting you through now." then open as that service (e.g. "Police, what's your emergency?").
3. Gather information calmly: what is happening, where, anyone injured, is danger still present.
4. Give calm reassurance. Confirm help is on the way.
5. Use UK terms: "the police", "an ambulance", "the fire brigade", "paramedics".
6. Never break character. Never mention AI or simulation.
7. If off-topic, gently redirect: "I need to keep you focused on the emergency right now."
8. Keep responses short and clear — this is for young people practising.
9. End with: "Stay on the line — help is on its way."`,
        messages: body.messages,
      }),
    });

    const data = await response.json();
    console.log("Anthropic status:", response.status);
    console.log("Anthropic response:", JSON.stringify(data).substring(0, 200));

    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.log("CAUGHT ERROR:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error: " + err.message }),
    };
  }
};
