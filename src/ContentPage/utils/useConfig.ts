import { ref, watch } from 'vue'

const CONFIG_STORAGE_KEY = 'configs'
export type Config = {
  name: string;
  type: string;
  apiType: string;
  api: string;
  getParamsFn: string;
  targetPathInResponse: string;
  snippetId: string;
}
const createConfig = () => {
  const config: Config = {
    name: '未命名配置',
    type: 'yapi',
    apiType: 'get',
    api: `/api/interface/get`,
    getParamsFn: `let __params = {
      id: (location.pathname.match(/\\d+$/g) || [])[0],
    };
    __params;`,
    targetPathInResponse: '', // data.res_body.data
    snippetId: '',
  }
  return config
}
/**
 * 获取storage里的代码段数据
 * @returns
 */
export const useConfig = (onInitd?: () => void) => {
  const configArray = ref<Config[]>([])
  // 初始化数据
  chrome.storage.sync.get([CONFIG_STORAGE_KEY], (result) => {
    if (result[CONFIG_STORAGE_KEY]) {
      configArray.value.push(...JSON.parse(result[CONFIG_STORAGE_KEY]))
    }
    onInitd && onInitd()
  })

  // codeSnippetArray被改动则自动同步
  watch(
    () => configArray.value,
    (val) => {
      chrome.storage.sync.set({ [CONFIG_STORAGE_KEY]: JSON.stringify(val) })
    },
    {
      deep: true,
    }
  )


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
      if (key === CONFIG_STORAGE_KEY) {
        configArray.value = JSON.parse(newValue)
      }
    }
  })

  return {
    configArray,
    createConfig,
  }
}
