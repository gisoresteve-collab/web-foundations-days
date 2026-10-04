let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];
function searchNotes(word) {
  const searchWord = word.toLowerCase();

  return notes.filter((note) =>
    note.text.toLowerCase().includes(searchWord)
  );
}
function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];

  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }

  return longest;
}
function countByCategory() {
  const counts = {};

  for (const note of notes) {
    if (counts[note.category]) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  }

  return counts;
}
function getSummary() {
  const counts = countByCategory();
  const word = notes.length === 1 ? "note" : "notes";

  return `${notes.length} ${word}: ${counts.personal} personal, ${counts.work} work, ${counts.study} study.`;
}
function isDuplicate(text) {
  const cleanedText = text.trim().toLowerCase();

  return notes.some((note) =>
    note.text.trim().toLowerCase() === cleanedText
  );
}
function addNote(text, category) {
  const cleanedText = text.trim();
  const validCategories = ["personal", "work", "study"];

  if (cleanedText.length < 1 || cleanedText.length > 200) {
    console.log("Reason: note must be between 1 and 200 characters.");
    return false;
  }

  if (isDuplicate(cleanedText)) {
    console.log("Reason: duplicate note.");
    return false;
  }

  if (!validCategories.includes(category)) {
    console.log("Reason: invalid category.");
    return false;
  }

  const newId = notes.length > 0
    ? Math.max(...notes.map((note) => note.id)) + 1
    : 1;

  notes.push({
    id: newId,
    text: cleanedText,
    category: category,
  });

  return true;
}
// Function 1 tests
console.log(searchNotes("DAY")); // Expected: note with id 2
console.log(searchNotes("football")); // Expected: []

// Function 2 tests
console.log(longestNote()); // Expected: note with id 3
console.log(longestNote().text.length); // Expected: 33

// Function 3 tests
console.log(countByCategory()); // Expected: { personal: 2, work: 1, study: 2 }
console.log(countByCategory().study); // Expected: 2

// Function 4 tests
console.log(getSummary()); // Expected: "5 notes: 2 personal, 1 work, 2 study."
console.log(getSummary().includes("5 notes")); // Expected: true

// Function 5 tests
console.log(isDuplicate("Call mum")); // Expected: true
console.log(isDuplicate("  CALL MUM  ")); // Expected: true

// Function 6 tests
console.log(addNote("Learn JavaScript functions", "study")); // Expected: true
console.log(addNote("  CALL MUM  ", "personal")); // Expected: false
console.log(addNote("", "study")); // Expected: false
console.log(addNote("New task", "invalid")); // Expected: false