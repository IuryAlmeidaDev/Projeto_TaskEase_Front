<!-- src/views/SignupView.vue -->

<template>
  <div class="signup-container">
    <div class="signup-form">
      <h1><span class="highlight">T</span>ask<span class="highlight">E</span>ase</h1>
      <h4 class="slogan">O poder da organização nas suas mãos</h4>

      <!-- Formulário de Cadastro -->
      <div class="signup-section">
        <h2>Criar Conta</h2>
        <form @submit.prevent="handleSignup">
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
          
          <input 
            type="text" 
            v-model="name" 
            placeholder="Seu Nome" 
            required
          >
          
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
            {{ isLoading ? 'Criando...' : 'Criar Conta' }}
          </button>
        </form>
        
        <p class="login-prompt">
          Já tem uma conta? 
          <router-link to="/" class="login-link">Fazer login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signup } from '../services/api'

export default {
  name: 'SignupView',
  setup() {
    const router = useRouter()
    const name = ref('')
    const username = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const successMessage = ref('')
    const isLoading = ref(false)

    const handleSignup = async () => {
      try {
        isLoading.value = true
        errorMessage.value = ''
        successMessage.value = ''
        
        await signup(name.value, username.value, password.value)
        
        successMessage.value = 'Conta criada com sucesso!'
        
        // Limpar o formulário
        name.value = ''
        username.value = ''
        password.value = ''
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } catch (error) {
        errorMessage.value = error.message || 'Erro ao criar conta.'
      } finally {
        isLoading.value = false
      }
    }

    return {
      name,
      username,
      password,
      errorMessage,
      successMessage,
      isLoading,
      handleSignup
    }
  }
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f7;
}

.signup-form {
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

.signup-section h2 {
  margin-bottom: 20px;
  font-weight: 500;
}

.login-prompt {
  margin-top: 25px;
  font-size: 14px;
  color: #666;
}

.login-link {
  color: #4a86e8;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}

button {
  width: 100%;
  margin-top: 10px;
}

input {
  margin-bottom: 15px;
}

.success-message {
  background-color: rgba(46, 125, 50, 0.1);
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}
</style>