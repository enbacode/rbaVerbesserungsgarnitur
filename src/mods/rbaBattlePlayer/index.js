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
		console.debug('rbaBattlePlayer: looking for mp3 links');
		[...document.getElementsByTagName('a')]
			.filter(p => p.href.match(/download.php\?.*\.mp3/))
			.forEach(e => {
				console.debug('rbaBattlePlayer: found link ', e)
				const newRow = document.createElement('tr')
				let roundRow = e.parentElement.parentElement || console.log('rbaBattlePlayer: unable to get grandparent element')
				roundRow.parentElement.insertBefore(newRow, roundRow.nextElementSibling)

				let app = new Vue({
					el: newRow,
					data: {
						link: e.href,
						dest: window.location.href.match(/ID=8000/) ? 'beatecke' : 'battle'
					},
				
					render: h => h(App),
					components: { App: App },
					template: '<App />'
				})
			})

		
	}
}

			