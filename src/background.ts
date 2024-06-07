// 改写点击插件图标默认事件-点击插件图标打开配置页
chrome.action.onClicked.addListener((tab) => {
  chrome.runtime.openOptionsPage()
})

chrome.tabs.onActivated.addListener(function (activeInfo) {
  // 在此处处理标签切换
  console.log('Tab with ID ' + activeInfo.tabId + ' was activated in window ' + activeInfo.windowId)

  // 可以使用 chrome.tabs.get 来获取更多有关新激活标签的信息
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    updateIcon(tab?.url?.match(/\/project\/\d+\/interface\/api\/\d+/) ? 2 : 1)
  })
})
const updateIcon = (type: 1 | 2) => {
  const iconName = type === 1 ? 'icon1.png' : 'icon2.png'
  chrome.action.setIcon({
    path: {
      '32': iconName,
      '72': iconName,
      '128': iconName,
      '512': iconName,
    },
  })
}
