import style from './style.scss'
import $ from 'jquery'
import vg from './../../core/rbaVG'

export default {
    name: 'keyboardNavigation',
    description: 'Tastaturnavigation in Threads',
    target: 'board',
    style: style,
    category: 'feature',
    longDescription: `
        Aktiviert folgende Tastaturkürzel zum navigieren in Threads:<br />
        <div class="row ml-1 mb-2">
            <div class="col-sm-6 col-md-4 col-lg-3 my-1"><kbd>⏎</kbd> Eintrag öffnen</div>
            <div class="col-sm-6 col-md-4 col-lg-3 my-1"><kbd>j</kbd> nächster Eintrag</div>
            <div class="col-sm-6 col-md-4 col-lg-3 my-1"><kbd>k</kbd> vorheriger Eintrag</div>
            <div class="col-sm-6 col-md-4 col-lg-3 my-1"><kbd>l</kbd> nächste Seite</div>
            <div class="col-sm-6 col-md-4 col-lg-3 my-1"><kbd>h</kbd> vorherige Seite</div>
            <div class="col-sm-6 col-md-4 col-lg-3 my-1"><kbd>c</kbd> Post zitieren</div>
            <div class="col-sm-6 col-md-4 col-lg-3 my-1"><kbd>b</kbd> Post bedanken</div>
            <div class="col-sm-6 col-md-4 col-lg-3 my-1"><kbd>n</kbd> Neuer Post</div>
        </div>
        <div class="alert alert-warning mb-1" role="alert">Das Bedanken funktioniert derzeit nur, wenn die Mod "Klassische Bedankungen" aktiviert ist.</div>`,
    inject: () => {

        $(document).ready(() => {
            let page = vg.currentPage
            let selectedThingIndex = -1

            document.addEventListener('keydown', e => {
                if (document.activeElement.classList.contains('redactor-layer')) {
                    document.activeElement.removeAttribute('data-focus-visible-added')
                    if (e.shiftKey && e.code == 'Backspace') {
                        page.things[selectedThingIndex].select()
                    }
                    else {
                        return
                    }
                }
                if (e.code == 'KeyJ') {
                    if (selectedThingIndex < page.things.length - 1) {
                        if (selectedThingIndex >= 0)
                            page.things[selectedThingIndex].deselect()
                        selectedThingIndex++
                    }

                    page.things[selectedThingIndex].select()

                }

                if (e.code == 'KeyK') {
                    if (selectedThingIndex > 0) {
                        page.things[selectedThingIndex].deselect()
                        selectedThingIndex--
                    }

                    page.things[selectedThingIndex].select()

                }

                if (e.code == 'KeyH') {
                    if (page.previousPage)
                        window.location.href = page.previousPage
                }

                if (e.code == 'KeyL') {
                    if (page.nextPage)
                        window.location.href = page.nextPage
                }

                if (e.code == 'KeyC') {
                    page.things[selectedThingIndex].htmlElement.querySelector('.jsQuoteMessage').dispatchEvent(new Event('click'))
                }

                if (e.code == 'KeyB') {
                    page.things[selectedThingIndex].htmlElement.querySelector('.reactButton.button').dispatchEvent(new Event('click'))
                }

                if (e.code == 'KeyN') {
                    e.preventDefault()
                    page.htmlElement.querySelector('.messageQuickReplyContent').dispatchEvent(new Event('click'))
                    page.htmlElement.querySelector('.messageQuickReplyContent').scrollIntoView()
                }

                if (e.code == 'KeyS') {
                    window.location.href = 'https://rbaforum.de'
                }

                if (e.code == 'Enter') {
                    page.things[selectedThingIndex].performAction()
                }
            })
        })
    }
}