<!-- src/views/LoginView.vue -->

<template>
  <div class="login-container">
    <div class="login-form">
      <h1><span class="highlight">T</span>ask<span class="highlight">E</span>ase</h1>
      <h4 class="slogan">O poder da organização nas suas mãos</h4>

      <!-- Formulário de Login -->
      <div class="login-section">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          
          <input 
            type="text" 
            v-model="username" 
            placeholder="Nome de usuário" 
            required
          >
          
          <input 
            type="password" 
            v-model="password" 
            placeholder="Senha" 
            required
          >
          
          <button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <!-- Link para a página de cadastro -->
        <p class="signup-prompt">
          Ainda não tem uma conta? 
          <router-link to="/signup" class="signup-link">Criar conta</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/api'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const isLoading = ref(false)

    const handleLogin = async () => {
      try {
        isLoading.value = true
        errorMessage.value = ''
        
        await login(username.value, password.value)
        
        // Redireciona para a página de tarefas
        router.push('/tasks')
      } catch (error) {
        errorMessage.value = error.message || 'Erro ao fazer login. Verifique suas credenciais.'
      } finally {
        isLoading.value = false
      }
    }

    return {
      username,
      password,
      errorMessage,
      isLoading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f7;
}

.login-form {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 36px;
  margin-bottom: 5px;
  font-weight: 700;
}

.slogan {
  margin-bottom: 30px;
  color: #666;
  font-weight: 400;
}

.login-section h2 {
  margin-bottom: 20px;
  font-weight: 500;
}

.signup-prompt {
  margin-top: 25px;
  font-size: 14px;
  color: #666;
}

.signup-link {
  color: #4a86e8;
  text-decoration: none;
  font-weight: 500;
}

.signup-link:hover {
  text-decoration: underline;
}

button {
  width: 100%;
  margin-top: 10px;
}

input {
  margin-bottom: 15px;
}
</style>