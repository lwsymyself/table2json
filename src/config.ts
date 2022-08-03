type root = string | HTMLElement
export interface IConfig {
  // 根元素范围，如果传递的是一个字符串，会调用querySelect
  root?: root
  keys?: string[]
  skipBlankColumn?: boolean
  ignoreColumn?: (number | string)[]
  // 忽略表格内容的文字排版
  ignoreComposingText?: boolean
  selectRow?: number[]
}
export const defaultConfig: IConfig = {
  root: document.body,
  skipBlankColumn: true,
  ignoreComposingText: false,
}
