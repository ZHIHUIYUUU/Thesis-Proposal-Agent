import { callLlm } from "./callLlm.js";
import { buildAcademicPrompt } from "./academicPrompts.js";
import { normalizeAcademicPayload } from "./academicSchemas.js";
import { normalizeProviderConfig } from "./providerPresets.js";

export async function runAcademicAgent({ task, config, context, feedback = "", fetchImpl, timeoutMs } = {}) {
  const normalizedConfig = normalizeProviderConfig(config);
  const first = await runOnce(task, normalizedConfig, context, feedback, { fetchImpl, timeoutMs });
  if (first.valid || feedback) {
    return first;
  }
  const repairFeedback = first.validationErrors?.join("；") || "返回内容不完整，请补足所有必填字段。";
  return runOnce(task, normalizedConfig, context, repairFeedback, { fetchImpl, timeoutMs });
}

async function runOnce(task, config, context, feedback, options) {
  const prompt = buildAcademicPrompt(task, context, feedback);
  const response = await callLlm(config, prompt, options);
  return normalizeAcademicPayload(task, response.text, {
    rawText: response.text,
    provider: config.provider,
    model: config.model,
  });
}
