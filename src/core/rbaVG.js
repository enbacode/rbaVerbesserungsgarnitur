import browser from 'webextension-polyfill'
import availableMods from '../availableMods'
import ajax from './ajax'

import StartPage from './board/startPage'
import ThreadPage from './board/threadPage'
import ThreadList from './board/threadList'

import greeting from './greeting.txt'


export default {

    /**
     * all available mods included in the bundle
     */
    availableMods: availableMods,

    /**
     * provides ajax calls that get dispatched to the background page
     */
    ajax: ajax,

    /**
     * the WebExtension manifest as object
     */
    manifest: browser.runtime.getManifest(),

    /**
     * the rbaVG default general settings
     */
    defaultSettings: {
        logging: {
            active: true,
            level: 'info'
        }
    },

    /**
     * settings caching object
     */
    _settings: null,

    /**
     * returns the rbaVG general settings
     */
    async getSettings() {
        if(this._settings)
            return this._settings
        return (await browser.storage.local.get('settings')).settings
            
    },

    /**
     * stores the provided general settings in LocalStorage
     * and sets the cached settings object
     * @param {Object} settings 
     */
    async setSettings(settings) {
        this._settings = settings
        await browser.storage.local.set({ settings: settings })
    },

    /**
     * returns wether the "active" flag is set in store
     */
    async isActive() {
        try {
            return (await browser.storage.local.get('active')).active
        }
        catch {
            await browser.storage.local.set({'active': true})
            return true
        } 
    },

    /**
     * 
     * @param {Array} mods 
     */
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
        //finally store the objects        
        await browser.storage.local.set({ mods: toStore })
    },

    /**
     * returns a list of mods with their respective settings from storage
     */
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

    /**
     * injects an array of mods into the page
     * this only includes the JS, not the CSS.
     * CSS gets injected as soon as the documentElement
     * exists
     * @param {Array} mods 
     */
    inject(mods) {
        
        //retrieve active state
        this.isActive().then((isActive) => {

            if(!isActive)
                return

            //filter out inactive & disabled mods
            mods.filter(p => p.enabled).filter(p => p.active).forEach((mod) => {
                //make sure the mod's match property, if set, matches the location
                // and inject function exists.
                const modMatchesLocation = window.location.href.match(mod.match)
                if (mod.match && modMatchesLocation || !mod.match) {
                    if (typeof mod.inject != 'undefined') {
                        mod.inject()
                    }
                }
            })

        })
        
        
    },

    /**
     * initializes mods with default values if none are present in storage
     * or merges stored and default values. 
     * 
     * this only needs to be called once per extension
     * instance (e.g. in the background script)
     */
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

    /**
     * initializes basic functionality of rbaVG
     * 
     * this only needs to be called once per extension
     * instance (e.g. in the background script)
     */
    async initSelf() {

        //initialize storage 'active' setting
        await browser.storage.local.set({'active': true})
        //initialize settings
        this.setSettings(this.defaultSettings)
    },

    /**
     * initializes page functionality.
     * 
     * this needs to be called once per page
     * (e.g. in the content script)
     */
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
    /**
     * logs a message to the console if logging criteria is met
     * (logging must be active, and logLevel must be higher or equal
     * than the user's setting)
     * @param {('debug'|'info'|'warning'|'error'|'always')} logLevel the log level
     * @param {string} message the message
     * @param {...any[]} optionalParams optional parameters passed to console.log
     */
    log(logLevel, message) {
        //get optionalParams from arguments object
        const optionalParams = Array.prototype.slice.call(arguments).slice(2)

        //if there are any optional params,
        //add them to the console.log arguments array
        let consoleArgs = [message]
        if(optionalParams.length > 0)
            consoleArgs = [message, optionalParams]
         
        //logLevel always alwys gets logged huehuehue
        if(logLevel == 'always') {
            console.log(...consoleArgs)
            return
        }

        //retrieve user settings
        const settings = this.getSettings().then(settings => {
            const logLevels = {
                'debug': 0,
                'info': 1,
                'warn': 2,
                'error': 3
            }
            //check active flag and log level
            if(settings.logging.active && logLevels[logLevel] >= logLevels[settings.logging.level]) {
                switch(logLevel) {
                    case 'debug':
                        console.debug(message, optionalParams)
                        break;
                    case 'info':
                        console.info(message, optionalParams)
                        break;
                    case 'warn':
                        console.warn(message, optionalParams)
                        break;
                    case 'error':
                        console.error(message, optionalParams)
                        break;
                }
            }
        })
    }
}