import { expect, test } from 'vitest'
import { JSON2Table, table2JSON } from '../src'
import { removeAllBlank } from '../src/util'

test('JSON2Table', () => {
  const Table = removeAllBlank(`
  <table>
    <thead>
      <tr>
        <th>name</th>
        <th>age</th>
        <th>sex</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>tom</td>
        <td>18</td>
        <td>man</td>
      </tr>
      <tr>
        <td>jerry</td>
        <td>20</td>
        <td>woman</td>
      </tr>
    </tbody>
  </table>
  `)
  const DATA = [
    {
      name: 'tom',
      age: '18',
      sex: 'man',
    },
    {
      name: 'jerry',
      age: '20',
      sex: 'woman',
    },
  ]
  expect(removeAllBlank(JSON2Table(DATA))).toBe(Table)
})

test('expect get data', () => {
  const DATA = [
    {
      name: 'tom',
      age: '18',
      sex: 'man',
    },
    {
      name: 'jerry',
      age: '20',
      sex: 'woman',
    },
  ]
  document.body.innerHTML = JSON2Table(DATA)
  expect(table2JSON({ root: document.body as any })).toMatchObject(DATA)
})

test('select row', () => {
  const DATA = [
    {
      name: 'tom',
      age: '18',
      sex: 'man',
    },
    {
      name: 'jerry',
      age: '20',
      sex: 'woman',
    },
  ]
  document.body.innerHTML = JSON2Table(DATA)
  expect(
    table2JSON({
      selectRow: [1],
    }),
  ).toMatchObject([DATA[1]])
})
