import vg from '../rbaVG'

export default class Page {

    load(obj) {
        if(obj instanceof HTMLElement) {
			this.htmlElement = obj
		}
		else {
			this.htmlElement =  fetch().then(data => { return new DOMParser().parseFromString(data, 'text/html')})
		}
		this.parse()
    }

    async fetch() {
		const response = (await vg.ajax.get(this.url)).response
		return response.data
	}
    
    get _things() {
        return []
    }

}