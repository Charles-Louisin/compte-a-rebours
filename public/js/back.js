document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    const taskList = document.getElementById('task-list');
    taskList.addEventListener('dragstart', handleDragStart);
    taskList.addEventListener('dragover', handleDragOver);
    taskList.addEventListener('drop', handleDrop);
    taskList.addEventListener('dragend', handleDragEnd);
});

async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:5500/api/tasks/back');
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

function displayTasks(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    // Sort tasks: unchecked first, then checked, then by priority
    tasks.sort((a, b) => {
        if (a.checked !== b.checked) {
            return a.checked ? 1 : -1;
        }
        return b.priority - a.priority;
    });
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.draggable = true;
        li.dataset.id = task._id;
        if (task.checked) {
            li.classList.add('completed');
        }
        li.innerHTML = `
            <div class="task-header">
                <input type="checkbox" ${task.checked ? 'checked' : ''} onchange="updateTask('${task._id}', this.checked)">
            </div>
            <div class="task-body">
                <span class="task-text">${task.description}</span>
            </div>
        `;
        taskList.appendChild(li);
    });
}

async function updateTask(id, checked) {
    try {
        await fetch(`http://localhost:5500/api/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ checked })
        });
        fetchTasks(); // Refresh the list
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.target.closest('.task-item');
    draggedElement.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.target.parentElement, e.clientY);
    const taskList = document.getElementById('task-list');
    if (afterElement == null) {
        taskList.appendChild(draggedElement);
    } else {
        taskList.insertBefore(draggedElement, afterElement);
    }
}

function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    updateTaskPriorities();
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

async function updateTaskPriorities() {
    const taskItems = document.querySelectorAll('.task-item');
    const uncheckedItems = Array.from(taskItems).filter(item => !item.classList.contains('completed'));
    const updates = [];

    uncheckedItems.forEach((item, index) => {
        const id = item.dataset.id;
        const priority = uncheckedItems.length - index; // Higher index = higher priority
        updates.push(updatePriority(id, priority));
    });

    await Promise.all(updates);
    // No need to refresh, DOM is already updated
}

async function updatePriority(id, priority) {
    try {
        await fetch(`http://localhost:5500/api/tasks/${id}/priority`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ priority })
        });
    } catch (error) {
        console.error('Error updating priority:', error);
    }
}

function getPriorityColor(priority) {
    if (priority >= 8) return '#ff6b6b'; // High priority - red
    if (priority >= 5) return '#ffd93d'; // Medium priority - yellow
    return '#6bcf7f'; // Low priority - green
}
