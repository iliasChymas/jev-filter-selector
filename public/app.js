const form = document.querySelector("#classify-form");
const prompt = document.querySelector("#prompt");
const submit = document.querySelector("#submit");
const clear = document.querySelector("#clear");
const status = document.querySelector("#status");
const errorBox = document.querySelector("#error");
const catalog = document.querySelector("#catalog");
const resultCount = document.querySelector("#result-count");

let categories = [];
let activeRequest = null;
let requestVersion = 0;

function fieldKey(category, id) {
  return `${category}:${id}`;
}

function render(enabledFields = [], categoryConfidences = {}) {
  const enabled = new Map(
    enabledFields.map((field) => [fieldKey(field.category, field.id), field]),
  );
  catalog.replaceChildren(...categories.map((category) => {
    const card = document.createElement("article");
    card.className = "category-card";
    const confidence = categoryConfidences[category.id];
    const head = document.createElement("header");
    head.innerHTML =
      `<h3>${category.name}</h3><span>${category.values.length} values</span>`;
    if (typeof confidence === "number") {
      const badge = document.createElement("span");
      badge.className = "category-confidence";
      badge.textContent = `${Math.round(confidence * 100)}% category`;
      head.append(badge);
    }
    const values = document.createElement("div");
    values.className = "values";
    for (const value of category.values) {
      const match = enabled.get(fieldKey(category.id, value.id));
      const chip = document.createElement("div");
      chip.className = `value${match ? " enabled" : ""}`;
      const name = document.createElement("span");
      name.textContent = value.name;
      chip.append(name);
      if (match) {
        const badge = document.createElement("strong");
        badge.textContent = `${Math.round(match.confidence * 100)}%`;
        badge.setAttribute(
          "aria-label",
          `${Math.round(match.confidence * 100)} percent confidence`,
        );
        chip.append(badge);
      }
      values.append(chip);
    }
    card.append(head, values);
    return card;
  }));
  catalog.setAttribute("aria-busy", "false");
}

function setError(message = "") {
  errorBox.textContent = message;
  errorBox.hidden = !message;
}

function setLoading(loading) {
  submit.disabled = loading;
  prompt.disabled = loading;
  submit.classList.toggle("loading", loading);
}

async function loadCatalog() {
  try {
    const response = await fetch("/api/catalog");
    if (!response.ok) throw new Error();
    categories = (await response.json()).categories;
    render();
  } catch {
    catalog.setAttribute("aria-busy", "false");
    setError("The filter catalog could not be loaded. Refresh to try again.");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const value = prompt.value.trim();
  if (!value) {
    setError("Enter a device description first.");
    status.textContent = "A prompt is required.";
    prompt.focus();
    return;
  }

  activeRequest?.abort();
  const controller = new AbortController();
  activeRequest = controller;
  const version = ++requestVersion;
  setError();
  setLoading(true);
  status.textContent = "Classifying your prompt…";
  resultCount.textContent = "Analyzing…";

  try {
    const response = await fetch("/api/classify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt: value }),
      signal: controller.signal,
    });
    const result = await response.json();
    if (version !== requestVersion) return;
    if (!response.ok) throw new Error(result.error || "Classification failed.");
    render(result.enabledFields, result.categoryConfidences);
    const count = result.enabledFields.length;
    resultCount.textContent = `${count} ${count === 1 ? "match" : "matches"}`;
    status.textContent = count
      ? `Classification complete with ${count} matches.`
      : "Classification complete. No filter values matched.";
  } catch (error) {
    if (error.name === "AbortError" || version !== requestVersion) return;
    setError(error.message || "Classification failed. Please try again.");
    status.textContent = "Classification failed.";
    resultCount.textContent = "No result";
  } finally {
    if (version === requestVersion) {
      setLoading(false);
      activeRequest = null;
    }
  }
});

clear.addEventListener("click", () => {
  activeRequest?.abort();
  activeRequest = null;
  requestVersion++;
  form.reset();
  setLoading(false);
  setError();
  render();
  resultCount.textContent = "No matches yet";
  status.textContent = "Cleared. Ready for a device description.";
  prompt.focus();
});

prompt.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    form.requestSubmit();
  }
});

loadCatalog();
