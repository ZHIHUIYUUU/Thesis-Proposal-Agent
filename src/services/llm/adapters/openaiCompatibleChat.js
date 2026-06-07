export async function callOpenAiCompatibleChat(config, prompt, options = {}) {
  const response = await options.fetchImpl(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    signal: options.signal,
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });
  const json = await readJson(response);
  const text = json.choices?.[0]?.message?.content;
  if (!text) throw new Error("AI 服务返回中没有 chat message content。");
  return { text, raw: json };
}

async function readJson(response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI 服务返回 ${response.status}: ${text.slice(0, 240)}`);
  }
  return response.json();
}
