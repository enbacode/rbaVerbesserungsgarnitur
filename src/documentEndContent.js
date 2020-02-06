import vg from './core/rbaVG'
import './manifest.json'

//make sure we can use async/await
(async () => {

    //initialize to page mode
    vg.initPage()
    //load stored mods
    const mods = await vg.storedMods()

    //filter mods for target
    if (window.location.hostname == 'rbaforum.de')
        vg.inject(mods.filter(p => p.target == 'board'))
    else if (window.location.hostname == 'r-b-a.de')
        vg.inject(mods.filter(p => p.target == 'rba'))

    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'a',
        66: 'b'
    }
    let konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a']
    let konamiCodePosition = 0
    document.addEventListener('keydown', async (e) => {
        let key = allowedKeys[e.keyCode]
        let requiredKey = konamiCode[konamiCodePosition]
        if (key == requiredKey) {
            konamiCodePosition++
            if (konamiCodePosition == konamiCode.length) {
                let mods = await vg.storedMods()
                mods.find(p => p.name == 'goatMode').enabled = true
                await vg.storeMods(mods)
                konamiCodePosition = 0
                document.location.reload()
            }
        } else {
            konamiCodePosition = 0
        }
    })

})()