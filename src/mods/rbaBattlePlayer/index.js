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
	match: /&BATTLEID=|&BATTLE=|ID=8000/,
	options: {
        defaultVolume: {
            title: 'Standardlautstärke',
            description: 'Die Standardlautstärke für den Rundenplayer',
            value: 70,
            range: [0, 100],
		},
		autoPlay: {
			title: 'Autoplay',
			description: 'Automatisch die nächste Runde abspielen',
			value: false
		}
    },
	inject: function() {
		const playlistContainerId = Math.random().toString(36).substring(7)
		console.debug('rbaBattlePlayer: looking for mp3 links');
		[...document.getElementsByTagName('a')]
			.filter(p => p.href.match(/download.php\?.*\.mp3/))
			.forEach((e, i) => {
				console.debug('rbaBattlePlayer: found link ', e)
				const newRow = document.createElement('tr')
				let roundRow = e.parentElement.parentElement || console.log('rbaBattlePlayer: unable to get grandparent element')
				roundRow.parentElement.insertBefore(newRow, roundRow.nextElementSibling)
				let app = new Vue({
					el: newRow,
					data: {
						link: e.href,
						src: window.location.href.match(/ID=4101/) ? document.documentElement.innerHTML : null,
						options: this.options,
						index: i,
						playlistContainerId: playlistContainerId,
						dest: window.location.href.match(/ID=8000/) ? 'beatecke' : 'battle'
					},
				
					render: h => h(App),
					components: { App: App },
					template: '<App />'
				})
			})

		
	}
}

			