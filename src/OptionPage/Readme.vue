<script setup lang="ts">
import { PROP_GLOBAL_KEY } from '@/ContentPage/utils'
</script>

<template>
    <div class="reademe-wrapper">
        <h1>说明</h1>
        <h2>此插件在yapi页面中使用，用于<b>快速生成/复制自定义文本结构</b></h2>
        <div>
            <div>① yapi页面：
                <ol>
                    <li>
                        <img src="/src/assets/demo.webp" width="300px" alt="">
                    </li>
                    <li><b>选择数据路径</b>：yapi接口页的数据中，挑选指定路径的数据</li>
                    <li><b>选择要执行的代码段</b>：选择一个代码段，用于对上一步获得的数据进行处理</li>
                    <li><b>执行</b>: 点击后，将会按顺序执行上述步骤</li>
                </ol>
            </div>
            <div>② 代码段配置页面（<b>当前页</b>）：
                <ul>
                    <li>代码段：用于处理接口（请求、响应）数据</li>
                    <li>代码段预设环境变量：
                        <ol>
                            <li><b>window.{{ PROP_GLOBAL_KEY }}</b>：根据路径配置输出的接口数据（Object或Array，取决于自定义的数据路径），代码段里主要就是处理它</li>
                            <li><b>window.setClipboard</b>：(str: string)=>void，将字符串拷进剪贴板</li>
                            <li><b>window.toTS</b>: (obj: Object)=>string，将指定对象转成ts类型字符串</li>
                        </ol>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.reademe-wrapper {
    width: 400px;
    text-align: left;
    padding-right: 20px;
}
</style>
