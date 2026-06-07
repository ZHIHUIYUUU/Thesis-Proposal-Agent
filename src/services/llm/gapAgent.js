import { callLlm } from "./callLlm.js";
import { normalizeGapAnalysisPayload } from "./gapAnalysisSchema.js";
import { buildGapAnalysisPrompt } from "./gapPrompt.js";
import { normalizeProviderConfig } from "./providerPresets.js";

export async function runGapAnalysis({ config, context, fetchImpl, timeoutMs } = {}) {
  const normalizedConfig = normalizeProviderConfig(config);
  const prompt = buildGapAnalysisPrompt(context);
  const response = await callLlm(normalizedConfig, prompt, { fetchImpl, timeoutMs });
  return normalizeGapAnalysisPayload(response.text, {
    provider: normalizedConfig.provider,
    model: normalizedConfig.model,
  });
}
