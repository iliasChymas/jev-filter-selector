import { OpenRouter } from "@openrouter/sdk";
import type {
  DecisionsNoulAnswer,
  DecisionsNoulQuestion,
} from "@openrouter/sdk/models";

const MODEL = "typesafe/jev-1.13";

export type NoulQuestion = Omit<DecisionsNoulQuestion, "type">;
export type NoulAnswers = Record<string, DecisionsNoulAnswer>;

const apiKey = Deno.env.get("OPENROUTER_API_KEY");

if (!apiKey) {
  throw new Error("OPENROUTER_API_KEY is not set");
}

const openrouter = new OpenRouter({ apiKey });

export async function sendNoulRequest(
  state: string,
  questions: Record<string, NoulQuestion>,
): Promise<NoulAnswers> {
  const typedQuestions = Object.fromEntries(
    Object.entries(questions).map(([key, question]) => [
      key,
      { ...question, type: "noul" as const },
    ]),
  );

  const response = await openrouter.alpha.decisions.create({
    decisionsRequest: {
      model: MODEL,
      state,
      questions: typedQuestions,
    },
  });

  return response.answers as NoulAnswers;
}

