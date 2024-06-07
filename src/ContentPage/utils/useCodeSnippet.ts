import { ref, watch } from 'vue'

const CODES = 'codes'

/**
 * 获取storage里的代码段数据
 * @returns
 */
export const useCodeSnippet = (onInitd?: () => void) => {
  const RAW_STRING_READONLY = ref('')
  const codeSnippetArray = ref<
    {
      id: string
      name: string
      value: string
      immutable?: boolean
    }[]
  >([])
  // 初始化数据
  chrome.storage.sync.get([CODES], (result) => {
    if (result[CODES]) {
      RAW_STRING_READONLY.value = result[CODES]
      codeSnippetArray.value.push(...JSON.parse(result[CODES]))
    }
    onInitd && onInitd()
  })

  // codeSnippetArray被改动则自动同步
  watch(
    () => codeSnippetArray.value,
    (val) => {
      chrome.storage.sync.set({ [CODES]: JSON.stringify(val) })
    },
    {
      deep: true,
    }
  )

  // RAW_STRING_READONLY被改动则手动同步
  // watch(() => RAW_STRING_READONLY.value, (val) => {
  //   chrome.storage.sync.set({ [CODES]: val })
  // }, {
  //   deep: true
  // });

  // 同步RAW_STRING_READONLY变更，or同步其他页面的变更
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      /**
       * //存储的名字
        console.log(key)
        //存储的类型local或者sync
        console.log(namespace)
        //存储更新前的数据,首次存储为undefined
        console.log(oldValue)
        //存储更新后的数据
        console.log(newValue)
       */
      if (key === CODES) {
        RAW_STRING_READONLY.value = newValue
        codeSnippetArray.value = JSON.parse(newValue)
      }
    }
  })

  return {
    RAW_STRING_READONLY,
    codeSnippetArray,
  }
}
