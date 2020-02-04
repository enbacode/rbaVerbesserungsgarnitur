import Page from './page'
import Thing from './thing'

export default class ThreadList extends Page {

    constructor(obj) {
        super()
        this.load(obj)
    }

    parse() {
        const _subBoards = this.htmlElement.querySelectorAll('.wbbBoardList > li')
        const _threads = this.htmlElement.querySelectorAll('.wbbThreadList > ol > li:not(.tabularListRowHead)')
        let link = this.htmlElement.querySelector('.paginationTop li.skip a[rel="prev"]')
		if(link)
			this.previousPage = link.href
		link = this.htmlElement.querySelector('.pagination li.skip a[rel="next"]')
		if(link)
			this.nextPage = link.href

        this.subBoards = [..._subBoards].map(e => new Thing(e, () => window.location.href = e.querySelector('h3 a').href))
        this.threads = [..._threads].map(e => new Thing(e, () => window.location.href = e.querySelector('h3 a').href))

    }

    get things() {
        return [...this.subBoards, ...this.threads]
    }

    static match() {
        return /index.php\?board/
    }
}