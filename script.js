// URL base da API
const API_BASE_URL = 'https://projeto-taskease-back.onrender.com';

// Funções para gerenciamento de credenciais
function saveCredentials(username, password) {
  const credentials = btoa(`${username}:${password}`);
  localStorage.setItem('userCredentials', credentials);
  // Também vamos salvar o username para uso posterior
  localStorage.setItem('username', username);
  return credentials;
}

function getCredentials() {
  return localStorage.getItem('userCredentials');
}

function getUsername() {
  return localStorage.getItem('username');
}

function clearCredentials() {
  localStorage.removeItem('userCredentials');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
}

function saveUserId(userId) {
  localStorage.setItem('userId', userId);
}

function getUserId() {
  return localStorage.getItem('userId');
}

// Função para fazer requisições à API
async function fetchAPI(endpoint, method, body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Adiciona o cabeçalho de autenticação se o usuário estiver logado
  const credentials = getCredentials();
  if (credentials) {
    headers['Authorization'] = `Basic ${credentials}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  console.log(`Fazendo requisição: ${method} ${API_BASE_URL}${endpoint}`);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    console.log(`Status da resposta: ${response.status}`);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }

    // Verifica se a resposta tem conteúdo JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return { success: true };
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
}

// Funções para autenticação
async function login(username, password) {
  try {
    // Salva as credenciais
    saveCredentials(username, password);

    try {
      // Tenta acessar a lista de tarefas para verificar se a autenticação está correta
      const tasks = await fetchAPI('/tasks/', 'GET');
      
      // Quando carregar as tarefas, procure uma tarefa do usuário atual para obter o ID
      if (tasks && tasks.length > 0) {
        // Assumimos que as tarefas retornadas são do usuário logado
        // Salvamos o ID do usuário da primeira tarefa
        saveUserId(tasks[0].idUser);
      } else {
        // Se não tem tarefas, vamos buscar ou criar um ID
        await fetchUserId(username);
      }
      
      window.location.href = 'tasks.html';
    } catch (error) {
      // Se falhar com a API, informamos o erro
      clearCredentials();
      alert(`Falha na autenticação: ${error.message}`);
    }
  } catch (error) {
    clearCredentials();
    alert(`Erro ao fazer login: ${error.message}`);
  }
}

// Função para buscar o ID do usuário atual
async function fetchUserId(username) {
  try {
    // Tentativa 1: Buscar todos os usuários e filtrar pelo username
    const users = await fetchAPI('/users/', 'GET');
    
    if (users && Array.isArray(users)) {
      const currentUser = users.find(user => user.username === username);
      if (currentUser && currentUser.id) {
        saveUserId(currentUser.id);
        return currentUser.id;
      }
    }
    
    // Se não conseguiu encontrar o ID, alertamos o usuário
    console.warn('Não foi possível determinar o ID do usuário automaticamente.');
  } catch (error) {
    console.error('Erro ao buscar ID do usuário:', error);
  }
}

async function signup(name, username, password) {
  try {
    // Salvar usuário via API
    const userData = { name, username, password };
    const response = await fetchAPI('/users/', 'POST', userData);
    
    // Se tiver ID no retorno, já salvamos
    if (response && response.id) {
      saveUserId(response.id);
    }
    
    alert('Conta criada com sucesso!');
    window.location.href = 'index.html'; // Redireciona para o login
  } catch (error) {
    alert('Erro ao criar conta: ' + error.message);
  }
}

// Funções para gerenciamento de tarefas
async function addTask(taskData) {
  try {
    console.log('Enviando dados da tarefa:', taskData);
    // Salvar tarefa via API
    const response = await fetchAPI('/tasks/', 'POST', taskData);
    
    // Se a tarefa foi criada com sucesso e temos o ID do usuário no retorno
    if (response && response.idUser) {
      // Atualizamos o ID do usuário se ainda não temos
      if (!getUserId()) {
        saveUserId(response.idUser);
      }
    }
    
    alert('Tarefa criada com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro detalhado:', error);
    alert('Erro ao criar tarefa: ' + error.message);
    return false;
  }
}

async function loadTasks() {
  try {
    const taskList = document.getElementById('task-list');
    if (!taskList) {
      console.error('Elemento task-list não encontrado!');
      return;
    }

    // Carregar tarefas da API
    const tasks = await fetchAPI('/tasks/', 'GET');
    
    // Se temos tarefas, podemos capturar o ID do usuário da primeira tarefa
    if (tasks && tasks.length > 0 && !getUserId()) {
      saveUserId(tasks[0].idUser);
    }

    taskList.innerHTML = ''; // Limpa a lista atual

    if (tasks.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'Nenhuma tarefa encontrada.';
      taskList.appendChild(emptyMessage);
      return;
    }

    tasks.forEach(task => {
      const li = document.createElement('li');

      // Formatar a data de término
      const endDate = new Date(task.endAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      // Formatar hora
      const endTime = new Date(task.endAt).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Determinar classe de status para estilização
      const statusClass = getStatusClass(task.status);

      li.innerHTML = `
        <div class="task-title">${task.title}</div>
        <div class="task-description">${task.description || "Sem descrição"}</div>
        <div class="task-meta">
          <span class="task-status ${statusClass}">${task.status}</span>
          <span class="task-deadline">Prazo final: ${endDate} às ${endTime}</span>
        </div>
        <button class="delete-task" data-id="${task.id}">Excluir</button>
      `;

      taskList.appendChild(li);
    });

    // Adicionar eventos de exclusão
    document.querySelectorAll('.delete-task').forEach(button => {
      button.addEventListener('click', async (e) => {
        const taskId = e.target.dataset.id;
        await deleteTask(taskId);
        loadTasks();
      });
    });
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
    alert('Erro ao carregar tarefas: ' + error.message);
  }
}

async function deleteTask(taskId) {
  try {
    // Excluir tarefa via API
    await fetchAPI(`/tasks/${taskId}`, 'DELETE');
    return true;
  } catch (error) {
    alert('Erro ao excluir tarefa: ' + error.message);
    return false;
  }
}

// Funções de utilidade
function getStatusClass(status) {
  switch (status) {
    case 'pendente':
      return 'status-pending';
    case 'em-andamento':
      return 'status-progress';
    case 'concluido':
      return 'status-complete';
    case 'cancelado':
      return 'status-canceled';
    default:
      return '';
  }
}

// Inicialização das páginas
function initTasksPage() {
  // Verificando se o usuário está autenticado
  if (!getCredentials()) {
    alert('Você precisa fazer login para acessar esta página.');
    window.location.href = 'index.html';
    return;
  }

  const listTasksBtn = document.getElementById('list-tasks');
  const createTaskBtn = document.getElementById('create-task');
  const listTasksSection = document.getElementById('list-tasks-section');
  const createTaskSection = document.getElementById('create-task-section');
  const welcomeMessage = document.getElementById('welcome-message');

  // Verificando se estamos na página de tarefas
  if (!listTasksBtn || !createTaskBtn) return;

  // Inicializar a data atual nos campos de data
  const now = new Date();
  const localDateTimeString = now.toISOString().slice(0, 16);

  const startDateField = document.getElementById('task-start-date');
  if (startDateField) startDateField.value = localDateTimeString;

  // Adicionar 7 dias para a data de término padrão
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  const endDateField = document.getElementById('task-end-date');
  if (endDateField) endDateField.value = endDate.toISOString().slice(0, 16);

  // Evento para mostrar a lista de tarefas
  listTasksBtn.addEventListener('click', function (e) {
    e.preventDefault();
    welcomeMessage.classList.add('hidden');
    createTaskSection.classList.add('hidden');
    listTasksSection.classList.remove('hidden');
    loadTasks();
  });

  // Evento para mostrar o formulário de criação de tarefa
  createTaskBtn.addEventListener('click', function (e) {
    e.preventDefault();
    welcomeMessage.classList.add('hidden');
    listTasksSection.classList.add('hidden');
    createTaskSection.classList.remove('hidden');
  });

  // Formulário de criação de tarefas
  const createTaskForm = document.getElementById('create-task-form');
  if (createTaskForm) {
    createTaskForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      let userId = getUserId();
      
      // Se não temos o ID, tentamos buscar
      if (!userId) {
        // Tente buscar o ID do usuário atual
        await fetchUserId(getUsername());
        userId = getUserId();
        
        // Se ainda não temos um ID, usamos o ID que você tinha anteriormente como fallback
        if (!userId) {
          console.warn('Usando ID de usuário fallback para criação de tarefa.');
          userId = "2df0817f-8d58-480c-a075-16f38c827cd3";
        }
      }

      const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        status: document.getElementById('task-status')?.value || 'pendente',
        idUser: userId,
        startAt: document.getElementById('task-start-date').value,
        endAt: document.getElementById('task-end-date').value
      };

      if (taskData.title) {
        const success = await addTask(taskData);

        if (success) {
          // Limpa o formulário
          createTaskForm.reset();

          // Resetar datas
          if (startDateField) startDateField.value = localDateTimeString;
          if (endDateField) endDateField.value = endDate.toISOString().slice(0, 16);

          // Mostrar lista de tarefas
          welcomeMessage.classList.add('hidden');
          createTaskSection.classList.add('hidden');
          listTasksSection.classList.remove('hidden');
          loadTasks();
        }
      } else {
        alert('Por favor, insira um título para a tarefa.');
      }
    });
  }

  // Carregar tarefas inicialmente
  loadTasks();
}

// Eventos para a página de login
function initLoginPage() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      if (username && password) {
        login(username, password);
      } else {
        alert('Por favor, preencha todos os campos.');
      }
    });
  }
}

// Eventos para a página de cadastro
function initSignupPage() {
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const name = document.getElementById('signup-name').value;
      const username = document.getElementById('signup-username').value;
      const password = document.getElementById('signup-password').value;

      if (name && username && password) {
        signup(name, username, password);
      } else {
        alert('Por favor, preencha todos os campos.');
      }
    });
  }
}

// Função de inicialização principal
function init() {
  // Determinar qual página está carregada e inicializar adequadamente
  const currentPath = window.location.pathname;

  if (currentPath.includes('tasks.html')) {
    initTasksPage();
  } else if (currentPath.includes('signup.html')) {
    initSignupPage();
  } else {
    // Assumimos que é a página de login (index.html)
    initLoginPage();
  }
}

// Inicializa o script quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);