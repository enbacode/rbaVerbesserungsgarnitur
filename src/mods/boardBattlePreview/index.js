import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import boardBattlePreviewBox from './../../components/battlePreviewBox.vue'
import $ from 'jquery'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

export default {
    name: 'boardBattlePreview',
    description: 'Battlelinks als Vorschaubox darstellen',
    longDescription: 'Verwandelt Battle-Links von r-b-a.de in eine Vorschaubox ähnlich der von SoundCloud. Battles lassen sich so direkt im Browser anhören (nur Forum).',
    target: 'board',
    category: 'feature',
    match: /index\.php\?thread(.*)/,
    options: {
        defaultVolume: {
            title: 'Standardlautstärke',
            description: 'Die Standardlautstärke für den Rundenplayer',
            value: 70,
            range: [0, 100],
            step: 1
        },
        autoPlay: {
			title: 'Autoplay',
			description: 'Automatisch die nächste Runde abspielen',
			value: false
		}
    },
    inject: function () {
        //TODO un-jq this
        $(document).ready(() => {
            //get all links to battles on the current page
            $('a')
                .filter(function () {
                    return this.href.match(/https?:\/\/(www.)?r-b-a.de\/index.php\?(.*)BATTLE=[0-9]+/)
                })
                .each((i, e) => {
                    //create an entry point element for the Vue app
                    createBox(e)
                    //create vue app (per link)
                    let app = new Vue({
                        el: '.boardBattlePreview',
                        data: {
                            battleLink: $(e).attr('href'),
                            options: this.options,
                        },
                        render: h => h(boardBattlePreviewBox),
                        components: { Box: boardBattlePreviewBox },
                        template: '<Box/>'
                    })
                })

        })
    }
}


/**
 * creates the entry div for a vue app and appends it to e
 * @param {HTMLElement} e the element to append the app div to.
 */
function createBox(e) {
    $(e).parent().append($('<div class="boardBattlePreview"></div>'))
    $(e).remove()

}