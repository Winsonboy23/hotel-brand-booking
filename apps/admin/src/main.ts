import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

const Dashboard = {
  template: `
    <main class="admin-page">
      <h1>Hotel Admin Dashboard</h1>
      <p>管理功能將在此逐步擴充（訂單審核、活動管理、會員查詢）。</p>
    </main>
  `
}

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: Dashboard }]
})

createApp(App).use(router).mount('#app')
