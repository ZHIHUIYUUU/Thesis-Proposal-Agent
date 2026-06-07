import { callLlm } from "./callLlm.js";
import { buildAcademicPrompt } from "./academicPrompts.js";
import { normalizeAcademicPayload } from "./academicSchemas.js";
import { normalizeProviderConfig } from "./providerPresets.js";

export async function runAcademicAgent({ task, config, context, feedback = "", fetchImpl, timeoutMs } = {}) {
  const normalizedConfig = normalizeProviderConfig(config);
  const prompt = buildAcademicPrompt(task, context, feedback);
  const response = await callLlm(normalizedConfig, prompt, { fetchImpl, timeoutMs });
  return normalizeAcademicPayload(task, response.text, {
    provider: normalizedConfig.provider,
    model: normalizedConfig.model,
  });
}
