const noteText = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

function updateCounts() {
  const text = noteText.value;
  const characterCount = text.length;

  const trimmedText = text.trim();
  const words = trimmedText === "" ? 0 : trimmedText.split(/\s+/).length;

  charCount.textContent = `${characterCount} / 200 characters`;
  wordCount.textContent = `${words} words`;

  charCount.classList.toggle("warning", characterCount > 180);
  charCount.classList.toggle("over", characterCount > 200);
}

noteText.addEventListener("input", () => {
  updateCounts();
  localStorage.setItem("quicknotes-draft", noteText.value);
});

clearBtn.addEventListener("click", () => {
  noteText.value = "";
  localStorage.removeItem("quicknotes-draft");
  updateCounts();
  noteText.focus();
});

noteText.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    noteText.value = "";
    localStorage.removeItem("quicknotes-draft");
    updateCounts();
    noteText.focus();
  }
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  if (isDark) {
    themeToggle.textContent = "Light mode";
    localStorage.setItem("quicknotes-theme", "dark");
  } else {
    themeToggle.textContent = "Dark mode";
    localStorage.setItem("quicknotes-theme", "light");
  }
});

const savedDraft = localStorage.getItem("quicknotes-draft");

if (savedDraft !== null) {
  noteText.value = savedDraft;
}

const savedTheme = localStorage.getItem("quicknotes-theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "Light mode";
} else {
  themeToggle.textContent = "Dark mode";
}

updateCounts();