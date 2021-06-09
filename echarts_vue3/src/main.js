import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '../src/assets/css/index.css'
import '../src/assets/theme/essos'

import SocketService from '../src/utils/socket_service'

const app = createApp(App)
SocketService.Instance.connect()
app.provide('SocketServiceInstance', SocketService.Instance)
app.use(store).use(router).mount('#app')
