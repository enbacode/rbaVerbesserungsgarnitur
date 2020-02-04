import $ from 'jquery'
import Vue from 'vue'
import App from './App.vue'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

export default {
	name: 'rbaBattlePlayer',
	description: 'Player für Battlerunden im Browser anzeigen',
	longDescription: 'Zeigt einen Player auf Battleseiten, damit Runden direkt im Browser angehört werden können',
	target: 'rba',
	inject: function() {
		$(document).ready(() => {
			[...document.getElementsByTagName('a')]
				.filter(p => p.href.match(/download.php\?.*\.mp3/))
				.forEach(e => {

					const newRow = document.createElement('tr')
					let roundRow = e.parentElement.parentElement
					roundRow.parentElement.insertBefore(newRow, roundRow.nextElementSibling)

					let app = new Vue({
						el: newRow,
						data: {
							link: e.href 
						},
					
						render: h => h(App),
						components: { App: App },
						template: '<App />'
					})
				})

			
		})
	}
}

			