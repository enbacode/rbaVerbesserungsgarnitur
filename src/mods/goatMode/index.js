import $ from 'jquery'

export default {
    name: 'goatMode',
    description: 'Goat Mode',
    longDescription: 'Määäääääh!',
    category: 'feature',
    enabled: false,
    target: 'board',
    inject: () => {

        $(document).ready(() => {
            document.querySelectorAll('img.userAvatarImage').forEach((e) => {
                e.src = 'https://placegoat.com/128/128'
            })
            document.querySelector('.pageHeaderLogoLarge').src = 'https://placegoat.com/415/254'
            document.body.innerHTML.replace('RBA', 'Ziegen')
        })

        walk(document.body)

        function walk(node) {

            let child, next

            let tagName = node.tagName ? node.tagName.toLowerCase() : ''
            if (tagName == 'input' || tagName == 'textarea') {
                return
            }
            if (node.classList && node.classList.contains('ace_editor')) {
                return
            }

            switch (node.nodeType) {
                case 1:  // Element
                case 9:  // Document
                case 11: // Document fragment
                    child = node.firstChild
                    while (child) {
                        next = child.nextSibling
                        walk(child)
                        child = next
                    }
                    break

                case 3: // Text node
                    handleText(node)
                    break
            }
        }

        function handleText(textNode) {
            let v = textNode.nodeValue

            v = v.replace(/\bRBA\b/g, 'Ziegen')
            v = v.replace(/\bVBT\b/g, 'SchafBT')
            v = v.replace(/\bkay\b/g, 'der Hirte')

            textNode.nodeValue = v
        }

    }
}


