import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Carbon
import 'carbon-components/css/carbon-components.css'
// import 'carbon-components/scss/components/button/_button.scss'
// import 'carbon-components/scss/components/text-input/_text-input.scss'
import CarbonComponentsVue from '@carbon/vue'

import '@/assets/main.scss'
import '@/assets/reset-carbon.css'
import App from '@/App.vue'
import router from '@/router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(CarbonComponentsVue)

app.mount('#app')
