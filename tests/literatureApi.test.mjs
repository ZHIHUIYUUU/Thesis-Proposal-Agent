import assert from "node:assert/strict";
import { searchOpenAlex } from "../src/services/literatureApi.js";

{
  const result = await searchOpenAlex("https://api.openalex.org/works?search=vehicle+routing", async () => ({
    ok: true,
    json: async () => ({
      meta: { count: 24 },
      results: [
        {
          id: "https://openalex.org/W1",
          title: "Vehicle routing with time windows",
          publication_year: 2024,
          cited_by_count: 18,
          primary_location: {
            source: { display_name: "European Journal of Operational Research" },
            landing_page_url: "https://doi.org/10.1000/example",
          },
          open_access: { oa_url: "https://example.org/pdf" },
        },
      ],
    }),
  }));

  assert.equal(result.works.length, 1);
  assert.equal(result.meta.count, 24);
  assert.equal(result.url, "https://api.openalex.org/works?search=vehicle+routing");
}

{
  let receivedSignal = false;
  await assert.rejects(
    () =>
      searchOpenAlex(
        "https://api.openalex.org/works?search=slow",
        async (_url, init = {}) => {
          receivedSignal = Boolean(init.signal);
          const error = new Error("This operation was aborted");
          error.name = "AbortError";
          throw error;
        },
        { timeoutMs: 5 },
      ),
    /OpenAlex 请求超时/,
  );
  assert.equal(receivedSignal, true);
}

console.log("literature api tests passed");
