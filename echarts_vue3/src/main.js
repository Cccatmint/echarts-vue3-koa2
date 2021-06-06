import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '../src/assets/css/index.css'
import '../src/assets/theme/essos'

createApp(App).use(store).use(router).mount('#app')
