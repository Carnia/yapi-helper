const componentStrMap = {
  string: `component: "Input",`,
  array: `component: "ApiSelectEnhanch",
    componentProps: {
      ...selectTypeMap.accountSelectProps,
      mode: "multiple",
    },`,
}
const ignoreProps = ['ordersList',  'tenantId', 'dataPermissionSql']
const createSchemaExport = (properties) => {
  const keys = []
  const propStrings = Object.entries(properties)
    .map(([key, value]) => {
      if (ignoreProps.includes(key)) {
        return undefined
      }
      keys.push(key)
      const desc = (value.description || "")
        .split(".")[0];
      const componentStr =
        componentStrMap[value.type.toLowerCase()] || componentStrMap["string"];
      return `export const ${key}: FormSchema = {
  field: '${key}',
  label: '${desc}',
  ${componentStr}
};`;
    })
    .join("\n");
  return `import { FormSchema } from '@tis/components/Form';
${propStrings}
export const TBD_Schema: FormSchema[] = [
  ${keys.join(`,
  `)}
]`;
};
const str = createSchemaExport(window.PROP_DATA);
window.setClipboard(str);
