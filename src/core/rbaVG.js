import browser from 'webextension-polyfill'
import availableMods from '../availableMods'
import ajaxHelper from './ajax'

import StartPage from './board/startPage'
import ThreadPage from './board/threadPage'
import ThreadList from './board/threadList'
import Battle from './rba/battle'

import greeting from './greeting.txt'


export default {
    availableMods: availableMods,

    ajax: ajaxHelper,
    battle: Battle,

    manifest: browser.runtime.getManifest(),

    defaultSettings: {
        logging: {
            active: true,
            level: 'info'
        }
    },

    _settings: null,

    async getSettings() {
        if(this._settings)
            return this._settings
        return (await browser.storage.local.get('settings')).settings
            
    },

    async setSettings(settings) {
        this._settings = settings
        await browser.storage.local.set({ settings: settings })
    },

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
        //quickFix to make sure kamil is always showing
        const storedMods = await this.storedMods()
        let toStore = mods
        storedMods.forEach(mod => {
            const toStoreEquivalent = toStore.find(p => p.name == mod.name)
            if(!toStoreEquivalent)
                toStore.push(mod)
        })
        //FF throws an error when trying to save objects that have non-serializable members
        //converting the object to json, then parsing it back is a quick and simple way to
        //get rid of all non-serializable objects
        toStore = JSON.parse(JSON.stringify(mods))
        console.log(mods, toStore)
        
        await browser.storage.local.set({ mods: toStore })
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

        let storedMods = await this.storedMods()
        
        let mods = availableMods.map((mod) => {
            const storedMod = storedMods.find(p => p.name == mod.name)
            mod.active = true
            mod.enabled = (mod.enabled === false ? false : true)
            mod.showInOptions = (mod.showInOptions === false ? false : true)
            if(mod.style)
                mod.styleString = mod.style[0][1]
            if(storedMod)
                mod = {...mod, ...storedMod}
            delete mod.inject
            delete mod.style
            return mod
        })
        
        await browser.storage.local.set({ 'mods': 
            mods
        })

    },

    async initSelf() {

        //initialize storage 'active' setting
        await browser.storage.local.set({'active': true})
        this.setSettings(this.defaultSettings)
    },

    initPage() {

        //log a greeting to the console
        this.log('always', `${greeting}\n${this.manifest.short_name} v${this.manifest.version}`)

        //TODO there must be a less ugly way to init currentPage
        if(window.location.href.match(StartPage.match()))
            this.currentPage = new StartPage(document.body)
        else if(window.location.href.match(ThreadPage.match()))
            this.currentPage = new ThreadPage(document.body)
        else if(window.location.href.match(ThreadList.match()))
            this.currentPage = new ThreadList(document.body)
    },

    log(logLevel, message) {
        const logArgs = Array.prototype.slice.call(arguments).slice(2)
        let consoleArgs = [message]
        if(logArgs.length > 0)
            consoleArgs = [message, logArgs]
            
        if(logLevel == 'always') {
            console.log(...consoleArgs)
            return
        }
        const settings = this.getSettings().then(settings => {
            const logLevels = {
                'debug': 0,
                'info': 1,
                'warn': 2,
                'error': 3
            }
            if(settings.logging.active && logLevels[logLevel] >= logLevels[settings.logging.level]) {
                switch(logLevel) {
                    case 'debug':
                        console.debug(message, logArgs)
                        break;
                    case 'info':
                        console.info(message, logArgs)
                        break;
                    case 'warn':
                        console.warn(message, logArgs)
                        break;
                    case 'error':
                        console.error(message, logArgs)
                        break;
                }
            }
        })
    }
}