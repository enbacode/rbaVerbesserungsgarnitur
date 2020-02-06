import style from './style.scss'
import ajax from '../../core/ajax'
import $ from 'jquery'

export default {
    name: 'classicLikes',
    description: 'Klassische Bedankungen',
    longDescription: 'Deaktiviert alle Reaktionen, abgesehen von den Bedankungen, und ersetzt den "Reagieren" durch einen "Bedanken"-Button. Diese Einstellung bezieht sich nur auf eure eigene Ansicht, andere Benutzer sehen weiterhin alle Reaktionen.',
    style: style,
    category: 'cosmetic',
    target: 'board',
    inject: () => {
        //TODO un-jq this
        //TODO use vDOM for this
        $(document).ready(() => {
            //get all posts
            $('.wbbPost.message').each((i, e) => {
                //store the data ID. We need this later to POST a like
                const objectID = e.getAttribute('data-object-id')
                //store current count and text
                let likeCount = $(e).find('.reactCountButton[data-reaction-type-id="2"] .reactionCount').text()
                const likeText = $(e).find('.reactionSummaryList')
                //apply display: block to the text to make sure
                //new likes are shown after POST
                likeText.css('display', 'block')
                //clear the current text, remove list
                likeText.empty()
                //apply like text if there are already likes on the post
                if (likeCount)
                    likeText.html(`Es haben sich bereits ${likeCount} Benutzer bedankt`)

                //replace react with like button
                $(e).find('.reactButton').text('Bedanken').click((event) => {
                    
                    //toggle like via POST
                    let formData = `actionName=react&className=%5Cwcf%5Cdata%5Creaction%5CReactionAction&parameters%5Bdata%5D%5BobjectID%5D=${objectID}&parameters%5Bdata%5D%5BobjectType%5D=com.woltlab.wbb.likeablePost&parameters%5BreactionTypeID%5D=2`
                    ajax.post('https://rbaforum.de/index.php?ajax-proxy&t=' + ajax.getSecurityToken(), formData)
                        .then((response) => {
                            //get new like count from response
                            likeCount = response.response.data.returnValues.reactions[2]
                            
                            //set like text
                            if (likeCount)
                                likeText.html(`Es haben sich bereits ${likeCount} Benutzer bedankt`)
                            else
                                likeText.empty()
                            //toggle active state of button
                            if ($(event.target).hasClass('active'))
                                $(event.target).removeClass('active')
                            else
                                $(event.target).addClass('active')
                        })
                })
            })

        })
    }
}