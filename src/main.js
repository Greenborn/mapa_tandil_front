import { createApp } from 'vue'
import App from './App.vue'
//import './registerServiceWorker'
//import router from './router'
//import store from './store'
import PrimeVue from 'primevue/config'; // This imports the PrimeVue library.


createApp(App)
//.use(store)
//.use(router)
.use(PrimeVue, { ripple: true })
.mount('#app')