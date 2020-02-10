import $ from 'jquery'
import boardM from './boardIcons/boardM.png'
import boardS from './boardIcons/boardS.png'
import threadM from './boardIcons/threadM.png'
import threadNewM from './boardIcons/threadNewM.png'
import firstNewPost from './boardIcons/goToFirstNewPostS.png'
import lastPost from './boardIcons/goToLastPostS.png'
import bannedS from './boardIcons/bannedS.png'
import style from './style.scss'

import vg from './../../core/rbaVG'

export default {
    name: 'classicIcons',
    description: 'Klassische Icons',
    longDescription: 'Verwendet einen Teil der alten Icons. Ersetzt außerdem die Avatare vor Threads durch die alten "Beitrag"-Icons. Anwendung gemeinsam mit "Klassische Themen- und Forenübersicht" empfohlen.',
    target: 'board',
    category: 'cosmetic',
    style: style,
    inject: () => {

        $(document).ready(() => {
            //replace all folder open icons
            vg.currentPage.htmlElement.querySelectorAll('.icon.icon32.fa-folder-open-o, .icon.icon32.fa-folder-open').forEach(e => {
                e.classList.remove('fa-folder-open-o')
                e.classList.remove('fa-folder-open')
                let img = document.createElement('img')
                img.src = boardM
                e.appendChild(img)
            })

            //replace all folder icons
            vg.currentPage.htmlElement.querySelectorAll('.icon.icon16.fa-folder-o, .icon.icon16.fa-folder').forEach(e => {
                e.classList.remove('fa-folder-o')
                e.classList.remove('fa-folder')
                let img = document.createElement('img')
                img.src = boardS
                e.appendChild(img)
            })

            //replace lock icon
            vg.currentPage.htmlElement.querySelectorAll('.icon.icon16.fa-lock').forEach(e => {
                let appendElement = e
                if(e.classList.contains('jsUserBanned')) {
                    e.style.display = 'none'
                    appendElement = document.createElement('div')
                    e.parentElement.parentElement.insertBefore(appendElement, e.parentElement.nextSibling)
                }
                e.classList.remove('fa-lock')
                let img = document.createElement('img')
                img.src = bannedS
                appendElement.appendChild(img)
            })

            //replace all avatars with thread icons
            vg.currentPage.htmlElement.querySelectorAll('.tabularListRow .wbbThread').forEach(e => {
                const img = e.querySelector('.columnAvatar img')
                img.setAttribute('width', '24')
                img.setAttribute('height', '24')
                img.classList.remove('userAvatarImage')
                img.classList.add('threadM')
                if (e.classList.contains('new')) {
                    img.src = threadNewM
                    const newPostArrow = document.createElement('img')
                    newPostArrow.src = firstNewPost
                    const heading = e.querySelector('h3')
                    heading.insertBefore(newPostArrow, heading.firstChild)
                }
                else {
                    img.src = threadM
                }
                //replace user avatars of "last poster" with "goto last post"-arrow
                const lastPosterImg = e.querySelector('.columnLastPost img')
                if (lastPosterImg) {
                    lastPosterImg.setAttribute('width', '16')
                    lastPosterImg.setAttribute('height', '16')
                    lastPosterImg.classList.remove('userAvatarImage')
                    lastPosterImg.src = lastPost
                }


            })
        })
    }
}