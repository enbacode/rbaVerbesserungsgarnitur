import anime from 'animejs'

export default {
    name: 'hackedByKamil',
    description: 'Hacked by Kamil',
    longDescription: 'cyka blyat',
    category: 'feature',
    showInOptions: false,
    target: 'board',
    inject: () => {

        //inject trigger
        const copyright = document.querySelector('.copyright a')
        copyright.innerHTML = 'HaCKeD by Kamil'
        copyright.href = '#'

        copyright.addEventListener('click', e => {
            e.preventDefault()
            //create a full page overlay
            const overlayContainer = document.createElement('div')
            overlayContainer.style.position = 'fixed'
            overlayContainer.style.width = '100vw'
            overlayContainer.style.height = '100vh'
            overlayContainer.style.top = 0
            overlayContainer.style.left = 0
            overlayContainer.style.zIndex = 100
            overlayContainer.style.opacity = 0

            //create big "hacked by kamil" text
            const overlay = document.createElement('div')
            overlay.style.display = 'flex'
            overlay.style.alignItems = 'center'
            overlay.style.justifyContent = 'center'
            overlay.style.fontSize = '70px'
            overlay.style.fontWeight = 900
            overlay.style.color = 'red'
            overlay.style.height = '100%'

            overlayContainer.appendChild(overlay)
            document.body.appendChild(overlayContainer)
            //make sure overflow is visible
            document.querySelectorAll('.tabularBox').forEach(e => e.style.overflow = 'visible')
            //make kamil text fade in and out
            anime({
                targets: document.getElementById('overlay'),
                opacity: 1,
                loop: 7,
                direction: 'alternate',
                easing: 'linear',
                delay: 12000,
                duration: 5000,
                complete: () => document.getElementById('overlay').remove()
            })
            //make some stuff rotate and fade
            document.querySelectorAll('a, i, img, .tabularListRow, h1, h2, h3, p, aside .box, .containerList li, dl, .pageNavigation, .boxMenuLink').forEach(e => {
                anime({
                    targets: e,
                    opacity: 0,
                    delay: anime.random(2000, 6000),
                    duration: anime.random(2000, 4000),
                    loop: 4,
                    direction: 'alternate',
                    easing: 'easeInOutQuad',
                })
                anime({
                    targets: e,
                    rotate: anime.random(-360, 360),
                    scale: anime.random(0.2, 0.5),
                    delay: anime.random(6000, 10000),
                    duration: anime.random(10000, 20000),
                    loop: 4,
                    direction: 'alternate',
                    easing: 'easeInOutQuad',
                })
            })
        })
    }
}


