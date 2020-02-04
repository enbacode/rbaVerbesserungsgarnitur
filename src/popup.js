import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import PopupPage from './components/popupPage.vue'

import './popup.html'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
const app = new Vue({
    el: '#popupApp',
    components: { PopupPage },
    render: h => h(PopupPage),
    template: '<popupPage />'

})