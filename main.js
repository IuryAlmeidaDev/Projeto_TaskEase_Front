// main.js
import { getTasks, createUser } from './api.js';
import { displayTasks, toggleForms, alertMessage } from './ui.js';

// Função para lidar com o login
function handleLogin(event) {
    event.preventDefault(); // Evita o envio do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        getTasks(username, password)
            .then((data) => {
                displayTasks(data);
                document.querySelector('.login-section').style.display = 'none'; // Esconde o formulário de login
                document.querySelector('.task-section').style.display = 'block'; // Mostra a seção de tarefas
            })
            .catch((error) => {
                console.error('Erro ao acessar as tarefas:', error);
                alertMessage('Erro ao acessar as tarefas: ' + error);
            });
    } else {
        alertMessage('Por favor, insira o nome de usuário e a senha.');
    }
}

// Função para lidar com o cadastro de um novo usuário
function handleSignup(event) {
    event.preventDefault(); // Evita o envio do formulário

    const name = document.getElementById('signup-name').value;
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (name && username && password) {
        createUser(name, username, password)
            .then(() => {
                alertMessage('Usuário criado com sucesso!');
                toggleForms(true); // Voltar para o formulário de login
            })
            .catch((error) => {
                console.error('Erro ao criar o usuário:', error);
                alertMessage('Erro ao criar o usuário: ' + error);
            });
    } else {
        alertMessage('Por favor, preencha todos os campos.');
    }
}

// Adiciona os ouvintes de evento para o envio dos formulários de login e cadastro
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('signup-form').addEventListener('submit', handleSignup);

// Exibe o formulário de cadastro e oculta o de login
document.getElementById('show-signup-form').addEventListener('click', function() {
    toggleForms(false); // Exibe o formulário de cadastro
});

// Exibe o formulário de login e oculta o de cadastro
document.getElementById('show-login-form').addEventListener('click', function() {
    toggleForms(true); // Exibe o formulário de login
});
