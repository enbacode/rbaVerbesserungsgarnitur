export default class Thing {

    constructor(elem, elemAction) {
        this.htmlElement = elem
        this.action = elemAction
    }

    performAction() {
        this.action()
    }

    select() {
        this.htmlElement.focus()
        this.htmlElement.scrollIntoView()
        window.scrollBy(0,-50)
        this.htmlElement.classList.add('activeThing')
    }

    deselect() {
        this.htmlElement.classList.remove('activeThing')
    }

}