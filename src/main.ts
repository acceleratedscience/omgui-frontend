import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Carbon
import 'carbon-components/css/carbon-components.css'
import '@/assets/carbon-override-fonts.css'
import '@/assets/carbon-override.scss'
import '@/assets/carbon-fix.css'
import CarbonComponentsVue from '@carbon/vue'

// Styles
import '@/assets/main.scss'

// Directives
import copyOnClick from '@/directives/copy-on-click'

// App
import App from '@/App.vue'
import router from '@/router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(CarbonComponentsVue)
app.directive('copy-on-click', copyOnClick)

app.mount('#app')
