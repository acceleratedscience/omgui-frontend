import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Carbon
import 'carbon-components/css/carbon-components.css'
// import '@/assets/carbon-override-fonts.css' // Look inside this file for notes.
import '@/assets/carbon-overrides.scss'
import '@/assets/carbon-fixes.scss'
import CarbonComponentsVue from '@carbon/vue'

// Styles
import '@/assets/main.scss'

// Directives
import clickToCopy from '@/directives/click-to-copy'

// App
import App from '@/App.vue'
import router from '@/router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(CarbonComponentsVue)
app.directive('click-to-copy', clickToCopy)

app.mount('#app')
