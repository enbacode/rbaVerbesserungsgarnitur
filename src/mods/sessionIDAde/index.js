export default {
    name: 'sessionIDAde',
    description: 'Session ID adé',
    longDescription: 'Entfernt die Session ID aus der Addresszeile des Browsers',
    category: 'feature',
    target: 'rba',
    options: {
        pollClipboard: {
            title: 'Zwischenablage überwachen',
            description: '<div class="alert alert-warning mb-1" role="alert">Diese Einstellung verursacht unter Firefox Performanceprobleme</div>Überwacht die Zwischenablage auf Links mit Session ID und entfernt diese. Funktioniert nur, solange ihr auf der r-b-a.de-Website seid.',
            value: false
        },
        pollInterval: {
            title: 'Überwachungsintervall',
            description: 'Das Intervall (in ms), in welchem die Zwischenablage überwacht wird.',
            value: 200
        }
    },
    inject() {
        
        //save location with SID
        const locationWithSID = window.location.href
        //now replace the current history entry (and with that, the omnibar URL) with one without SID 
        window.history.replaceState(window.history.state, document.title, window.location.href.replace(/&?sid=[0-9a-fA-F]+/, ''))
        //before the user navigates away, make sure to restore the old state. Otherwise, browser-side back/fwd would
        //not work as intended and log the user out
        window.onbeforeunload = e => {
            window.history.replaceState(window.history.state, document.title, locationWithSID)
        }

        if(this.options.pollClipboard.value) {
            this.pollClipboard(this.options.pollInterval.value, this.pollClipboard)
        }
    },
    async pollClipboard(interval, cb) {
        try {
            const clipboardText = await navigator.clipboard.readText()
            if(clipboardText.match(/&?sid=[0-9a-fA-F]+/)) {
                await navigator.clipboard.writeText(clipboardText.replace(/&?sid=[0-9a-fA-F]+/, ''))
                console.info('session id in clipboard replaced')
            }
            
        }
        catch(e) {

        }
        finally {
            //TODO make this prettier
            //it's 5am and js' scoping of 'this' really grinds my gears.
            //I tinkered around until it worked, but there must be a better
            //way to do this.
            setTimeout(function(callback) {
                callback(interval, cb)
            }(cb), interval)
        }
        

    }
}