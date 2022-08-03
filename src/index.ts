import type { IConfig } from './config'
import { defaultConfig } from './config'
import { isTest } from './util'
type root = string | HTMLElement

const selectColumns: boolean[] = []
const columnKeys: string[] = []
const getRoot = (root: root) => {
  if (typeof root === 'string')
    return document.querySelector(root) as HTMLElement

  return root
}
const getText = (item: HTMLElement, config: IConfig) =>
  (isTest || config.ignoreComposingText
    ? item.textContent
    : item.innerText) || ''
const determineSelectColumns = (
  ths: HTMLTableCellElement[],
  config: IConfig,
) => {
  ths.forEach((th, index) => {
    if (
      config.ignoreColumn
      && (config.ignoreColumn.includes(index)
        || config.ignoreColumn.includes(th.innerText))
    ) {
      selectColumns[index] = false
      return
    }
    if (th.innerText === '') {
      selectColumns[index] = false
      return
    }
    selectColumns[index] = true
    columnKeys[index] = getText(th, config) || ''
  })
}
const getEachRowData = (row: HTMLTableRowElement, config: IConfig) => {
  const res: Record<string, string> = {}
  Array.from(row.cells).forEach((item, index) => {
    if (selectColumns[index])
      res[columnKeys[index]] = getText(item, config)
  })
  return res
}
type SimpleResult = Record<string, string>[]
// type ComplexResult = {
//   [key: string]: {
//     url: string;
//     text: string;
//   };
// }[];
// function Table2JSON(config: IConfig, complex: false): SimpleResult;
// TODO 实现复杂带url的结构。
// function Table2JSON(config: IConfig, complex: true): ComplexResult;
function table2JSON(config: IConfig = {}) {
  config = { ...defaultConfig, ...config }

  const root = getRoot(config.root!)

  determineSelectColumns(Array.from(root.querySelectorAll('th')), config)

  const result = Array.from(root.querySelector('tbody')!.querySelectorAll('tr'))
    .map(
      (row, index) =>
        (
          // 判断该行是否显示
          (isTest || (row.clientHeight !== 0 && row.clientWidth !== 0)))
        // 判断是否为用户选择行
        && (!config.selectRow || config.selectRow.includes(index))
        && getEachRowData(row, config),
    )
    .filter(item => Boolean(item))
  return result
}

function JSON2Table(data: SimpleResult) {
  const headRow = Object.keys(data[0])

  const createHead = (headList: string[]) => {
    return `<tr>${headList.map(item => `<th>${item}</th>`).join('')}</tr>`
  }

  const createEachRow = (rowData: Record<string, string>) => {
    return `<tr> ${headRow
      .map(key => `<td>${rowData[key]}</td>`)
      .join('')}</tr>`
  }

  return `<table><thead>${createHead(headRow)}</thead><tbody>${data
    .map(row => createEachRow(row))
    .join('')}</tbody></table>`
}
export { table2JSON, JSON2Table }
