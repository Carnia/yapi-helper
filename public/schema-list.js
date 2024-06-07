const componentStrMap = {
  string: `component: "Input",`,
  array: `component: "Select",
    componentProps: {
      // TODO
    },`,
}
const ignoreProps = ['page', 'size']
const createSchemaList = (properties) => {
  const propStrings = Object.entries(properties)
    .map(([key, value]) => {
      if (ignoreProps.includes(key)) {
        return undefined
      }
      const desc = (value.description || '').split('.')[0]
      const componentStr = componentStrMap[value.type.toLowerCase()] || componentStrMap['string']
      return `{
    value: "${key}",
    key: "${desc}",
    ${componentStr}
  },`
    })
    .filter((v) => v)
    .join('\n')
  return `
  /**
   * TODO
   */
  export const TBD_Schema: any[] = [
  ${propStrings}
  ]`
}
const str = createSchemaList(window.PROP_DATA);
window.setClipboard(str);
