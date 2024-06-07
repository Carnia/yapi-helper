import './jstt.js'
// import { compile } from 'json-schema-to-typescript'
export * from './eval'
export * from './const'
export * from './useCodeSnippet'
export * from './useConfig'
export function setClipboard(value: string) {
    var copy = document.createElement("textarea");
    document.body.appendChild(copy);
    copy.value = value;
    copy.select();
    document.execCommand("copy");
    document.body.removeChild(copy);
}

export function formatJson(object:any) {
    var cloneObject = JSON.parse(JSON.stringify(object));
    cloneObject.additionalProperties = false;
  
    function loop(looper: any) {
      for (var key in looper) {
        if (looper[key].properties) {
          looper[key].additionalProperties = false;
        }
        if (typeof looper[key] === "object") {
          loop(looper[key]);
        }
      }
    }
    loop(cloneObject);
    return cloneObject;
  }

export const toTS = async (propObj: any) => {
  try {
    const p1 = await window.jstt.compile(propObj, 'TBD', {
      bannerComment: "",
      declareExternallyReferenced: true,
      enablevarEnums: true,
      unreachableDefinitions: false,
      strictIndexSignatures: false,
      format: false,
      unknownAny: false,
    })
    return p1
  } catch (error) {
    console.error('ts类型转换失败，请检查待处理数据是否是个对象:', propObj);
    return Promise.reject();
  }
}