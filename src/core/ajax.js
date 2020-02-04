export default {
    get(url) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({contentScriptQuery: 'ajaxGet', url: url }, (message) => {
                resolve(message)
            })
        })  
    },

    post(url, data) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({contentScriptQuery: 'ajaxPost', url: url, data: data}, (message) => {
                resolve(message)
            })
        })  
    },

    getSecurityToken() {
        const matches = document.documentElement.innerHTML.match(/SECURITY_TOKEN = '(\w+)'/)
        if(matches)
            return matches[1]
        return null
    }
}