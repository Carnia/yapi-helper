<template>
  <div class="ctx-wrapper">
    <div class="header-wrapper">
      <button @click="addConfig">新增配置</button>
      <button class="expand" @click="expandRef = !expandRef">{{ expandRef ? '收起' : '展开' }}</button>
    </div>
    <div class="config-item" v-for="(config, i) in configArray" :key="i">
      <button v-show="expandRef" @click="deleteConfig(i)" style="margin-right: 10px;"
        :disabled="configArray.length <= 1" :title="configArray.length <= 1 ? '至少保留一个' : ''">删除</button>
      <input type="text" v-model="config.name" style="margin-right: 5px;" placeholder="请输入配置名" />
      <div class="detail-wrapper" v-show="expandRef">
        <span>选择数据路径：</span>
        <select class="path-select" @change="(e: any) => {
        config.targetPathInResponse = e.target.value
      }" :value="config.targetPathInResponse">
          <option value="" disabled class="select-placeholder">--快捷填写--</option>
          <option value="data.req_query">请求：query</option>
          <option value="data.req_body_other">请求：body</option>
          <option value="data.res_body">响应：body</option>
          <option value="data.res_body.data">响应：body.data</option>
          <option value="data.res_body.data.items">响应：body.data.items</option>
        </select>
        <input type="text" class="path-input" :style="!config.targetPathInResponse && 'border-color: red;'"
          v-model="config.targetPathInResponse" placeholder="请输入待处理的对象路径" />
        <span class="arrow">-></span>
        <span>执行代码段：</span>
        <select @change="selectSnippet" v-model="config.snippetId" :style="!config.snippetId && 'border-color: red;'">
          <option value="" disabled class="select-placeholder">--请选择代码片段--</option>
          <option v-for="item in codeSnippetArray" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
          <option :value="undefined" disabled class="select-placeholder">--可在插件设置页面自定义配置--</option>
        </select>
      </div>
      <button @click="exec(config)" :disabled="!config.targetPathInResponse || !config.snippetId"
        :title="!config.targetPathInResponse || !config.snippetId ? '请将配置填写完整再执行' : ''">执行</button>
    </div>
    <div v-show="expandRef" style="font-size: 12px">点击插件图标，查看相关说明</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { axios } from '@/axios/index'
import Message from 'vue-m-message'
import { setClipboard, evaluate, useCodeSnippet, toTS, PROP_GLOBAL_KEY, COPY_TS_TEXT, useConfig, Config, evaluate_hard } from './utils/index'
const expandRef = ref(false);
const { codeSnippetArray } = useCodeSnippet()
const { configArray, createConfig } = useConfig(() => {
  // 默认初始化新增一条数据
  if (!configArray.value.length) {
    addConfig()
  }
})
const addConfig = () => {
  configArray.value.push(createConfig())
  expandRef.value = true;
}
const deleteConfig = (index: number) => {
  configArray.value.splice(index, 1)
}
const exec = async (config: Config) => {
  const { api, getParamsFn, targetPathInResponse, snippetId } = config

  const snippet = codeSnippetArray.value.find(v => v.id === snippetId)
  if (snippet) {
    const params = evaluate_hard(getParamsFn);
    const forTS = snippet.name === COPY_TS_TEXT;
    const propsObj = await fetchAndPickObj(api, params, targetPathInResponse, forTS)
    if (!propsObj) {
      Message.error('数据未找到，请重新配置【数据路径】');
      return
    }
    // @ts-ignore
    window[PROP_GLOBAL_KEY] = propsObj;
    window.setClipboard = setClipboard
    window.toTS = toTS
    console.log('数据路径【', config.targetPathInResponse, '】对应值：', propsObj)
    const res = evaluate(snippet.value) // const snippetId="function getMessage(){return 'Hello World';};console.log(getMessage());"
    console.log('代码段执行完毕，返回值：', res);
    Message.success('执行完毕')
  } else {
    Message.error('代码段未找到，请重新配置');
  }
}
/**
 * 获取接口数据，并按路径返回指定数据
 * @param api
 * @param params
 * @param targetPathInResponse
 */
const fetchAndPickObj = async (api: string, params: any, targetPathInResponse: string, forTS: boolean) => {
  const res: any = await axios.get(api, {
    params: params,
  })
  let target = res
  try {
    const paths = targetPathInResponse
      .split('.')
      .filter((v) => v);
    paths.forEach((key) => {
      if (typeof target[key] === 'string') {
        target = JSON.parse(target[key].replace('\n', ''))
      } else {
        let current;
        if (['array', 'object'].includes(target.type)) {
          if (target.type === 'array') {
            current = target?.items
          } else if (target.type === 'object') {
            current = target
          }
          target = current.properties[key]
        } else {
          target = target[key]
          // request query参数格式和响应body参数格式不一致，做一层转换
          if (Object.prototype.toString.call(target) === '[object Array]') {
            const _properties: any = {}
            target.forEach((v: any) => {
              v.type = 'string'
              v.description = v.desc
              _properties[v.name] = v
            })
            target = {
              description: "TBD",
              properties: _properties,
              type: "object"
            }
          }
        }
      }
    })
    // 获取对象的properties属性（除了TS模式下的最后一个属性）
    if (forTS) {
      target = target
    } else {
      if (target.type === 'array') {
        target = target?.items?.properties
      } else if (target.type === 'object') {
        target = target.properties
      }
    }
    return target
  } catch (error) {
    const errStr = `数据路径【${targetPathInResponse}】对应的数据不存在，请检查数据路径`;
    Message({ type: 'error', title: error as string + '\n', message: errStr })
    return Promise.reject(errStr)
  }
}
const selectSnippet = (e: any) => {
  const id = e.target.value
  const s = codeSnippetArray.value.find(v => v.id === id)
  console.log('已选择代码段', s?.name)
}
</script>
<style lang="less" scoped>
.ctx-wrapper {
  position: fixed;
  right: 20px;
  top: 200px;
  background-color: greenyellow;
  padding: 10px;
  font-weight: bold;
  max-height: 500px;
  overflow: auto;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

button {
  background-color: #fff;
  border: 1px solid #ccc;
  font-weight: bold;
  cursor: pointer;
}

input,
input:active {
  background-color: #fff;
  border: 1px solid #ccc;
  font-weight: bold;
  outline: none;
}

input::placeholder {
  font-weight: normal;
  font-size: 12px;
  color: #9c9c9c;
}

select {
  font-weight: bold;

}

option {
  font-weight: bold;
}


button:disabled {
  background-color: #eee8e8;
  color: #c2c2c2;

  cursor: not-allowed;
}

.config-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.detail-wrapper {
  display: flex;
  align-items: center;
  border-bottom: 1px solid;
  margin-right: 5px;

}


.arrow {
  padding: 0 10px;
}

.select-placeholder {
  color: #9c9c9c;
  text-align: center;
}

.path-input {
  width: 200px;
}

.path-select {
  width: 20px;
}
</style>
