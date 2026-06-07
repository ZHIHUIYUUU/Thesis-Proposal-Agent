export async function callOpenAiResponses(config, prompt, options = {}) {
  const response = await options.fetchImpl(`${config.baseUrl}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    signal: options.signal,
    body: JSON.stringify({
      model: config.model,
      input: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user },
      ],
      text: {
        format: {
          type: "json_schema",
          name: prompt.schema.name,
          strict: prompt.schema.strict,
          schema: prompt.schema.schema,
        },
      },
    }),
  });
  const json = await readJson(response);
  return { text: extractText(json), raw: json };
}

function extractText(json) {
  if (typeof json.output_text === "string") return json.output_text;
  const outputText = (json.output || [])
    .flatMap((item) => item.content || [])
    .map((item) => item.text || item.value || "")
    .filter(Boolean)
    .join("\n");
  if (outputText) return outputText;
  throw new Error("AI 服务返回中没有可读取文本。");
}

async function readJson(response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI 服务返回 ${response.status}: ${text.slice(0, 240)}`);
  }
  return response.json();
}
