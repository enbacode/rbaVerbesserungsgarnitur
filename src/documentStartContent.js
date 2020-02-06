import browser from 'webextension-polyfill'

//a little note on this file:
//this entry point gets loaded as soon as the documentElement is created.
//this means we don't have a DOM here. We also cannot use rbaVG here because
//of this. This is why we need to use browser.storage to get our storage data
//
//what happens here is that the active mod's css is applied to the page (before
//the <html> element) to prevent FOUC. Becouse of the way the cascading works, we need to add
//an !important to every style poperty (see regex below).
//
//if you want to add functionality that is not FOUC-sensible, this is almost certainly not the
//right entry point. Use documentEndContent.js and do as little as possible in this file.

(async () => {
    browser.storage.local.get('active')
    .then(active => {
        if(!active.active)
            return
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
    })
})()