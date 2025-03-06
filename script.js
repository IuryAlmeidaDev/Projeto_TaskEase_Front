// Função para obter todas as tarefas com autenticação básica
function getTasks(username, password) {
    const credentials = btoa(username + ':' + password);

    const apiUrl = 'http://localhost:8080/tasks/'; // Rota para todas as tarefas

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + credentials, // Cabeçalho de autenticação básica
        }
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Erro ao acessar as tarefas. Código de status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log('Tarefas recebidas:', data);
        displayTasks(data); // Exibindo as tarefas
    })
    .catch((error) => {
        console.error('Erro ao acessar as tarefas:', error);
        alert('Erro ao acessar as tarefas: ' + error);
    });
}

// Função para exibir as tarefas na interface
function displayTasks(tasks) {
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

// Função para lidar com o login
function handleLogin(event) {
    event.preventDefault(); // Evita o envio do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        getTasks(username, password); // Chama a função para obter as tarefas com as credenciais inseridas
        document.querySelector('.login-section').style.display = 'none'; // Esconde o formulário de login
        document.querySelector('.task-section').style.display = 'block'; // Mostra a seção de tarefas
    } else {
        alert('Por favor, insira o nome de usuário e a senha.');
    }
}

// Função para lidar com o cadastro de um novo usuário
function handleSignup(event) {
    event.preventDefault(); // Evita o envio do formulário

    const name = document.getElementById('signup-name').value;
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (name && username && password) {
        const userData = {
            name: name,
            username: username,
            password: password
        };

        const apiUrl = 'http://localhost:8080/users/'; // Rota para criar um novo usuário

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData) // Envia os dados do novo usuário
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro ao criar usuário. Código de status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            alert('Usuário criado com sucesso!');
            // Voltar para o formulário de login
            document.querySelector('.signup-section').style.display = 'none';
            document.querySelector('.login-section').style.display = 'block';
        })
        .catch((error) => {
            console.error('Erro ao criar o usuário:', error);
            alert('Erro ao criar o usuário: ' + error);
        });
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Adiciona o ouvinte de evento para o envio do formulário de login
document.getElementById('login-form').addEventListener('submit', handleLogin);

// Adiciona o ouvinte de evento para o envio do formulário de cadastro
document.getElementById('signup-form').addEventListener('submit', handleSignup);

// Exibe o formulário de cadastro e oculta o de login
document.getElementById('show-signup-form').addEventListener('click', function() {
    document.querySelector('.login-section').style.display = 'none';
    document.querySelector('.signup-section').style.display = 'block';
});

// Exibe o formulário de login e oculta o de cadastro
document.getElementById('show-login-form').addEventListener('click', function() {
    document.querySelector('.signup-section').style.display = 'none';
    document.querySelector('.login-section').style.display = 'block';
});
