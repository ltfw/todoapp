import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css'; // Ensure this line is present
import store from './store';

createApp(App).use(router).use(store).mount('#app');
