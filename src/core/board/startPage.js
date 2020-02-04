import Page from './page'
import Thing from './thing'

export default class StartPage extends Page {

    constructor(obj) {
        super()
        this.load(obj)
    }

    parse() {

        this.newPosts = [...this.htmlElement
            .querySelectorAll('.box[data-box-identifier="com.woltlab.wbb.LatestPosts"] .tabularListRow:not(.tabularListRowHead)')]
            .map(e => new Thing(e, () => window.location.href = e.querySelector('h3 a').href))

        this.boards = [...this.htmlElement
            .querySelectorAll('.wbbBoardContainer')]
            .map(e => new Thing(e, () => window.location.href = e.querySelector('h3 a').href))

        this.hotTopics = [...this.htmlElement
            .querySelectorAll('.box[data-box-identifier="com.woltlab.wbb.HotThreads"] .tabularListRow:not(.tabularListRowHead)')]
            .map(e => new Thing(e, () => window.location.href = e.querySelector('h3 a').href))
    }

    get things() {
        return [
            ...this.newPosts,
            ...this.boards,
            ...this.hotTopics
        ]
    }

    static match() {
        return /rbaforum\.de\/$/
    }
}