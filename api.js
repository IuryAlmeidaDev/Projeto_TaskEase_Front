// api.js
export function getTasks(username, password) {
    const credentials = btoa(username + ':' + password);

    const apiUrl = 'http://localhost:8080/tasks/'; // Rota para todas as tarefas

    return fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + credentials, // Cabeçalho de autenticação básica
        }
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`Erro ao acessar as tarefas. Código de status: ${response.status}`);
        }
        return response.json();
    });
}

export function createUser(name, username, password) {
    const userData = { name, username, password };
    const apiUrl = 'http://localhost:8080/users/'; // Rota para criar um novo usuário

    return fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`Erro ao criar usuário. Código de status: ${response.status}`);
        }
        return response.json();
    });
}
