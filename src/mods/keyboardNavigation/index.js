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
            <div class="col-sm-6 col-md-4 col-lg-3 my-1"><kbd>s</kbd> Startseite</div>
        </div>
        <div class="alert alert-warning mb-1" role="alert">Das Bedanken funktioniert derzeit nur, wenn die Mod "Klassische Bedankungen" aktiviert ist.</div>`,
    inject: () => {

        $(document).ready(() => {
            let page = vg.currentPage
            let selectedThingIndex = -1

            document.addEventListener('keydown', e => {
                //ignore keydowns if an editor element is selected
                if (document.activeElement.classList.contains('redactor-layer') ||
                    document.activeElement.tagName == 'textarea' ||
                    document.activeElement.tagName == 'input') {
                    document.activeElement.removeAttribute('data-focus-visible-added')
                    if (e.shiftKey && e.code == 'Backspace') {
                        page.things[selectedThingIndex].select()
                    }
                    else {
                        return
                    }
                }

                //select next thing
                if (e.code == 'KeyJ') {
                    if (selectedThingIndex < page.things.length - 1) {
                        if (selectedThingIndex >= 0)
                            page.things[selectedThingIndex].deselect()
                        selectedThingIndex++
                    }
                    page.things[selectedThingIndex].select()

                }

                //select previous thing
                if (e.code == 'KeyK') {
                    if (selectedThingIndex > 0) {
                        page.things[selectedThingIndex].deselect()
                        selectedThingIndex--
                    }

                    page.things[selectedThingIndex].select()

                }

                //page back
                if (e.code == 'KeyH') {
                    if (page.previousPage)
                        window.location.href = page.previousPage
                }

                //page forward
                if (e.code == 'KeyL') {
                    if (page.nextPage)
                        window.location.href = page.nextPage
                }

                //cite current thing
                if (e.code == 'KeyC') {
                    page.things[selectedThingIndex].htmlElement.querySelector('.jsQuoteMessage').dispatchEvent(new Event('click'))
                }

                //like current thing
                if (e.code == 'KeyB') {
                    page.things[selectedThingIndex].htmlElement.querySelector('.reactButton.button').dispatchEvent(new Event('click'))
                }

                //jump to new post box
                if (e.code == 'KeyN') {
                    e.preventDefault()
                    page.htmlElement.querySelector('.messageQuickReplyContent').dispatchEvent(new Event('click'))
                    page.htmlElement.querySelector('.messageQuickReplyContent').scrollIntoView()
                }

                //go to start page
                if (e.code == 'KeyS') {
                    window.location.href = 'https://rbaforum.de'
                }

                //perform action on selected thing
                if (e.code == 'Enter') {
                    page.things[selectedThingIndex].performAction()
                }
            })
        })
    }
}