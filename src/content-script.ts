import { createApp } from 'vue'
import Content from '@/ContentPage/index.vue'
import 'vue-m-message/dist/style.css'

const rootEl = document.createElement('div')
rootEl.setAttribute('id', 'crx-root')
document.body.appendChild(rootEl)
let app: any;
const init = () => {
  if (location.href.match(/\/project\/\d+\/interface\/api\/\d+/)) {
    app && app.unmount()
    app = createApp(Content)
    app.mount('#crx-root')
  } else {
    app && app.unmount()
  }
}
init()

// 注入 inject.js 脚本
var s = document.createElement('script')
s.src = chrome.runtime.getURL('inject-popstate-listener.js')
;(document.head || document.documentElement).appendChild(s)
s.onload = function () {
  s.remove()
  // 监听 window 的消息事件
  window.addEventListener('message', function (event) {
    // 确保消息来源是当前页面
    if (event.source !== window) {
      return
    }
    if (event.data.type && event.data.type === 'POPSTATE_EVENT') {
      // 这里可以执行你需要的其他操作
      init()
    }
  })
}