/**
 * represents an element on the page that is, in any form, navigatable
 */
export default class Thing {

    /**
     * creates a new thing
     * @param {HTMLElement} elem the root element of the thing
     * @param {Function} elemAction the action that should be executed when the user hits 'enter' 
     */
    constructor(elem, elemAction) {
        this.htmlElement = elem
        this.action = elemAction
    }

    /**
     * performs the action set in the constructor
     */
    performAction() {
        this.action()
    }

    /**
     * focuses and highlights the thing
     */
    select() {
        this.htmlElement.focus()
        this.htmlElement.scrollIntoView()
        window.scrollBy(0,-50)
        this.htmlElement.classList.add('activeThing')
    }

    /**
     * defocuses and deselects the thing
     */
    deselect() {
        this.htmlElement.classList.remove('activeThing')
    }

}