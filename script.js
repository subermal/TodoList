
// Select elements
const input = document.getElementById("taskInput");
const addButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const showAllBtn = document.getElementById("showAll");
const showActiveBtn = document.getElementById("showActive");
const showCompletedBtn = document.getElementById("showCompleted");
const filterStatus = document.createElement("p");
filterStatus.id = "filterStatus";
document.querySelector(".container").insertBefore(filterStatus, taskList);

// Load tasks from localStorage
window.onload = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTaskToDOM(task.text, task.completed));
    filterTasks("all");
};

// Add task function
addButton.addEventListener("click", () => {
    const taskText = input.value.trim();
    if (taskText.length < 3) {
        showError("Task must be at least 3 characters long.");
        return;
    }
    addTaskToDOM(taskText, false);
    saveTask(taskText, false);
    input.value = "";
    filterTasks(currentFilter);
});

function addTaskToDOM(text, completed) {
    const li = document.createElement("li");
    li.textContent = text;
    if (completed) li.classList.add("done");
    
    // Complete button
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✅";
    completeBtn.classList.add("complete");
    completeBtn.addEventListener("click", () => {
        li.classList.toggle("done");
        updateTask(text);
        filterTasks(currentFilter);
    });
    
    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.classList.add("delete");
    deleteBtn.addEventListener("click", () => {
        li.remove();
        deleteTask(text);
    });
    
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function saveTask(text, completed) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text, completed });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTask(text) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks = tasks.map(task => task.text === text ? { ...task, completed: !task.completed } : task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(text) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks = tasks.filter(task => task.text !== text);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Task Filtering
let currentFilter = "all";

showAllBtn.addEventListener("click", () => filterTasks("all"));
showActiveBtn.addEventListener("click", () => filterTasks("active"));
showCompletedBtn.addEventListener("click", () => filterTasks("completed"));

function filterTasks(filter) {
    currentFilter = filter;
    document.getElementById("filterStatus").textContent = `Current View: ${filter.charAt(0).toUpperCase() + filter.slice(1)}`;
    const tasks = document.querySelectorAll("li");
    tasks.forEach(task => {
        switch (filter) {
            case "all":
                task.style.display = "flex";
                break;
            case "active":
                task.style.display = task.classList.contains("done") ? "none" : "flex";
                break;
            case "completed":
                task.style.display = task.classList.contains("done") ? "flex" : "none";
                break;
        }
    });
}

function showError(message) {
    alert(message);
}

