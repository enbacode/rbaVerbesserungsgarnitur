export default {

    /**
     * GETs the content of the given url
     * @param {string} url the url to GET
     */
    get(url) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({contentScriptQuery: 'ajaxGet', url: url }, (message) => {
                resolve(message)
            })
        })  
    },

    /**
     * POSTs the given data to the url
     * @param {string} url the url to POST to
     * @param {any} data  the data
     */
    post(url, data) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({contentScriptQuery: 'ajaxPost', url: url, data: data}, (message) => {
                resolve(message)
            })
        })  
    },

    /**
     * fetches the SECURITY_TOKENfrom the website's source code
     */
    getSecurityToken() {
        const matches = document.documentElement.innerHTML.match(/SECURITY_TOKEN = '(\w+)'/)
        if(matches)
            return matches[1]
        return null
    }
}