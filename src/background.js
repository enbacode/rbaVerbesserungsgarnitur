import browser from 'webextension-polyfill'
import axios from 'axios'
import vg from './core/rbaVG'
import './manifest.json'


// installation routine
browser.runtime.onInstalled.addListener(async () => {
    await vg.initSelf()
    await vg.initMods()
})

//message handler for ajax GET
browser.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.contentScriptQuery === 'ajaxGet') {
        axios.get(request.url)
            .then((response) => sendResponse({ response }))
            .catch((error) => sendResponse({ error }))
        return true
    }
    return false
})

//message handler for ajax POST
browser.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.contentScriptQuery === 'ajaxPost') {
        axios.post(request.url, request.data)
            .then((response) => sendResponse({ response }))
            .catch((error) => sendResponse({ error }))
        return true
    }

    return false
})