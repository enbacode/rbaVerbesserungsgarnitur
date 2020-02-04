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
    inject: function () {
        $(document).ready(() => {
            $('a')
                .filter(function () {
                    return this.href.match(/https?:\/\/(www.)?r-b-a.de\/index.php\?(.*)BATTLE=[0-9]+/)
                })
                .each((i, e) => {
                    createBox(e)
                    let app = new Vue({
                        el: '.boardBattlePreview',
                        data: {
                            battleLink: $(e).attr('href')
                        },
                        render: h => h(boardBattlePreviewBox),
                        components: { Box: boardBattlePreviewBox },
                        template: '<Box/>'
                    })
                })

        })
    }
}



function createBox(e) {
    $(e).parent().append($('<div class="boardBattlePreview"></div>'))
    $(e).remove()

}