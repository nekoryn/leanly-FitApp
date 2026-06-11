import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css';
import Toast from "vue-toastification"
import type { PluginOptions } from 'vue-toastification';
import 'vue-toastification/dist/index.css'

const app = createApp(App)
const pinia = createPinia()
const options: PluginOptions = {
    containerClassName: "!z-[10000]", 
};

app.use(router)
app.use(pinia)
app.use(Toast, options)


app.mount('#app')
