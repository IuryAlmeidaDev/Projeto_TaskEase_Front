// ui.js
export function displayTasks(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Limpa a lista de tarefas

    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${task.title}</strong>
            <p>${task.description}</p>
            <em>Status: ${task.status}</em>
        `;
        taskList.appendChild(li);
    });

    // Mostrar a seção de tarefas
    document.querySelector('.task-section').style.display = 'block';
}

export function toggleForms(showLogin) {
    if (showLogin) {
        document.querySelector('.login-section').style.display = 'block';
        document.querySelector('.signup-section').style.display = 'none';
    } else {
        document.querySelector('.login-section').style.display = 'none';
        document.querySelector('.signup-section').style.display = 'block';
    }
}

export function alertMessage(message) {
    alert(message);
}
