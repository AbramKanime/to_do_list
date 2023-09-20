import {nanoid} from "nanoid"

const taskList = document.getElementById('task-list')
const filterEl = document.getElementById("filter")
const localStorageTodoList = JSON.parse(localStorage.getItem("todoListArray")) || []
displayTasks()

document.getElementById("add-btn").addEventListener("click", () => {
    const taskInput = document.getElementById('taskInput')
    const taskText = taskInput.value.trim()
    
    if (taskText === '') {
        return; // Don't add empty tasks
    }
    
    createTaskObject(taskText)
    displayTasks()
    
    taskInput.value = '' // Clear the input field
})

document.addEventListener("click", e => { 
    // These are set up to handle deletion and checking off of tasks
    if (e.target.dataset.remove) {
        const id = e.target.dataset.remove
        for (let item of localStorageTodoList) {
            if (item.id === id) {
                const index = localStorageTodoList.indexOf(item)
                localStorageTodoList.splice(index, 1)
                localStorage.setItem("todoListArray", JSON.stringify(localStorageTodoList))
                displayTasks()
            }
        }
    }
    if (e.target.dataset.id) {
        for (let item of localStorageTodoList) {
            if (e.target.dataset.id === item.id) {
                item.isChecked = e.target.checked ? true : false
                localStorage.setItem("todoListArray", JSON.stringify(localStorageTodoList))
            }
        }
    }
})

filterEl.addEventListener("change", () => {
    let status
    let filteredArray = []
    
    if (filterEl.value === "completed") {
        status = true
    } else if (filterEl.value === "active") {
        status = false
    } else {
        return displayTasks()
    }
    filteredArray = localStorageTodoList.filter((item) => item.isChecked === status)
    taskList.innerHTML = ''
    filteredArray.map(item => {
        const {task, id, isChecked} = item
        return createTask(task, id, isChecked)
    }).join('')
})

document.getElementById('delete-all-btn').addEventListener('click', () => {
    localStorageTodoList.length = 0
    localStorage.setItem("todoListArray", JSON.stringify(localStorageTodoList))
    displayTasks()
})


function displayTasks() {
    if (localStorageTodoList.length > 0) {
        taskList.innerHTML = ''
        localStorageTodoList.map(item => {
            const {task, id, isChecked} = item
            return createTask(task, id, isChecked)
        }).join('')
        
        if (localStorageTodoList.length > 1) {
            document.getElementById('delete-all-btn').style.display = "block"
        } 
    } else {
        taskList.innerHTML = `
            <h3 class="no-task-placeholder">No Task available</h3>
        `
        document.getElementById('delete-all-btn').style.display = "none"
    }
    
}

function createTaskObject(taskText) {
    const TaskObj = {
        id: nanoid(),
        task: taskText,
        isChecked: false
    }
    localStorageTodoList.push(TaskObj)
    localStorage.setItem("todoListArray", JSON.stringify(localStorageTodoList))
}

function createTask(taskText, id, isChecked) {
    const checked = isChecked ? "checked" : ''
    const taskItem = document.createElement('div')
    taskItem.className = 'task-item'
    taskItem.innerHTML = `
        <input class="check-input" ${checked} type="checkbox" data-id="${id}" />
        <span id=${id}>${taskText}</span>
        <div>
            <button data-remove="${id}" class="remove-btn">Remove</button>
        </div>
    `

    taskList.appendChild(taskItem)
}