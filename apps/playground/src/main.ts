import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

import '@unocss/reset/tailwind.css'
import 'uno.css'

import App from './App.vue'

const router = createRouter({ routes, history: createWebHashHistory() })

createApp(App)
  .use(router)
  .mount('#app')
