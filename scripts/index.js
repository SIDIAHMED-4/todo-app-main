const themIcon = document.querySelector("#themIcon")
const inputElement= document.querySelector(".TaskSearchBar__input");
const TaskListElement = document.querySelector(".TaskList__list")
const getDeletIcon = () => document.querySelectorAll(".TaskList__list--deletIcon")
const TaskListCheckbox = () =>  document.querySelectorAll(".TaskList__list--checkbox")
const itemsLeft = document.querySelector(".items-left")
const allBtn = document.querySelector(".All")
const activeBtn = document.querySelector(".Active")
const completedBtn = document.querySelector(".Completed")
const clearCompletedBtn = document.querySelector(".Clear-Completed")
const filterBtns = [allBtn, activeBtn, completedBtn];

const fetchData = (key) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : false;
}

const addTask = () => {
  const taskValue = inputElement.value;
  if (!taskValue) return;
  const task = {
    value: taskValue,
    isCompleted: false,
  }
  const tasks = fetchData("tasks") || [];
  tasks.push(task)
  saveToDB("tasks", tasks)
  initTaskList(tasks)
};

const renderTaskList = (tasks) => {
  let taskList = '';
  tasks.forEach((task) => {
    taskList += ` <li class="TaskList__list--taskContent${task.isCompleted ? " TaskList__list--taskContent--isActive" : "" }">
            <div class="TaskList__list--checkbox" tabindex="0" role="button">
              <img class="TaskList__list--checkboxImg" src="./images/icon-check.svg" alt="icon-check">
            </div>
            <div class="TaskList__list--ValueContent">
              <p class="TaskList__list--Value">
                ${task.value}
              </p></div>
              <img class="TaskList__list--deletIcon" src="./images/icon-cross.svg" alt="icon-cross">
          </li>
          `
  });
  TaskListElement.innerHTML = taskList;
  inputElement.value = "";
  updateItemsLeft(tasks)
};

const deletTask = (e, index) => {
  const answer = confirm("Do you want to remove the Task?")
  if (!answer) return;
  const tasks = fetchData("tasks")
  tasks.splice(index, 1)
  saveToDB("tasks", tasks)
  initTaskList(tasks)
}

inputElement.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask()
  }
});

const initTaskListener = () => {
  getDeletIcon().forEach((icon, index) => {
    icon.addEventListener("click", (e) => deletTask(e, index))
  });

  TaskListCheckbox().forEach((box, index) => {
    box.addEventListener("click", (e) => toggleTask(e, index));
  });
}

const saveToDB = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

let isDark = false;
themIcon.addEventListener("click", () => {
  document.body.classList.toggle("darkMode")
  isDark = !isDark
  themIcon.src = isDark ? "./images/icon-sun.svg" : "./images/icon-moon.svg"  
});

const initDataOnStartup = () => {
  initTaskList(fetchData("tasks"));
}

const initTaskList = (tasks) => {
  renderTaskList(tasks)
  initTaskListener()
}

const el = document.querySelector(".TaskList__list");

Sortable.create(el, {
  animation: 150,
  onEnd: function () {
    const tasks = [];
    el.querySelectorAll(".TaskList__list--taskContent").forEach(item => {
      const value = item.querySelector(".TaskList__list--Value").textContent.trim();
      const isCompleted = item.classList.contains("TaskList__list--taskContent--isActive");
      tasks.push({ value, isCompleted });
    });
    saveToDB("tasks", tasks);
  }
});


const toggleTask = (e, index) => {
  const tasks = fetchData("tasks")
  e.currentTarget.parentElement.classList.toggle("TaskList__list--taskContent--isActive")
  tasks[index].isCompleted = !tasks[index].isCompleted
  saveToDB("tasks", tasks)
  updateItemsLeft(tasks)
}

const updateItemsLeft = (tasks) => {
  const items = tasks.filter(task => !task.isCompleted).length;
  itemsLeft.textContent = `${items} items left`;
}

const highlightActiveFilter = (activeButton) => {
  filterBtns.forEach(btn => btn.style.color = "inherit")
  activeButton.style.color = "blue"
}

allBtn.addEventListener("click", () => {
  const tasks = fetchData("tasks") || []
  initTaskList(tasks)
  highlightActiveFilter(allBtn)
})

activeBtn.addEventListener("click", () => {
  const tasks = (fetchData("tasks") || []).filter(task => !task.isCompleted)
  initTaskList(tasks)
  highlightActiveFilter(activeBtn)
})

completedBtn.addEventListener("click", () => {
  const tasks = (fetchData("tasks") || []).filter(task => task.isCompleted)
  initTaskList(tasks)
  highlightActiveFilter(completedBtn)
})

clearCompletedBtn.addEventListener("click", () => {
  let tasks = fetchData("tasks") || []
  tasks = tasks.filter(task => !task.isCompleted)
  saveToDB("tasks", tasks)
  initTaskList(tasks)
})

initDataOnStartup()
