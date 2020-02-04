
import $ from 'jquery'

export default {
	name: 'noSoftScrollTop',
	description: 'Scrollanimation von \'zum Seitenanfang\' daktivieren',
	longDescription: 'Deaktiviert die Animation beim drücken des "Zum Seitenanfang"-Buttons in der unteren, rechten Ecke',
	target: 'board',
	category: 'cosmetic',
	inject: function() {
		$(document).ready(() => {
			$('.toTop').replaceWith($('.toTop').clone())
		})
	}
}