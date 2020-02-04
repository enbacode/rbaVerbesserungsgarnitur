import browser from 'webextension-polyfill'
import axios from 'axios'
import vg from './core/rbaVG'
import './manifest.json'


// installation routine
browser.runtime.onInstalled.addListener(async() => {
	await vg.initSelf()
	await vg.initMods()
})

// register ajax message handlers
browser.runtime.onMessage.addListener((request, _, sendResponse) => {
	if (request.contentScriptQuery === 'ajaxGet') {
		axios.get(request.url)
			.then((response) => sendResponse({ response }))
			.catch((error) => sendResponse({ error }))
		return true
	}
	return false
})


browser.runtime.onMessage.addListener((request, _, sendResponse) => {
	if (request.contentScriptQuery === 'ajaxPost') {
		axios.post(request.url, request.data)
			.then((response) => sendResponse({ response }))
			.catch((error) => sendResponse({ error }))
		return true
	}

	return false
})

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
	if(changeInfo.url)
		if(changeInfo.url.contains('rbaforum.de') || changeInfo.url.contains('r-b-a.de'))
			browser.browserAction.enable(tabId)
		else
			browser.browserAction.disable(tabId)
})