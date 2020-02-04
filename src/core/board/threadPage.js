import Post from './post'
import Page from './page'

export default class ThreadPage extends Page {

	constructor(obj) {
		super()
		this.load(obj)
	}

	parse() {
		this.title = this.htmlElement.querySelector('.contentHeaderTitle h1.contentTitle').innerHTML
		const metadata = this.htmlElement.querySelectorAll('.inlineList.contentHeaderMetaData > li')
		this.createdBy = metadata.item(0).getElementsByTagName('a')[0].innerHTML
		this.ceatedAt = metadata.item(1).getElementsByTagName('time')[0].getAttribute('datetime')
		let link = this.htmlElement.querySelector('.paginationTop li.skip a[rel="prev"]')
		if(link)
			this.previousPage = link.href
		link = this.htmlElement.querySelector('.paginationTop li.skip a[rel="next"]')
		if(link)
			this.nextPage = link.href

		this.posts = [...this.htmlElement.querySelectorAll('.wbbPost.message')].map(e => new Post(e))

	}

	get things() {
		return this.posts
	}

	static match() {
		return /index.php\?thread/
	}
}