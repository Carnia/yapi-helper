// inject-popstate-listener

function hookHistoryMethod(methodName) {
    const originalMethod = history[methodName]
    return function (...args) {
      const result = originalMethod.apply(this, args)
      const event = new Event(methodName.toLowerCase())
      event.arguments = args
      window.dispatchEvent(event)
      window.dispatchEvent(new Event('locationchange'))
      return result
    }
  }
  history.pushState = hookHistoryMethod('pushState')
  history.replaceState = hookHistoryMethod('replaceState')
  window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'))
  })
  
  window.addEventListener('locationchange', (event) => {
    window.postMessage({ type: 'POPSTATE_EVENT', state: event.state }, '*')
  })