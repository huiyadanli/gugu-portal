import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'normalize.css'
import './assets/main.css'
import '@arco-design/web-vue/es/message/style/css.js'
import '@arco-design/web-vue/es/button/style/css.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
