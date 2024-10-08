import App from './App.vue';
import Icon from './Lib/Icons/Icon.vue';
import * as Vue from 'vue'

import './assets/css/main.css';
const { createApp } = Vue;
// + | inject balafon in order to provide balafon library svg management. use at leas 32 svg icons
import libicons from 'virtual:balafon-libicons';
// + | inject global vue request by application 
globalThis.Vue = Vue; 
let app = createApp(App); 
if (libicons){
    // + initialize vitual applications 
    app.provide('lib/icons', {default: 'ionicons', libicons});
}

// console.log(Icon)
// app.component('Icon', {
//     render(){
//         const {h}=Vue;
//         return h('div','sample');
//     }
// });
if (Icon)
    app.component('Icon', Icon )
app.mount('#app')