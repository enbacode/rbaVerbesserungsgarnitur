import vg from '../rbaVG'

/**
 * represents an abstract board page
 */
export default class Page {

	/**
	 * Loads the page. Pages can either be loaded via an HTMLElement 
	 * (if the current document corresponds to the page class)
	 * or from an URL. This is useful to create a cross-site 
	 * (rba/board) object model. Full features are only guaranteed in element mode 
	 * @param {(HTMLElement|URL)} obj Assigns the root HTMLElement if given a HTMLElement. Downloads the URL
	 * content and creates a DOM if given a URL
	 */
    load(obj) {
        if(obj instanceof HTMLElement) {
			this.htmlElement = obj
		}
		else {
			this.url = obj
			this.htmlElement =  fetch().then(data => { return new DOMParser().parseFromString(data, 'text/html')})
		}
		this.parse()
	}
	
	/**
     * parses the start page and initializes things array
     * from the given DOM object
     */
	parse() {

	}

	/**
	 * fetches the url
	 */
    async fetch() {
		const response = (await vg.ajax.get(this.url)).response
		return response.data
	}
    
    get _things() {
        return []
    }

}