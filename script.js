// Render task
function renderTask(task) {
  let taskColumn = document.getElementById(task.status);
  let taskElement = document.createElement("div");
  taskElement.className = "task mb-2";
  taskElement.id = task.id;
  taskElement.draggable = true;
  taskElement.innerHTML = `
        <h5>${task.title}</h5>
        <p>${task.description}</p>
        <p>Deadline: ${task.deadline}</p>
        <button class="btn btn-danger btn-sm delete-task-btn">Delete</button>
    `;
  taskColumn.appendChild(taskElement);

  // Add event listener for deleting task
  taskElement
    .querySelector(".delete-task-btn")
    .addEventListener("click", function () {
      deleteTask(task.id);
      taskElement.remove();
    });

  // Check if task is overdue or nearing deadline and apply appropriate styling
  let today = new Date();
  let taskDeadline = new Date(task.deadline);
  let daysUntilDeadline = Math.floor(
    (taskDeadline - today) / (1000 * 60 * 60 * 24)
  );
  if (daysUntilDeadline < 0) {
    taskElement.classList.add("task-overdue");
  } else if (daysUntilDeadline < 3) {
    taskElement.classList.add("task-nearing-deadline");
  }

  // Add drag event listeners
  taskElement.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", task.id);
  });
}
