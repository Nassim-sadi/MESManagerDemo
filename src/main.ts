import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'

import 'primeicons/primeicons.css'
import './assets/styles/main.css'
import './assets/styles/primevue-overrides.css'

import App from './App.vue'
import router from './router'
import theme from './app/theme'

// Apply the persisted theme before mount so switching to dark never flashes.
if (localStorage.getItem('mes.theme') === 'dark') {
  document.documentElement.classList.add('mes-dark')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  ripple: false,
  theme: {
    preset: theme,
    options: {
      darkModeSelector: '.mes-dark',
    },
  },
})
app.use(ToastService)
app.use(ConfirmationService)
app.directive('tooltip', Tooltip)

app.mount('#app')
