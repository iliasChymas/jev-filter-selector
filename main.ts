import { sendNoulRequest } from "./decisions.ts";
import {
  createCategoryQuestions,
  createFieldQuestions,
  selectEnabledFields,
  selectRelevantCategories,
} from "./questions.ts";

const deviceDescription = prompt("Describe the device you are looking for: ")
  ?.trim();

if (!deviceDescription) {
  console.error("A device description is required.");
  Deno.exit(1);
}

const categoryAnswers = await sendNoulRequest(
  deviceDescription,
  createCategoryQuestions(),
);

const selectedCategories = selectRelevantCategories(categoryAnswers);
const fieldAnswers = selectedCategories.length > 0
  ? await sendNoulRequest(
    deviceDescription,
    createFieldQuestions(selectedCategories),
  )
  : {};

const enabledFields = selectEnabledFields(fieldAnswers, selectedCategories);

if (enabledFields.length === 0) {
  console.log("No fields were enabled.");
} else {
  console.log("Enabled fields:");
  console.table(enabledFields);
}
