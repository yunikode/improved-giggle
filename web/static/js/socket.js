import { Socket } from 'phoenix'
import Vue from 'vue'
import MyApp from '../components/my-app.vue'

let socket = new Socket('/socket', {params: {token: window.userToken}})

socket.connect()

// Create the main component
Vue.component('my-app', MyApp)

// and create the top-level view model

new Vue({
  el: '#app',
  data () {
    return {
      channel: null,
      messages: []
    }
  },
  mounted () {
    this.channel = socket.channel("room:lobby", {})
    this.channel.on('new_msg', payload => {
      payload.received_at = Date()
      this.messages.push(payload)
    })
    this.channel.join()
      .receive('ok', response => { console.log('joined successfully', response) })
      .receive('error', response => { console.log('Unable to join', response) })
  },
  render (createElement) {
    return createElement(MyApp, {})
  }
})
