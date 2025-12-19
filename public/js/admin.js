document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-task-form');
    form.addEventListener('submit', addTask);
});

async function addTask(event) {
    event.preventDefault();
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;

    try {
        const response = await fetch('http://localhost:5500/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, description })
        });
        if (response.ok) {
            alert('Tâche ajoutée avec succès!');
            document.getElementById('description').value = '';
        } else {
            alert('Erreur lors de l\'ajout de la tâche.');
        }
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Erreur lors de l\'ajout de la tâche.');
    }
}
