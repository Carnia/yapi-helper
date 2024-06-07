const createColumnList = (properties) => {
    const propStrings = Object.entries(properties).map(([key, value]) => {
    const desc = (value.description || '').split('.')[0].split(',')[0].split('，')[0]
    return `{
    title: '${desc}',
    dataIndex: '${key}',
  },`
  }).join('\n');
  return `
  import { BasicColumn } from '@tis/components/Table';
  /**
  * TODO
  */
  export const TBD_Columns = ([
  ${propStrings}] as BasicColumn[]).map(v => {
    v.format = v.format || COLUMN_TOOL.format;
    return v;
  })`
};
const str = createColumnList(window.PROP_DATA);
window.setClipboard(str);
