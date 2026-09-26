import { sendNoulRequest } from "./decisions.ts";
import { Category, categoryValues } from "./data.ts";
import {
  createCategoryQuestions,
  createFieldQuestions,
  selectEnabledFields,
  selectRelevantCategories,
} from "./questions.ts";

const PORT = 9000;
const PUBLIC_DIR = new URL("./public/", import.meta.url);
const categoryNames: Record<Category, string> = {
  [Category.WIFI_TYPE]: "Wi-Fi",
  [Category.BLUETOOTH]: "Bluetooth",
  [Category.ESIM]: "eSIM",
  [Category.FEATURE_3GPP]: "3GPP Release",
  [Category.NETWORK_TECHNOLOGIES]: "Network Technologies",
  [Category.USE_CASES]: "Use Cases",
  [Category.FORM_FACTORS]: "Form Factors",
  [Category.VERTICALS]: "Industries & Verticals",
  [Category.DEVICE_TYPES]: "Device Types",
};

function json(
  body: unknown,
  status = 200,
  headers: HeadersInit = {},
): Response {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store", ...headers },
  });
}

async function classify(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Request body must be valid JSON." }, 400);
  }

  const prompt = (body as { prompt?: unknown })?.prompt;
  if (typeof prompt !== "string" || !prompt.trim()) {
    return json({ error: "A non-empty prompt is required." }, 400);
  }
  if (prompt.length > 10_000) {
    return json({ error: "Prompt must be 10,000 characters or fewer." }, 400);
  }

  try {
    const categoryAnswers = await sendNoulRequest(
      prompt.trim(),
      createCategoryQuestions(),
    );
    const selectedCategories = selectRelevantCategories(categoryAnswers);
    const fieldAnswers = selectedCategories.length
      ? await sendNoulRequest(
        prompt.trim(),
        createFieldQuestions(selectedCategories),
      )
      : {};

    return json({
      categoryConfidences: Object.fromEntries(
        Object.values(Category).map((category) => [
          category,
          categoryAnswers[category]?.noul ?? 0,
        ]),
      ),
      selectedCategories,
      enabledFields: selectEnabledFields(fieldAnswers, selectedCategories),
    });
  } catch (error) {
    console.error(
      "Classification failed:",
      error instanceof Error ? error.message : error,
    );
    const missingKey = error instanceof Error &&
      error.message === "OPENROUTER_API_KEY is not set";
    return json(
      {
        error: missingKey
          ? "The classification service is not configured."
          : "Classification failed. Please try again.",
      },
      missingKey ? 503 : 502,
    );
  }
}

const assets: Record<string, { file: string; type: string }> = {
  "/": { file: "index.html", type: "text/html; charset=utf-8" },
  "/styles.css": { file: "styles.css", type: "text/css; charset=utf-8" },
  "/app.js": { file: "app.js", type: "text/javascript; charset=utf-8" },
};

async function handler(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);
  if (pathname === "/api/catalog") {
    if (request.method !== "GET") {
      return json({ error: "Method not allowed." }, 405, { allow: "GET" });
    }
    return json({
      categories: Object.values(Category).map((id) => ({
        id,
        name: categoryNames[id],
        values: categoryValues[id],
      })),
    });
  }
  if (pathname === "/api/classify") {
    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405, { allow: "POST" });
    }
    return classify(request);
  }

  const asset = assets[pathname];
  if (!asset || (request.method !== "GET" && request.method !== "HEAD")) {
    return pathname.startsWith("/api/")
      ? json({ error: "Not found." }, 404)
      : new Response("Not found", { status: 404 });
  }
  try {
    const content = await Deno.readFile(new URL(asset.file, PUBLIC_DIR));
    return new Response(request.method === "HEAD" ? null : content, {
      headers: { "content-type": asset.type, "cache-control": "no-cache" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

console.log(`Prompt classifier listening on http://localhost:${PORT}`);
Deno.serve({ port: PORT }, handler);
