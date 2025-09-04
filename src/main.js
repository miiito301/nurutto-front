import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from '../router/index.js';

createApp(App).use(router).mount('#app');
//use(router) でアプリ全体にルーターを組み込む