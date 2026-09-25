import {
  Category,
  categoryDetails,
  categoryValues,
  fieldAliases,
} from "./data.ts";
import type { NoulAnswers, NoulQuestion } from "./decisions.ts";

export const CATEGORY_RELEVANCE_THRESHOLD = 0.5;
export const FIELD_RELEVANCE_THRESHOLD = 0.75;

export type EnabledField = {
  category: Category;
  id: number;
  name: string;
  confidence: number;
};

function supportedQuestion(category: Category): NoulQuestion {
  const label = categoryLabel(category);

  return {
    instructions:
      `Does the request require general ${label} support without specifying a particular version or profile?`,
    criteria: {
      true:
        `The request explicitly requires ${label} support and does not name a more specific value.`,
      false:
        `The request does not require ${label}, or it specifies a particular version or profile instead.`,
    },
  };
}

function categoryLabel(category: Category): string {
  return category.replaceAll("_", " ");
}

function fieldQuestion(
  category: Category,
  id: number,
  name: string,
): NoulQuestion {
  if (name === "Supported") return supportedQuestion(category);

  const label = categoryLabel(category);
  const aliases = fieldAliases[category]?.[id] ?? [];
  const aliasGuidance = aliases.length > 0
    ? ` Accepted unambiguous aliases: ${aliases.map((alias) => `"${alias}"`).join(", ")}.`
    : "";

  return {
    instructions:
      `Should the exact filter value "${name}" be selected for the "${label}" category? ` +
      `This category represents ${categoryDetails[category].description}.${aliasGuidance}`,
    criteria: {
      true:
        `The request explicitly mentions "${name}", uses one of its unambiguous aliases, ` +
        `or clearly requests that exact concept.`,
      false:
        `"${name}" is absent, merely related to the request, belongs to another category, ` +
        `or is a broader or narrower value than the one requested.`,
    },
  };
}

export function createCategoryQuestions(): Record<Category, NoulQuestion> {
  return Object.fromEntries(
    Object.values(Category).map((category) => {
      const { description, examples } = categoryDetails[category];
      const label = categoryLabel(category);

      return [
        category,
        {
          instructions:
            `Does the description specify ${label}: ${description}? Examples: ${examples.join(", ")}.`,
          criteria: {
            true: `The description explicitly states or clearly implies a ${label} requirement.`,
            false: `The description does not state or imply a ${label} requirement.`,
          },
        } satisfies NoulQuestion,
      ];
    }),
  ) as Record<Category, NoulQuestion>;
}

export function selectRelevantCategories(
  answers: NoulAnswers,
  threshold = CATEGORY_RELEVANCE_THRESHOLD,
): Category[] {
  return Object.entries(answers)
    .filter(([, answer]) => answer.noul >= threshold)
    .map(([category]) => category as Category);
}

export function createFieldQuestions(
  categories: readonly Category[],
): Record<string, NoulQuestion> {
  return Object.fromEntries(
    categories.flatMap((category) =>
      categoryValues[category].map(({ id, name }) => [
        `${category}_${id}`,
        fieldQuestion(category, id, name),
      ])
    ),
  );
}

export function selectEnabledFields(
  answers: NoulAnswers,
  categories: readonly Category[],
  threshold = FIELD_RELEVANCE_THRESHOLD,
): EnabledField[] {
  return categories.flatMap((category) =>
    categoryValues[category].flatMap(({ id, name }) => {
      const confidence = answers[`${category}_${id}`]?.noul ?? 0;

      return confidence >= threshold
        ? [{ category, id, name, confidence }]
        : [];
    })
  );
}
