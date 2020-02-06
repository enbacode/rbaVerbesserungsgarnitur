import browser from 'webextension-polyfill'

(async () => {
    browser.storage.local.get('mods')
    .then(mods => mods.mods)
    .then(mods => {
        let styles = []
        mods.forEach(mod => {
            if(mod.enabled && mod.active && ((mod.match && window.location.href.match(mod.match) || !mod.match)))
                styles.push(mod.styleString)
        } )
        var style = document.createElement('style')
        style.innerHTML = styles.join('\n').replace(/([a-z\-]+: .*);/gm, "$1 !important;")
        document.documentElement.insertBefore(style, document.documentElement.firstChild);
    })
})()