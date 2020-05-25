import vg from '../rbaVG'
import _ from 'lodash'

export default class Round {

    /**
     * represent a RBA round
     * @param {URL} roundURL the round URL
     */
    constructor(roundURL) {
        this.url = roundURL
        this.index = 0
        this.name = '',
        this.id = /FILE=(\d+-\d)/.exec(this.url.replace('rbaforum', 'r-b-a'))[1],
        this.battleID = /FILE=(\d+)-/.exec(this.url.replace('rbaforum', 'r-b-a'))[1],
        this.battleURL = `https://r-b-a.de/index.php?ID=4101&BATTLE=${this.battleID}`
        this.date = new Date()
        this.mc = '',
        this.downloads = 0,
        this.votes = []
    }

    /**
     * fetches the battle document content and parses the round data
     */
    async fetch() {
        const resp = await vg.ajax.get(this.battleURL)
        return this.parse(resp.response.data)
    }

    /**
     * parses the battle and sets members of the class accordingly
     * @param {string} src the page source 
     */
    parse(src) {
        //create a DOM
        const dom = new DOMParser().parseFromString(src, 'text/html')
        const roundRootElem = [].find.call(dom.getElementsByTagName('a'), p => p.href.includes(`FILE=${this.id}`)).parentElement.parentElement
        this.date = roundRootElem.querySelector('td:nth-child(2)').innerHTML
        this.mc = roundRootElem.querySelector('td:nth-child(3)').innerHTML
        this.downloads = roundRootElem.querySelector('td:nth-child(4)').innerHTML
        this.name = roundRootElem.querySelector('td:nth-child(1) > a').innerHTML

    }

}