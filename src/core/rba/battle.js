import vg from '../rbaVG'
import _ from 'lodash'

export default class Battle {

    /**
     * represent a RBA battle
     * @param {URL} battleURL the battle URL
     */
    constructor(battleURL) {
        this.url = battleURL
        this.title = ''
        this.term = ''
        this.opponent = {}
        this.contender = {}
        this.rounds = []
    }

    /**
     * fetches the battle document content
     */
    async fetch() {
        const resp = await vg.ajax.get(this.url)
        return this.parse(resp.response.data)
    }

    /**
     * parses the battle and sets members of the class accordingly
     * @param {string} src the page source 
     */
    parse(src) {
        //create a DOM
        const dom = new DOMParser().parseFromString(src, 'text/html')
        //parse the title
        const _title = dom.getElementsByTagName('h2')[1].innerHTML.match(/(.+) vs. (.+) \((\d*) : (\d*)\)/)
        //parse the term (Frist)
        const _term = dom.querySelector('body > div > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(3) > td')
            .innerHTML.replace(' Frist:', '').replace(' Stunden', '')
        
        // get the first table row that contains round information
        let row = dom.querySelector('body > div > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(5)')
        const _rounds = []
        let round = {}
        let i = 0
        //walk the rows
        while(row) {
            let cols = row.cells
            //check if the current row contains round information (not comments)
            if(cols[0] && _.get(cols[0], 'children[0].tagName').toLowerCase() == 'a') {
                round = {
                    index: i,
                    name: cols[0].children[0].innerHTML,
                    mp3: cols[0].children[0].href.replace('rbaforum', 'r-b-a'),
                    date: cols[1].innerHTML,
                    mc: cols[2].innerHTML,
                    downloads: cols[3].innerHTML,
                    votes: []
                }
                _rounds.push(round)
                i++
            }
            row = row.nextElementSibling
        }
        
        //set members
        this.title = _title[0]
        this.term = _term
        this.opponent = {
            name: _title[1],
            score: _title[3]
        }
        this.contender = {
            name: _title[2],
            score: _title[4]
        }
        this.rounds = _rounds 
    }

}