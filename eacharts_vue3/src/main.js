import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '../src/assets/js/index'
import '../src/assets/css/index.css'

createApp(App).use(store).use(router).mount('#app')
