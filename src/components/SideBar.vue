<!-- src/components/SideBar.vue -->

<template>
  <div class="sidebar">
    <div class="logo">
      <h2><span class="highlight">T</span>ask<span class="highlight">E</span>ase</h2>
    </div>
    
    <nav class="menu">
      <ul>
        <li>
          <a 
            href="#" 
            @click.prevent="$emit('menuClicked', 'list')" 
            :class="{ active: activeMenu === 'list' }"
          >
            Listar Tarefas
          </a>
        </li>
        <li>
          <a 
            href="#" 
            @click.prevent="$emit('menuClicked', 'create')" 
            :class="{ active: activeMenu === 'create' }"
          >
            Criar Tarefa
          </a>
        </li>
      </ul>
    </nav>
    
    <div class="user-section">
      <span class="username">{{ username }}</span>
      <button @click="handleLogout" class="logout-btn">Sair</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUsername, clearCredentials } from '../services/api'

export default {
  name: 'SideBar',
  props: {
    activeMenu: {
      type: String,
      default: 'list'
    }
  },
  emits: ['menuClicked'],
  
  setup() {
    const router = useRouter()
    const username = ref(getUsername() || 'Usuário')
    
    const handleLogout = () => {
      if (confirm('Deseja realmente sair?')) {
        clearCredentials()
        router.push('/')
      }
    }
    
    return {
      username,
      handleLogout
    }
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #2c3e50;
  color: white;
  width: 250px;
  height: 100vh;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 0 20px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
}

.logo h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.menu {
  flex-grow: 1;
}

.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  margin-bottom: 5px;
}

.menu a {
  display: block;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
}

.menu a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.menu a.active {
  background-color: #4a86e8;
  color: white;
}

.user-section {
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.username {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.logout-btn {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}
</style>