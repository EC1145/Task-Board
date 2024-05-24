// Initialize taskList and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to save taskList and nextId to localStorage
function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));
}

// Function to generate a unique task ID
function generateTaskId() {
  return `task-${nextId++}`;
}

// Function to create a task card
function createTaskCard(task) {
  const card = $(`<div class="task card mb-2" id="${task.id}"></div>`);
  const cardBody = $(`<div class="card-body"></div>`);

  const dueDate = dayjs(task.dueDate);
  const today = dayjs().startOf("day");
  const dueDateFormatted = dueDate.isAfter(today)
    ? dueDate.format("MMM DD, YYYY")
    : dueDate.isBefore(today)
    ? "Past Due"
    : "Due Today";

  const cardBg = dueDate.isBefore(today)
    ? "bg-danger"
    : dueDate.isSame(today)
    ? "bg-warning"
    : "bg-light";

  cardBody.append(`<h5 class="card-title">${task.title}</h5>`);
  cardBody.append(`<p class="card-text">${task.description}</p>`);
  cardBody.append(`<p class="card-text">Due: ${dueDateFormatted}</p>`);
  cardBody.append(`<button class="btn btn-danger btn-sm">Delete</button>`);

  card.append(cardBody);
  card.addClass(cardBg);
  card.draggable({
    appendTo: "body",
    revert: "invalid",
  });

  return card;
}

// Function to render the task list
function renderTaskList() {
  $("#todo-cards, #in-progress-cards, #done-cards").empty();
  taskList.forEach((task) => {
    const laneId = task.status || "to-do";
    $(`#${laneId}-cards`).append(createTaskCard(task));
  });
}

// Function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  const title = $("#taskTitle").val();
  const description = $("#taskDescription").val();
  const dueDate = $("#taskDueDate").val();
  const newTask = {
    id: generateTaskId(),
    title: title,
    description: description,
    dueDate: dueDate,
    status: "to-do",
  };
  taskList.push(newTask);
  saveToLocalStorage();
  renderTaskList();
  $("#taskForm")[0].reset();
  $("#formModal").modal("hide");
}

// Function to handle deleting a task
function handleDeleteTask() {
  const taskId = $(this).closest(".task").attr("id");
  taskList = taskList.filter((task) => task.id !== taskId);
  saveToLocalStorage();
  renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.attr("id");
  const newLane = $(this).attr("id").replace("-cards", "");
  const task = taskList.find((task) => task.id === taskId);
  task.status = newLane;
  saveToLocalStorage();
  renderTaskList();
}

// Event listener for form submission
$("#taskForm").submit(handleAddTask);

// Event listener for task deletion
$(document).on("click", ".task button", handleDeleteTask);

// Make lanes droppable and initialize date picker
$(document).ready(function () {
  $(".lane").droppable({
    accept: ".task",
    drop: handleDrop,
  });
  $("#taskDueDate").datepicker({
    dateFormat: "yy-mm-dd",
  });
  renderTaskList();
});
