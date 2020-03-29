import Vue from 'nativescript-vue'
import Home from './components/Home'

Vue.config.silent = true

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)

new Vue({
    render: h => h('frame', [h(Home)])
}).$start()
