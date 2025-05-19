<!-- src/components/TaskForm.vue -->

<template>
  <div class="task-form-container">
    <h2>Criar Nova Tarefa</h2>
    
    <form @submit.prevent="handleSubmit" class="task-form">
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      
      <div class="form-group">
        <label for="task-title">Título da tarefa</label>
        <input 
          type="text" 
          id="task-title" 
          v-model="taskData.title" 
          placeholder="Título da tarefa" 
          required
        >
      </div>
      
      <div class="form-group">
        <label for="task-description">Descrição da tarefa</label>
        <textarea 
          id="task-description" 
          v-model="taskData.description" 
          placeholder="Descrição da tarefa"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="task-status">Status</label>
        <select id="task-status" v-model="taskData.status" required>
          <option value="pendente">Pendente</option>
          <option value="em-andamento">Em andamento</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="task-start-date">Data de início</label>
        <input 
          type="datetime-local" 
          id="task-start-date" 
          v-model="taskData.startAt" 
          required
        >
      </div>
      
      <div class="form-group">
        <label for="task-end-date">Data de término</label>
        <input 
          type="datetime-local" 
          id="task-end-date" 
          v-model="taskData.endAt" 
          required
        >
      </div>
      
      <div class="form-actions">
        <button type="submit" :disabled="isLoading" class="submit-btn">
          {{ isLoading ? 'Salvando...' : 'Adicionar Tarefa' }}
        </button>
        <button type="button" @click="$emit('cancel')" class="cancel-btn">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { addTask } from '../services/api'

export default {
  name: 'TaskForm',
  emits: ['cancel', 'taskAdded'],
  
  setup(props, { emit }) {
    const taskData = ref({
      title: '',
      description: '',
      status: 'pendente',
      startAt: '',
      endAt: ''
    })
    
    const errorMessage = ref('')
    const successMessage = ref('')
    const isLoading = ref(false)
    
    // Inicializar datas com valores padrão ao montar o componente
    onMounted(() => {
      // Data e hora atual para início
      const now = new Date()
      taskData.value.startAt = formatDateForInput(now)
      
      // Data e hora para uma semana depois para término
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      taskData.value.endAt = formatDateForInput(nextWeek)
    })
    
    // Formatar data para o formato aceito pelo input datetime-local
    const formatDateForInput = (date) => {
      return date.toISOString().slice(0, 16)
    }
    
    // Adicionar tarefa
    const handleSubmit = async () => {
      try {
        isLoading.value = true
        errorMessage.value = ''
        successMessage.value = ''
        
        await addTask(taskData.value)
        
        successMessage.value = 'Tarefa criada com sucesso!'
        
        // Emitir evento para o componente pai
        emit('taskAdded')
        
        // Limpar formulário após alguns segundos
        setTimeout(() => {
          // Resetar o formulário
          taskData.value = {
            title: '',
            description: '',
            status: 'pendente',
            startAt: formatDateForInput(new Date()),
            endAt: formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
          }
          
          successMessage.value = ''
          
          // Informar o componente pai que pode mostrar a lista
          emit('cancel')
        }, 1500)
      } catch (error) {
        errorMessage.value = error.message || 'Erro ao criar tarefa.'
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      taskData,
      errorMessage,
      successMessage,
      isLoading,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.task-form-container {
  background-color: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-form {
  max-width: 800px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-start;
  gap: 15px;
  margin-top: 20px;
}

.submit-btn {
  background-color: #4a86e8;
}

.cancel-btn {
  background-color: #9e9e9e;
}

.cancel-btn:hover {
  background-color: #757575;
}

.success-message {
  background-color: rgba(46, 125, 50, 0.1);
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
}
</style>