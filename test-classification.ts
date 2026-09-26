import { Category, categoryValues } from "./data.ts";
import { sendNoulRequest } from "./decisions.ts";
import type { NoulAnswers } from "./decisions.ts";
import {
  createCategoryQuestions,
  createFieldQuestions,
  selectEnabledFields,
  selectRelevantCategories,
} from "./questions.ts";

type ExpectedField = {
  category: Category;
  id: number;
};

type TestCase = {
  id: string;
  text: string;
  expected: ExpectedField[];
};

type CsvRow = Record<string, string | number | boolean>;

const inputPath = Deno.args[0] ?? "test-cases.json";
const outputPath = Deno.args[1] ?? "classification-results.csv";
const testCases = JSON.parse(await Deno.readTextFile(inputPath)) as TestCase[];

function fieldKey(category: Category, id: number): string {
  return `${category}_${id}`;
}

function fieldName({ category, id }: ExpectedField): string {
  return categoryValues[category]?.find((field) => field.id === id)?.name ?? "";
}

function validateTestCases(cases: TestCase[]): void {
  for (const testCase of cases) {
    if (!testCase.id || !testCase.text || testCase.expected.length === 0) {
      throw new Error(`Invalid test case: ${testCase.id || "unknown"}`);
    }

    for (const expected of testCase.expected) {
      if (!fieldName(expected)) {
        throw new Error(
          `Unknown expected field ${
            fieldKey(expected.category, expected.id)
          } in ${testCase.id}`,
        );
      }
    }
  }
}

function escapeCsv(value: string | number | boolean): string {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows: CsvRow[]): string {
  const headers = [
    "case_id",
    "text",
    "duration_ms",
    "case_passed",
    "status",
    "category",
    "field_id",
    "field_name",
    "confidence",
    "category_selected",
    "category_confidence",
    "selected_categories",
    "category_confidences",
    "error",
  ];

  return [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsv(row[header] ?? "")).join(",")
    ),
  ].join("\n") + "\n";
}

validateTestCases(testCases);

const rows: CsvRow[] = [];
let passedCases = 0;

for (const [index, testCase] of testCases.entries()) {
  console.log(`[${index + 1}/${testCases.length}] ${testCase.id}`);
  const startedAt = performance.now();

  try {
    const categoryAnswers = await sendNoulRequest(
      testCase.text,
      createCategoryQuestions(),
    );
    const selectedCategories = selectRelevantCategories(categoryAnswers);
    const fieldAnswers: NoulAnswers = selectedCategories.length > 0
      ? await sendNoulRequest(
        testCase.text,
        createFieldQuestions(selectedCategories),
      )
      : {};
    const durationMs = Math.round(performance.now() - startedAt);
    console.log(`  Completed in ${durationMs} ms`);
    const categoryConfidences = Object.values(Category)
      .map((category) => `${category}:${categoryAnswers[category]?.noul ?? ""}`)
      .join(" | ");
    const enabledFields = selectEnabledFields(fieldAnswers, selectedCategories);
    const enabledKeys = new Set(
      enabledFields.map((field) => fieldKey(field.category, field.id)),
    );
    const expectedKeys = new Set(
      testCase.expected.map((field) => fieldKey(field.category, field.id)),
    );
    const casePassed = testCase.expected.every((field) =>
      enabledKeys.has(fieldKey(field.category, field.id))
    );

    if (casePassed) passedCases++;

    for (const expected of testCase.expected) {
      const key = fieldKey(expected.category, expected.id);
      const answer = fieldAnswers[key];
      rows.push({
        case_id: testCase.id,
        text: testCase.text,
        duration_ms: durationMs,
        case_passed: casePassed,
        status: enabledKeys.has(key) ? "PASS" : "MISSING",
        category: expected.category,
        field_id: expected.id,
        field_name: fieldName(expected),
        confidence: answer?.noul ?? "",
        category_selected: selectedCategories.includes(expected.category),
        category_confidence: categoryAnswers[expected.category]?.noul ?? "",
        selected_categories: selectedCategories.join(" | "),
        category_confidences: categoryConfidences,
        error: "",
      });
    }

    for (const extra of enabledFields) {
      if (expectedKeys.has(fieldKey(extra.category, extra.id))) continue;

      rows.push({
        case_id: testCase.id,
        text: testCase.text,
        duration_ms: durationMs,
        case_passed: casePassed,
        status: "EXTRA",
        category: extra.category,
        field_id: extra.id,
        field_name: extra.name,
        confidence: extra.confidence,
        category_selected: true,
        category_confidence: categoryAnswers[extra.category]?.noul ?? "",
        selected_categories: selectedCategories.join(" | "),
        category_confidences: categoryConfidences,
        error: "",
      });
    }
  } catch (error) {
    const durationMs = Math.round(performance.now() - startedAt);
    console.error(`  Failed after ${durationMs} ms`);
    rows.push({
      case_id: testCase.id,
      text: testCase.text,
      duration_ms: durationMs,
      case_passed: false,
      status: "ERROR",
      category: "",
      field_id: "",
      field_name: "",
      confidence: "",
      category_selected: false,
      category_confidence: "",
      selected_categories: "",
      category_confidences: "",
      error: error instanceof Error ? error.message : String(error),
    });
  }

  await Deno.writeTextFile(outputPath, toCsv(rows));
}

console.log(`Completed: ${passedCases}/${testCases.length} cases passed.`);
console.log(`Detailed results: ${outputPath}`);
