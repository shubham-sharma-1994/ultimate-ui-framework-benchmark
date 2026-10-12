import { Notify, Dark } from 'quasar'
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { createApp } from 'vue'
import { Quasar } from 'quasar'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
// Import Quasar css
import 'quasar/src/css/index.sass'
// Import custom css
import './style.css'

const app = createApp(App)

app.use(Quasar, {
  plugins: {
    Notify,
    Dark
  }
})

app.use(createPinia())
app.use(router)

app.mount('#app')
