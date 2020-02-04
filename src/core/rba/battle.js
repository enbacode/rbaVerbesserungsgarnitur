import vg from '../rbaVG'
import _ from 'lodash'

export default class Battle {

    static create(battle) {
        return new Battle(battle)
    }

    constructor(battle) {
        this.url = battle
        this.title = ''
        this.term = ''
        this.opponent = {}
        this.contender = {}
        this.rounds = []
    }

    async fetch() {
        const resp = await vg.ajax.get(this.url)
        return this.parse(resp.response.data)
    }

    parse(src) {
        const dom = new DOMParser().parseFromString(src, 'text/html')
        const _title = dom.getElementsByTagName('h2')[1].innerHTML.match(/(.+) vs. (.+) \((\d*) : (\d*)\)/)
        const _term = dom.querySelector('body > div > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(3) > td')
            .innerHTML.replace(' Frist:', '').replace(' Stunden', '')
        
        let row = dom.querySelector('body > div > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(5)')
        const _rounds = []
        let round = {}
        let i = 0
        while(row) {
            let cols = row.cells
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