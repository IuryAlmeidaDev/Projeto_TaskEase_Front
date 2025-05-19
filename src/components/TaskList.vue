<!-- src/components/TaskList.vue -->

<template>
  <div class="task-list-container">
    <h2>Minhas Tarefas</h2>
    
    <div v-if="isLoading" class="loading">
      Carregando tarefas...
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else-if="tasks.length === 0" class="empty-state">
      <p>Você ainda não tem tarefas.</p>
      <button @click="$emit('showCreateTask')">Criar primeira tarefa</button>
    </div>
    
    <ul v-else class="task-list">
      <li v-for="task in tasks" :key="task.id" class="task-item">
        <div class="task-header">
          <h3 class="task-title">{{ task.title }}</h3>
          <span 
            class="task-status" 
            :class="getStatusClass(task.status)"
          >
            {{ formatStatus(task.status) }}
          </span>
        </div>
        
        <p class="task-description">
          {{ task.description || "Sem descrição" }}
        </p>
        
        <div class="task-meta">
          <div class="task-dates">
            <div class="task-deadline">
              <strong>Início:</strong> {{ formatDate(task.startAt) }}
            </div>
            <div class="task-deadline">
              <strong>Prazo:</strong> {{ formatDate(task.endAt) }}
            </div>
          </div>
          
          <button 
            class="delete-button" 
            @click="confirmDeleteTask(task.id)"
          >
            Excluir
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { fetchTasks, deleteTask, getStatusClass } from '../services/api'

export default {
  name: 'TaskList',
  emits: ['showCreateTask', 'tasksUpdated'],
  
  setup(props, { emit }) {
    const tasks = ref([])
    const isLoading = ref(true)
    const error = ref('')
    
    // Carregar tarefas
    const loadTasks = async () => {
      try {
        isLoading.value = true
        error.value = ''
        tasks.value = await fetchTasks()
      } catch (err) {
        error.value = 'Erro ao carregar tarefas: ' + err.message
      } finally {
        isLoading.value = false
      }
    }
    
    // Excluir tarefa
    const confirmDeleteTask = async (taskId) => {
      if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        try {
          await deleteTask(taskId)
          // Recarregar a lista após exclusão
          await loadTasks()
          // Emitir evento para atualizar o componente pai
          emit('tasksUpdated')
        } catch (err) {
          error.value = 'Erro ao excluir tarefa: ' + err.message
        }
      }
    }
    
    // Formatar data
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    // Formatar status
    const formatStatus = (status) => {
      switch (status) {
        case 'pendente': return 'Pendente'
        case 'em-andamento': return 'Em andamento'
        case 'concluido': return 'Concluído'
        case 'cancelado': return 'Cancelado'
        default: return status
      }
    }
    
    // Carregar tarefas ao montar o componente
    onMounted(loadTasks)
    
    return {
      tasks,
      isLoading,
      error,
      loadTasks,
      confirmDeleteTask,
      formatDate,
      formatStatus,
      getStatusClass
    }
  }
}
</script>

<style scoped>
.task-list-container {
  padding: 20px 0;
}

.task-list {
  list-style: none;
  padding: 0;
}

.task-item {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.task-title {
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

.task-status {
  font-size: 14px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
}

.task-description {
  margin-bottom: 15px;
  color: #555;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.task-dates {
  color: #666;
}

.delete-button {
  background-color: #f44336;
  padding: 6px 12px;
  font-size: 14px;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.empty-state {
  text-align: center;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-state p {
  margin-bottom: 20px;
  color: #666;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>