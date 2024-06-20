<script setup lang="ts">
import { useCodeSnippet, PROP_GLOBAL_KEY, COPY_TS_TEXT } from '@/ContentPage/utils'
import { axios } from '@/axios';
import Readme from './Readme.vue'

const { RAW_STRING_READONLY, codeSnippetArray } = useCodeSnippet(() => {
  if (!codeSnippetArray.value.length) {
    init();
  }
});
const init = () => {
  Promise.all([
      axios.get('/toTS.js'),
      axios.get('/schema-list.js'),
    ]).then(([res1, res2, res3, res4]) => {
      codeSnippetArray.value.push({
        id: +new Date() + '_' + Math.random().toString().slice(2, 7),
        immutable: true,
        name: COPY_TS_TEXT,
        value: res1 as unknown as string
      }, {
        id: +new Date() + '_' + Math.random().toString().slice(2, 7),
        immutable: true,
        name: '复制Schema（export List）',
        value: res2 as unknown as string
      },)
    })
}
const add = () => {
  codeSnippetArray.value.push({
    id: +new Date() + '_' + Math.random().toString().slice(2, 7),
    name: '未命名',
    value: `// 全局变量：${PROP_GLOBAL_KEY}、setClipboard、toTS
console.log('hello world')`
  })
}
const deleteSnippet = (i: number) => {
  codeSnippetArray.value.splice(i, 1)
  if (codeSnippetArray.value.length === 0) {
    setTimeout(init, 500)
  }
}

</script>

<template>
  <div class="wrapper">
    <Readme />
    <div class="left">
      <h3>代码段配置</h3>
      <div class="tal">
        <button @click="add">新增</button>
      </div>
      <div class="mt10">
        <div class="item-wrapper">
          <div>代码段名</div>
          <div>代码段</div>
          <div>操作</div>
        </div>
        <div class="item-wrapper" v-for="(item, i) in codeSnippetArray" :key="item.id">
          <input type="text" :value="item.name" :disabled="item.immutable">
          <textarea :value="item.value" :disabled="item.immutable" :maxLength="2000"></textarea>
          <button @click="deleteSnippet(i)">删除</button>
        </div>
      </div>
    </div>
    <!-- 数据预览 -->
    <div class="right">
      <div>storage数据总览</div>
      <textarea class="show-all" disabled :value="RAW_STRING_READONLY"></textarea>
    </div>
  </div>
</template>

<style scoped>
button {
  border: 1px solid;
}

.tal {
  text-align: left;
}

.tar {
  text-align: right;
}

.mt10 {
  margin-top: 10px;
}

.wrapper {
  display: flex;
  height: 800px;
  font-size: 16px;
}

.left {
  border: 1px dashed #000;
  padding: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}

.right {
  margin-left: 40px;
  width: 300px;
  display: flex;
  flex-direction: column;
}

.item-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.item-wrapper>*:not(:last-child) {
  margin-right: 10px;
}

.show-all {
  display: block;
  width: 100%;
  /* height: 100%; */
  resize: vertical;
  flex: 1;
}
</style>
