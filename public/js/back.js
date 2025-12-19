document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
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
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.checked) {
            li.classList.add('completed');
        }
        li.innerHTML = `
            <input type="checkbox" ${task.checked ? 'checked' : ''} onchange="updateTask('${task._id}', this.checked)">
            <span>${task.description}</span>
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
