const DEFAULT_CONFIG = {
  id: 'id',
  children: 'children',
  pid: 'pid'
}

const treeHanlder = {
  listToTree (list, config = {}) {
    config = Object.assign({}, DEFAULT_CONFIG, config)
    const nodeMap = new Map(), result = [], { id, children, pid } = config
    for (const node of list) {
      node[children] = node[children] || []
      nodeMap.set(node[id], node)
    }
    for (const node of list) {
      const parent = nodeMap.get(node[pid])
      ;(parent ? parent.children : result).push(node)
    }
    return result
  },

  treeToList (tree, config = {}) {
    config = Object.assign({}, DEFAULT_CONFIG, config)
    const { children } = config, result = [...tree]
    for (let i = 0; i < result.length; i++) {
      if (!result[i][children]) continue
      result.splice(i + 1, 0, ...result[i][children])
    }
    return result
  },
  
  treeFindNode (tree, func, config = {}) {
    config = Object.assign({}, DEFAULT_CONFIG, config)
    const { children } = config, list = [...tree]
    for (let node of list) {
      if (func(node)) return node
      node[children] && list.push(...node[children])
    }
    return null
  },

  treeFindNodeAll (tree, func, config = {}) {
    config = Object.assign({}, DEFAULT_CONFIG, config)
    const { children } = config, list = [...tree], result = []
    for (let node of list) {
      func(node) && result.push(node)
      node[children] && list.push(...node[children])
    }
    return result
  },
  
  treeFindPath (tree, func, config = {}) {
    config = Object.assign({}, DEFAULT_CONFIG, config)
    const path = [], list = [...tree], visitedSet = new Set(), { children } = config
    while (list.length) {
      const node = list[0]
      if (visitedSet.has(node)) {
        path.pop()
        list.shift()
      } else {
        visitedSet.add(node)
        node[children] && list.unshift(...node[children])
        path.push(node)
        if (func(node)) return path
      }
    }
    return null
  },

  treeFilter (tree, func, config = {}) {
    config = Object.assign({}, DEFAULT_CONFIG, config)
    const { children } = config
    function filter (list) {
      return list.map(node => ({ ...node })).filter(node => {
        node[children] = node[children] && filter(node[children])
        return func(node) || (node[children] && node[children].length)
      })
    }
    return filter(tree)
  },
  
  treeForEach (tree, func, config = {}) {
    config = Object.assign({}, DEFAULT_CONFIG, config)
    const list = [...tree], { children } = config
    for (const node of list) {
      func(node)
      node[children] && list.push(...node[children])
    }
  },

  createInstance (config) {
    const obj = {}
    for (let key in treeHanlder) {
      const func = treeHanlder[key]
      if (func == treeHanlder.createInstance) continue
      obj[key] = (...args) => func(...args, config)
    }
    return obj
  }
}

module.exports = treeHanlder