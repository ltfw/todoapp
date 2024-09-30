import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from 'vuex';
import Login from './components/Login.vue';  // Adjust path as necessary
import Register from './components/Register.vue';  // Adjust path as necessary
import Todos from './components/Todos.vue';  // Adjust path as necessary

const routes = [
    {
        path: '/',
        redirect: '/login',
    },  // Set Login as the initial route
    { path: '/login', component: Login, name: 'Login' },
    { path: '/register', component: Register, name: 'Register' },
    { path: '/todos', component: Todos, meta: { requiresAuth: true }, name: 'Todos' },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const store = useStore();
    const isAuthenticated = store.state.userId; // Assuming `userId` is set in Vuex when logged in

    if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
        // Redirect to login if trying to access a protected route
        next({ name: 'Login' });
    } else {
        // Proceed to the route if authenticated or route doesn't require auth
        next();
    }
});

export default router;
