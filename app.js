// TaskFlow - JavaScript Functions Web App
// State is kept in one place. Each function has one clear responsibility.

const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const counter = document.getElementById("counter");
const emptyState = document.getElementById("emptyState");
const totalBadge = document.getElementById("totalBadge");
const allCount = document.getElementById("allCount");
const openCount = document.getElementById("openCount");
const doneCount = document.getElementById("doneCount");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");
const progressMessage = document.getElementById("progressMessage");
const clearCompletedButton = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-button");
const todayLabel = document.getElementById("todayLabel");

let tasks = loadTasks();
let currentFilter = "all";

// createTask(text): creates and returns a new task object.
function createTask(text) {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    text: text,
    done: false,
    createdAt: new Date().toISOString()
  };
}

// addTask(text): adds a task to state, then saves and redraws.
function addTask(text) {
  tasks.push(createTask(text));
  saveAndRender();
}

// toggleTask(id): changes a task's completed state using map().
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, done: !task.done } : task
  );
  saveAndRender();
}

// deleteTask(id): removes a task using filter().
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveAndRender();
}

// getVisible(): returns tasks matching the selected filter.
function getVisible() {
  const isOpen = task => !task.done;

  if (currentFilter === "open") return tasks.filter(isOpen);
  if (currentFilter === "done") return tasks.filter(task => task.done);
  return tasks;
}

// taskItem(task): builds one list row and its action controls.
function taskItem(task) {
  const item = document.createElement("li");
  item.className = `task-item${task.done ? " completed" : ""}`;

  const checkbox = document.createElement("button");
  checkbox.className = "task-check";
  checkbox.type = "button";
  checkbox.setAttribute("aria-label", task.done ? "Mark task incomplete" : "Mark task complete");
  checkbox.setAttribute("aria-pressed", String(task.done));
  checkbox.textContent = task.done ? "✓" : "";
  checkbox.addEventListener("click", () => toggleTask(task.id));

  const textWrap = document.createElement("div");
  textWrap.className = "task-text";

  const taskText = document.createElement("span");
  taskText.textContent = task.text; // textContent avoids inserting user text as HTML.

  const meta = document.createElement("small");
  meta.className = "task-meta";
  meta.textContent = task.done ? "Completed" : "In progress";

  textWrap.append(taskText, meta);

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", `Delete task: ${task.text}`);
  deleteButton.title = "Delete task";
  deleteButton.textContent = "×";
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  item.append(checkbox, textWrap, deleteButton);
  return item;
}

// countOpen(): returns how many tasks are not complete.
function countOpen() {
  return tasks.filter(task => !task.done).length;
}

// renderTasks(): redraws the list and dashboard counts.
function renderTasks() {
  list.innerHTML = "";

  getVisible().forEach(task => {
    list.appendChild(taskItem(task));
  });

  const total = tasks.length;
  const completed = tasks.filter(task => task.done).length;
  const open = countOpen();
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  counter.textContent = `${open} ${open === 1 ? "task" : "tasks"} left`;
  totalBadge.textContent = total;
  allCount.textContent = total;
  openCount.textContent = open;
  doneCount.textContent = completed;
  progressPercent.textContent = percent;
  progressBar.style.width = `${percent}%`;

  progressMessage.textContent = total === 0
    ? "Every small step counts."
    : percent === 100
      ? "Wonderful! You completed every task."
      : `${completed} of ${total} tasks completed. Keep going!`;

  emptyState.hidden = getVisible().length !== 0;
  list.hidden = getVisible().length === 0;
  clearCompletedButton.disabled = completed === 0;
  clearCompletedButton.style.opacity = completed === 0 ? "0.45" : "1";

  filterButtons.forEach(button => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

// saveAndRender(): shared helper called after every state update.
function saveAndRender() {
  saveTasks();
  renderTasks();
}

// handleSubmit(event): validates input and hands off to addTask().
function handleSubmit(event) {
  event.preventDefault();
  const text = input.value.trim();

  if (text === "") {
    input.focus();
    input.setAttribute("aria-invalid", "true");
    document.getElementById("formHint").textContent = "Please type a task before adding it.";
    document.getElementById("formHint").style.color = "#d65f7c";
    return;
  }

  input.removeAttribute("aria-invalid");
  document.getElementById("formHint").textContent = "Press Enter or click Add task. Keep it short and actionable.";
  document.getElementById("formHint").style.color = "";
  addTask(text);
  input.value = "";
  input.focus();
}

// saveTasks(): stores task state in browser localStorage.
function saveTasks() {
  localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
}

// loadTasks(): safely loads saved tasks on startup.
function loadTasks() {
  try {
    const saved = localStorage.getItem("taskflow_tasks");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn("Saved tasks could not be loaded.", error);
    return [];
  }
}

// clearCompleted(): removes finished tasks from the list.
function clearCompleted() {
  tasks = tasks.filter(task => !task.done);
  saveAndRender();
}

// Event listeners connect page actions to named functions.
form.addEventListener("submit", handleSubmit);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

clearCompletedButton.addEventListener("click", clearCompleted);

todayLabel.textContent = new Date().toLocaleDateString(undefined, {
  weekday: "short", month: "short", day: "numeric"
}).toUpperCase();

// Initial render after saved state is loaded.
renderTasks();
