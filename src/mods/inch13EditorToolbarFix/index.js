import style from './style.scss'

export default {
	name: 'inch13EditorToolbarFix',
	description: 'Verringertes Padding in der Editortoolbar',
	longDescription: 'Verringert das Padding in der Editortoolbar minimal, damit auf kleinen Displays alle Icons in einer Reihe erscheinen.',
	style: style,
	category: 'cosmetic',
	target: 'board',
	match: 'index\\.php\\?thread',
}