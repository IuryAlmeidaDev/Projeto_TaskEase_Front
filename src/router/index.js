// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import { getCredentials } from '../services/api'

// Importação das páginas
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import TasksView from '../views/TasksView.vue'

// Definição das rotas
const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TasksView,
    meta: { requiresAuth: true }
  }
]

// Criação do router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guarda de navegação para autenticação
router.beforeEach((to, from, next) => {
  // Verifica se a rota requer autenticação
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Verifica se o usuário está autenticado
    if (!getCredentials()) {
      // Se não estiver autenticado, redireciona para o login
      next({ name: 'login' })
    } else {
      // Se estiver autenticado, permite o acesso
      next()
    }
  } else {
    // Se a rota não requer autenticação, permite o acesso
    next()
  }
})

export default router