import {
  dig,
  countWordInText,
  deepFindKeys,
  getNearestObjectKeyAndIndexStartToEnd
} from "../index"

describe('dig object', () => {
  const object = {
    animal: {
      marmal: {
        moles: [{
            name: 'Mr. Resetti'
          },
          {
            name: 'Don Resetti'
          }
        ]
      }
    }
  }

  const targetMap = {
    animal: {
      marmal: {
        moles: [{},
          {
            name: '***'
          }
        ]
      }
    }
  }

  test('word count', () => {
    expect(countWordInText('***', '***|***')).toBe(2)
    expect(countWordInText('{', JSON.stringify(targetMap))).toBe(5)
    expect(countWordInText('}', JSON.stringify(targetMap))).toBe(5)
    expect(countWordInText('[', JSON.stringify(targetMap))).toBe(1)
    expect(countWordInText(']', JSON.stringify(targetMap))).toBe(1)
  })

  test('get nearest key from object', () => {
    const [key, startIndex, endIndex] = getNearestObjectKeyAndIndexStartToEnd({
      name: '*'
    }, '*')
    expect(key).toBe('name')
    // {"name":"*"}
    // 012345678901
    expect(startIndex).toBe(0)
    expect(endIndex).toBe(11)
  })

  test('get nearest key from nested object', () => {
    const [key, startIndex, endIndex] = getNearestObjectKeyAndIndexStartToEnd({
      first: {
        name: '*'
      },
      second: {
        name: 'dummy'
      }
    }, '*')
    expect(key).toBe('name')
    // {"first":{"name":"*"},"second":{"name":"dummy"}}
    //          ^          ^
    // 012345678901234567890123456789012345678901234567
    expect(startIndex).toBe(9)
    expect(endIndex).toBe(20)
  })

  test('get nearest key from nested object if targetMarker is changed', () => {
    const [key, startIndex, endIndex] = getNearestObjectKeyAndIndexStartToEnd({
      first: {
        name: '***'
      },
      second: {
        name: 'dummy'
      }
    }, '***')
    expect(key).toBe('name')
    // {"first":{"name":"***"},"second":{"name":"dummy"}}
    //          ^            ^
    // 012345678901234567890123456789012345678901234567
    expect(startIndex).toBe(9)
    expect(endIndex).toBe(22)
  })

  test('get nearest key from array', () => {
    const [key, startIndex, endIndex] = getNearestObjectKeyAndIndexStartToEnd([{}, '*'], '*')
    expect(key).toBe(1)
    // [{},"*"]
    // 01234567
    expect(startIndex).toBe(0)
    expect(endIndex).toBe(7)
  })

  test('get nearest key from array', () => {
    const [key, startIndex, endIndex] = getNearestObjectKeyAndIndexStartToEnd(['*', {}], '*')
    expect(key).toBe(0)
    // ["*",{}]
    // 01234567
    expect(startIndex).toBe(0)
    expect(endIndex).toBe(7)
  })

  test('deepFindKeys in simple object', () => {
    expect(deepFindKeys({
      name: '*'
    }, '*')).toEqual(['name'])
  })

  test('deepFindKeys in simple array', () => {
    expect(deepFindKeys([0, 1, '*'], '*')).toEqual([2])
  })

  test('deepFindKeys in simple array if marker changed', () => {
    expect(deepFindKeys([0, 1, '***'], '***')).toEqual([2])
  })

  test('deepFindKeys with object included by array', () => {
    expect(deepFindKeys([0, 1, {
      name: '*'
    }], '*')).toEqual([2, 'name'])
  })

  test('deepFindKeys with nested object', () => {
    expect(deepFindKeys([0, 1, {
      first: {
        second: {
          third: {
            name: '*'
          }
        }
      }
    }], '*')).toEqual([2, 'first', 'second', 'third', 'name'])
  })

  test("dig second mole's name", () => {
    expect(dig({
      animal: {
        marmal: {
          moles: [{
              name: 'Mr. Resetti'
            },
            {
              name: 'Don Resetti'
            }
          ]
        }
      }
    }, {
      animal: {
        marmal: {
          moles: [{
              name: 'Mr. Resetti'
            },
            {
              name: '***'
            }
          ]
        }
      }
    }, '***')).toBe('Don Resetti')
  })
})
