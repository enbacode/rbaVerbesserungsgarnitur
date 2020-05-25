import browser from 'webextension-polyfill'
import availableMods from '../availableMods'
import ajax from './ajax'

import StartPage from './board/startPage'
import ThreadPage from './board/threadPage'
import ThreadList from './board/threadList'

import greeting from './greeting.txt'

import Vue from 'vue'

export default {

    /**
     * eventBus
     */
    eventBus: new Vue(),
    
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
        console.debug('vg.inject: entering')
        //retrieve active state
        this.isActive().then((isActive) => {

            if(!isActive) {
                console.info('vg.inject: vg is inactive, not injecting anything')
                return
            }

            //filter out inactive & disabled mods
            mods = mods.filter(p => p.enabled).filter(p => p.active)
            console.info('vg.inject: trying to inject these mods: ', mods)

            mods.forEach((mod) => {
                //make sure the mod's match property, if set, matches the location
                // and inject function exists.
                const modMatchesLocation = window.location.href.match(mod.match)
                if (mod.match && modMatchesLocation || !mod.match) {
                    if (typeof mod.inject != 'undefined') {
                        console.debug('vg.inject: injecting mod', mod)
                        mod.inject()
                    }
                    else {
                        console.debug('vg.inject: nothing to inject', mod)
                    }
                }
            })

            console.info('vg.inject: mod injection complete')

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
        console.debug('vg.initMods: entering')
        
        let storedMods = await this.storedMods()
        console.debug('vg.initMods: loaded mods from storage', storedMods)

        let mods = availableMods.map((mod) => {
            const storedMod = storedMods.find(p => p.name == mod.name)
            mod.active = true
            mod.enabled = (mod.enabled === false ? false : true)
            mod.showInOptions = (mod.showInOptions === false ? false : true)
            if(mod.style)
                mod.styleString = mod.style[0][1]
            if(storedMod) {
                console.debug('vg.initMods: merging bundle with storage for', mod, storedMod)
                mod = {...mod, ...storedMod}
            }
            return mod
        })
        console.debug('vg.initMods: sending these mods to storage', mods)
        await this.storeMods(mods)
        console.info('vg.initMods: initialization complete', mods)
    },

    /**
     * initializes basic functionality of rbaVG
     * 
     * this only needs to be called once per extension
     * instance (e.g. in the background script)
     */
    async initSelf() {

        console.debug('vg.initSelf: entering')
        
        //initialize storage 'active' setting
        await browser.storage.local.set({'active': true})
        
        //initialize settings
        console.debug('vg.initSelf: applying these default settings', this.defaultSettings)
        this.setSettings(this.defaultSettings)
        
        console.info('vg.initSelf: initialization complete')
    },

    /**
     * initializes page functionality.
     * 
     * this needs to be called once per page
     * (e.g. in the content script)
     */
    initPage() {
        //log a greeting to the console
        console.info(`%c${greeting}\n${this.manifest.short_name} v${this.manifest.version}`, 'color: #007bff; font-weight: 900; background-color: orange; font-size: 12pt;')

        //TODO there must be a less ugly way to init currentPage
        if(window.location.href.match(StartPage.match()))
            this.currentPage = new StartPage(document.body)
        else if(window.location.href.match(ThreadPage.match()))
            this.currentPage = new ThreadPage(document.body)
        else if(window.location.href.match(ThreadList.match()))
            this.currentPage = new ThreadList(document.body)
        console.info('vg.initPage: initialization complete')
        
        
    },
}