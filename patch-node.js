// Shim 1: map 'node:xxx' imports to 'xxx' for Node <14.18
const Module = require('module')
const original = Module._load
Module._load = function (request, parent, isMain) {
  if (typeof request === 'string' && request.startsWith('node:')) {
    request = request.slice(5)
  }
  return original.call(this, request, parent, isMain)
}

// Shim 2: add createFilter to vite for @vitejs/plugin-react@2.x + vite@2.x
const viteModule = require('vite')

function createFilter(include, exclude) {
  const toArray = (val) => {
    if (!val) return []
    return Array.isArray(val) ? val : [val]
  }
  const incList = toArray(include)
  const excList = toArray(exclude)

  return function filter(id) {
    const str = String(id)
    for (const ex of excList) {
      if (typeof ex === 'string' ? str.includes(ex) : ex.test(str)) return false
    }
    if (incList.length === 0) return true
    for (const inc of incList) {
      if (typeof inc === 'string' ? str.includes(inc) : inc.test(str)) return true
    }
    return false
  }
}

viteModule.createFilter = createFilter
