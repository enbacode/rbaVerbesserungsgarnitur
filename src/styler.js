import _ from 'lodash'

export default class Styler {

    constructor() {
        this.styles = []
    }

    add(style) {
        this.styles.push(style)
    }

    remove(style) {
        _.remove(this.styles, style)
    }

    appendStyle(node) {
        const styleNode = document.createElement('style')
        let stringBuilder = ''
        this.styles.forEach((style) => {
            stringBuilder += style[0][1]
        })
        styleNode.innerHTML = stringBuilder
        node.appendChild(styleNode)
    }
}