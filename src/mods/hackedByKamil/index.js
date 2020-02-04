import $ from 'jquery'
import anime from 'animejs'

export default {
	name: 'hackedByKamil',
	description: 'Hacked by Kamil',
	longDescription: 'cyka blyat',
	category: 'feature',
	showInOptions: false,
	target: 'board',
	inject: () => {
		$(document).ready(() => {
			$('.copyright a').text('HaCKeD by Kamil').attr('href', '#').click(e => {
				e.preventDefault()
				$('body').append('<div id="overlay"><div id="overlayContainer">HaCKeD by Kamil</div></div>')
				$('#overlay').css('position', 'absolute').css('width', '100vw').css('height', '100vh').css('position', 'fixed').css('top', 0).css('left', 0).css('z-index', 100).css('opacity', 0)
				$('#overlayContainer').css('display', 'flex').css('align-items', 'center').css('justify-content', 'center').css('font-size', '70px').css('font-weight', '900').css('color', 'red').css('height', '100%')
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
				$('.tabularBox').css('overflow', 'visible')
				$('a, i, img, .tabularListRow, h1, h2, h3, p, aside .box, .containerList li, dl, .pageNavigation, .boxMenuLink').each((i, e) => {
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
		})

	}
}


