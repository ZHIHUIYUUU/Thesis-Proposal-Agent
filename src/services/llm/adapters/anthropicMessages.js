export async function callAnthropicMessages(config, prompt, options = {}) {
  const response = await options.fetchImpl(`${config.baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    signal: options.signal,
    body: JSON.stringify({
      model: config.model,
      max_tokens: 3000,
      system: prompt.system,
      messages: [{ role: "user", content: prompt.user }],
    }),
  });
  const json = await readJson(response);
  const text = (json.content || [])
    .map((item) => item.text || "")
    .filter(Boolean)
    .join("\n");
  if (!text) throw new Error("AI 服务返回中没有 Claude content text。");
  return { text, raw: json };
}

async function readJson(response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI 服务返回 ${response.status}: ${text.slice(0, 240)}`);
  }
  return response.json();
}
