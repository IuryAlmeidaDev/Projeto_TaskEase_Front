// src/main.js

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importar estilos globais (opcional - já temos estilos no App.vue)
// import './assets/global.css'

// Criar a aplicação Vue
const app = createApp(App)

// Registrar o router
app.use(router)

// Montar a aplicação
app.mount('#app')