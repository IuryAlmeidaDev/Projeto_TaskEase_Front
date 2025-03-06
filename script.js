// Função para obter todas as tarefas com autenticação básica
function getTasks(username, password) {
    // Codificando as credenciais em Base64 (username:password)
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
        // Chama a função para obter as tarefas com as credenciais inseridas
        getTasks(username, password);

        // Esconde o formulário de login e mostra as tarefas
        document.querySelector('.login-section').style.display = 'none';
    } else {
        alert('Por favor, insira o nome de usuário e a senha.');
    }
}

// Adiciona o ouvinte de evento para o envio do formulário de login
document.getElementById('login-form').addEventListener('submit', handleLogin);
