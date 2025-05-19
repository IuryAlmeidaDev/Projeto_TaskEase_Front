// src/services/api.js

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
      
      return true;
    } catch (error) {
      // Se falhar com a API, informamos o erro
      clearCredentials();
      throw new Error(`Falha na autenticação: ${error.message}`);
    }
  } catch (error) {
    clearCredentials();
    throw error;
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
    return null;
  } catch (error) {
    console.error('Erro ao buscar ID do usuário:', error);
    return null;
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
    
    return true;
  } catch (error) {
    throw new Error('Erro ao criar conta: ' + error.message);
  }
}

// Funções para gerenciamento de tarefas
async function fetchTasks() {
  try {
    // Carregar tarefas da API
    const tasks = await fetchAPI('/tasks/', 'GET');
    
    // Se temos tarefas, podemos capturar o ID do usuário da primeira tarefa
    if (tasks && tasks.length > 0 && !getUserId()) {
      saveUserId(tasks[0].idUser);
    }

    return tasks;
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
    throw error;
  }
}

async function addTask(taskData) {
  try {
    console.log('Enviando dados da tarefa:', taskData);
    
    let userId = getUserId();
    
    // Se não temos o ID, tentamos buscar
    if (!userId) {
      // Tente buscar o ID do usuário atual
      await fetchUserId(getUsername());
      userId = getUserId();
      
      // Se ainda não temos um ID, usamos um ID fallback (não recomendado em produção)
      if (!userId) {
        console.warn('Usando ID de usuário fallback para criação de tarefa.');
        userId = "2df0817f-8d58-480c-a075-16f38c827cd3";
      }
    }
    
    // Garantir que o ID do usuário esteja na tarefa
    const taskWithUserId = {
      ...taskData,
      idUser: userId
    };
    
    // Salvar tarefa via API
    const response = await fetchAPI('/tasks/', 'POST', taskWithUserId);
    
    // Se a tarefa foi criada com sucesso e temos o ID do usuário no retorno
    if (response && response.idUser) {
      // Atualizamos o ID do usuário se ainda não temos
      if (!getUserId()) {
        saveUserId(response.idUser);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Erro detalhado:', error);
    throw error;
  }
}

async function deleteTask(taskId) {
  try {
    // Excluir tarefa via API
    await fetchAPI(`/tasks/${taskId}`, 'DELETE');
    return true;
  } catch (error) {
    throw error;
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

// Exportar todas as funções para uso nos componentes Vue
export {
  login,
  signup,
  fetchTasks,
  addTask,
  deleteTask,
  getCredentials,
  clearCredentials,
  getUsername,
  getUserId,
  getStatusClass
};