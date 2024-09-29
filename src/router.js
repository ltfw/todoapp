import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';  // Adjust path as necessary
import Register from './components/Register.vue';  // Adjust path as necessary
import Todos from './components/Todos.vue';  // Adjust path as necessary

const routes = [
  { path: '', component: Login },  // Set Login as the initial route
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/todos', component: Todos },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
