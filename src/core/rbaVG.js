import browser from 'webextension-polyfill'
import availableMods from '../availableMods'
import ajaxHelper from './ajax'

import StartPage from './board/startPage'
import ThreadPage from './board/threadPage'
import ThreadList from './board/threadList'
import Battle from './rba/battle'


export default {
    availableMods: availableMods,

    ajax: ajaxHelper,
    battle: Battle,

    async isActive() {
        try {
            return (await browser.storage.local.get('active')).active
        }
        catch {
            await browser.storage.local.set({'active': true})
            return true
        } 
    },

    async storeMods(mods) {
        //FF throws an error when trying to save objects that have non-serializable members
        //converting the object to json, then parsing it back is a quick and simple way to
        //get rid of all non-serializable objects 
        await browser.storage.local.set({ mods: JSON.parse(JSON.stringify(mods)) })
    },

    async storedMods() {
        try {
            let storedMods = await browser.storage.local.get('mods')
            storedMods = storedMods.mods

            let mods = []

            availableMods.forEach((e) => {
                let proto = storedMods.find((p) => p.name == e.name)
                mods.push({
                    ...e,
                    ...proto,
                })
            })

            return mods
        }
        catch {
            return availableMods
        }
    },

    inject(mods) {
        
        this.isActive().then((isActive) => {

            if(!isActive)
                return

            mods.filter(p => p.enabled).filter(p => p.active).forEach((mod) => {
                const modMatchesLocation = window.location.href.match(mod.match)
                if (mod.match && modMatchesLocation || !mod.match) {
                    if (typeof mod.inject != 'undefined') {
                        mod.inject()
                    }
                }
            })

        })
        
        
    },

    async initMods() {

        await browser.storage.local.remove('mods')
        
        let mods = availableMods.map((mod) => { 
            mod.active = true
            mod.enabled = (mod.enabled === false ? false : true)
            mod.showInOptions = (mod.showInOptions === false ? false : true)
            if(mod.style)
                mod.styleString = mod.style[0][1]
            delete mod.inject
            delete mod.style
            return mod
        })
        
        await browser.storage.local.set({ 'mods': 
            mods
        })

    },

    async initSelf() {
        await browser.storage.local.set({'active': true})
    },

    initPage() {
        //TODO there must be a less ugly way to init currentPage
        if(window.location.href.match(StartPage.match()))
            this.currentPage = new StartPage(document.body)
        else if(window.location.href.match(ThreadPage.match()))
            this.currentPage = new ThreadPage(document.body)
        else if(window.location.href.match(ThreadList.match()))
            this.currentPage = new ThreadList(document.body)
    }
}