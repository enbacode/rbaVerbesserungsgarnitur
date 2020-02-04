import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import OptionsPage from './components/OptionsPage.vue'

import './options.html'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Array.prototype.groupBy = function(prop) {
	return this.reduce(function(groups, item) {
		const val = item[prop]
		groups[val] = groups[val] || []
		groups[val].push(item)
		return groups
	}, {})
}

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
new Vue({
	el: '#optionsApp',
	components: { OptionsPage },
	render: h => h(OptionsPage),
	template: '<OptionsPage />'

})
