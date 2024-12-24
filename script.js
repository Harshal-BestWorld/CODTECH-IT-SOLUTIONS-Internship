document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const toggleThemeBtn = document.getElementById('toggleThemeBtn');

    // Load tasks from local storage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToDOM(task.text, task.completed));
    };

    // Save tasks to local storage
    const saveTasks = () => {
        const tasks = Array.from(taskList.children).map(li => ({
            text: li.firstChild.textContent,
            completed: li.classList.contains('completed'),
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Add Task to DOM
    const addTaskToDOM = (taskText, completed = false) => {
        const li = document.createElement('li');
        li.textContent = taskText;
        li.draggable = true;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        li.appendChild(deleteBtn);
        li.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks();
        });

        if (completed) li.classList.add('completed');

        // Drag-and-Drop Events
        li.addEventListener('dragstart', () => li.classList.add('dragging'));
        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
            saveTasks();
        });

        taskList.appendChild(li);
    };

    // Add Task
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTaskToDOM(taskText);
            saveTasks();
            taskInput.value = '';
        }
    });

    // Clear All Tasks
    clearAllBtn.addEventListener('click', () => {
        taskList.innerHTML = '';
        saveTasks();
    });

    // Toggle Theme
    toggleThemeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });

    // Drag-and-Drop Logic
    taskList.addEventListener('dragover', e => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(taskList, e.clientY);
        if (afterElement) {
            taskList.insertBefore(draggingItem, afterElement);
        } else {
            taskList.appendChild(draggingItem);
        }
    });

    const getDragAfterElement = (container, y) => {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            }
            return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    };

    loadTasks();
});
