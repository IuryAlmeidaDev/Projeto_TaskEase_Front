<!-- src/App.vue -->

<template>
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Estilos globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f7;
  color: #333;
  line-height: 1.6;
}

.app-container {
  width: 100%;
  min-height: 100vh;
}

/* Botões */
button {
  cursor: pointer;
  background-color: #4a86e8;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3a76d8;
}

button:active {
  background-color: #2a66c8;
}

/* Formulários */
input, textarea, select {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #4a86e8;
}

/* Status de tarefas */
.status-pending {
  background-color: #ffcc80;
  color: #e65100;
}

.status-progress {
  background-color: #81d4fa;
  color: #01579b;
}

.status-complete {
  background-color: #a5d6a7;
  color: #1b5e20;
}

.status-canceled {
  background-color: #ef9a9a;
  color: #b71c1c;
}

/* Container comum para páginas */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.highlight {
  color: #4a86e8;
}

.hidden {
  display: none;
}

/* Mensagens de erro/sucesso */
.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin-bottom: 15px;
}

.success-message {
  color: #2e7d32;
  font-size: 14px;
  margin-bottom: 15px;
}
</style>