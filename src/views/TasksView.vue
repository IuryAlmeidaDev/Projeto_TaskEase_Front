<!-- src/views/TasksView.vue -->

<template>
  <div class="tasks-container">
    <SideBar 
      :activeMenu="currentView" 
      @menuClicked="changeView"
    />
    
    <div class="tasks-content">
      <div v-if="currentView === 'welcome'" class="welcome-section">
        <h1>Bem-vindo ao TaskEase!</h1>
        <p>Selecione uma opção no menu ao lado para começar.</p>
      </div>
      
      <TaskList 
        v-show="currentView === 'list'" 
        @showCreateTask="changeView('create')"
        @tasksUpdated="handleTasksUpdated"
      />
      
      <TaskForm 
        v-show="currentView === 'create'" 
        @cancel="changeView('list')"
        @taskAdded="handleTaskAdded"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCredentials } from '../services/api'
import SideBar from '../components/SideBar.vue'
import TaskList from '../components/TaskList.vue'
import TaskForm from '../components/TaskForm.vue'

export default {
  name: 'TasksView',
  components: {
    SideBar,
    TaskList,
    TaskForm
  },
  
  setup() {
    const router = useRouter()
    const currentView = ref('welcome')
    
    // Verificar autenticação
    if (!getCredentials()) {
      router.push('/')
      return
    }
    
    // Mudar entre as visualizações
    const changeView = (view) => {
      currentView.value = view
    }
    
    // Lidar com a adição de uma nova tarefa
    const handleTaskAdded = () => {
      // Mudar para a lista de tarefas após adicionar
      setTimeout(() => {
        changeView('list')
      }, 1500)
    }
    
    // Atualizações na lista de tarefas
    const handleTasksUpdated = () => {
      console.log('Tarefas atualizadas')
    }
    
    return {
      currentView,
      changeView,
      handleTaskAdded,
      handleTasksUpdated
    }
  }
}
</script>

<style scoped>
.tasks-container {
  display: flex;
  min-height: 100vh;
}

.tasks-content {
  flex-grow: 1;
  padding: 30px;
  background-color: #f5f5f7;
  overflow-y: auto;
}

.welcome-section {
  text-align: center;
  padding: 80px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 50px auto 0;
}

.welcome-section h1 {
  margin-bottom: 15px;
  color: #333;
}

.welcome-section p {
  color: #666;
  font-size: 18px;
}
</style>