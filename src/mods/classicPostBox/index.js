import style from './style.scss'

export default {
    name: 'classicPostBox',
    description: 'Klassische Beitragsanzeige',
    longDescription: 'Verändert die Box, welche einen Beitrag beinhaltet, sodass diese der alten Form stärker ähnelt.',
    style: style,
    category: 'cosmetic',
    target: 'board',
    match: 'index\\.php\\?thread'
}