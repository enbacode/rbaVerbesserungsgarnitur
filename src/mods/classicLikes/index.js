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

        $(document).ready(() => {
            $('.wbbPost.message').each((i, e) => {

                const objectID = e.getAttribute('data-object-id')
                let likeCount = $(e).find('.reactCountButton[data-reaction-type-id="2"] .reactionCount').text()
                const likeText = $(e).find('.reactionSummaryList')
                likeText.css("display", "block")
                likeText.empty()
                if (likeCount)
                    likeText.html(`Es haben sich bereits ${likeCount} Benutzer bedankt`)

                $(e).find('.reactButton').text('Bedanken').click((event) => {
                    
                    let formData = `actionName=react&className=%5Cwcf%5Cdata%5Creaction%5CReactionAction&parameters%5Bdata%5D%5BobjectID%5D=${objectID}&parameters%5Bdata%5D%5BobjectType%5D=com.woltlab.wbb.likeablePost&parameters%5BreactionTypeID%5D=2`

                    ajax.post('https://rbaforum.de/index.php?ajax-proxy&t=' + ajax.getSecurityToken(), formData)
                        .then((response) => {
                            likeCount = response.response.data.returnValues.reactions[2]
                            
                            if (likeCount)
                                likeText.html(`Es haben sich bereits ${likeCount} Benutzer bedankt`)
                            else
                                likeText.empty()
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