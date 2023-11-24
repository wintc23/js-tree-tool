type Config = {
  /**@default 'id' */
  id?: string
  /**@default 'pid' */
  pid?: string
  /**@default 'children' */
  children?: string
}

const DEFAULT_CONFIG = {
  id: 'id',
  pid: 'pid',
  children: 'children',
}

type Fn<T> = (e: T) => unknown

const getConfig = <T extends Config>(config?: T) => ({ ...DEFAULT_CONFIG, ...config })

function insert(tree, node, targetNode, config, after) {
  config = getConfig(config)
  const { children } = config
  function insert(list) {
    let idx = list.indexOf(node)
    idx < 0 ? list.forEach(n => insert(n[children] || [])) : list.splice(idx + after, 0, targetNode)
  }
  insert(tree)
}

const tools = {
  /**列表结构转树结构 */
  fromList<T>(list: T[], config?: Config) {
    config = getConfig(config)
    const nodeMap = new Map(), result = <T[]>[], { id, children, pid } = config
    for (const node of list) {
      node[children] = node[children] || []
      nodeMap.set(node[id], node)
    }
    for (const node of list) {
      const parent = nodeMap.get(node[pid])
        ; (parent ? parent.children : result).push(node)
    }
    return result
  },
  
  /**树结构转列表结构 */
  toList<T>(tree: T[], config?: Config) {
    config = getConfig(config)
    const { children } = config, result = [...tree]
    for (let i = 0; i < result.length; i++) {
      if (!result[i][children]) continue
      result.splice(i + 1, 0, ...result[i][children])
    }
    return result
  },
  
  /**查找符合条件的单个节点，返回广度优先遍历查找到的第一个符合条件的节点 */
  findNode<T>(tree: T[], cb: Fn<T>, config ?: Config) {
    config = getConfig(config)
    const { children } = config, list = [...tree]
    for (let node of list) {
      if (cb(node)) return node
      node[children] && list.push(...node[children])
    }
  },
  
  /**查找符合条件的所有节点 */
  findNodeAll<T>(tree: T[], cb: Fn<T>, config?: Config) {
    config = getConfig(config)
    const { children } = config, list = [...tree], result = <T[]>[]
    for (let node of list) {
      cb(node) && result.push(node)
      node[children] && list.push(...node[children])
    }
    return result
  },
  
  /**查找符合条件的单个节点的路径 */
  findPath<T>(tree: T[], cb: Fn<T>, config?: Config) {
    config = getConfig(config)
    const path = <T[]>[], list = [...tree], visitedSet = new Set(), { children } = config
    while (list.length) {
      const node = list[0]
      if (visitedSet.has(node)) {
        path.pop()
        list.shift()
      } else {
        visitedSet.add(node)
        node[children] && list.unshift(...node[children])
        path.push(node)
        if (cb(node)) return path
      }
    }
  },
  
  /**查找符合条件的所有节点的路径 */
  findPathAll<T>(tree: T[], cb: Fn<T>, config?: Config) {
    config = getConfig(config)
    const path = [], list = [...tree], result = <T[][]>[]
    const visitedSet = new Set(), { children } = config
    while (list.length) {
      const node = list[0]
      if (visitedSet.has(node)) {
        path.pop()
        list.shift()
      } else {
        visitedSet.add(node)
        node[children] && list.unshift(...node[children])
        path.push(node)
        cb(node) && result.push([...path])
      }
    }
    return result
  },
  
  /**树结构筛选，一个节点符合条件，其祖先节点也会被保留返回 */
  filter<T>(tree: T[], cb: Fn<T>, config?: Config) {
    config = getConfig(config)
    const { children } = config
    function listFilter(list: T[]) {
      return list.map(node => ({ ...node })).filter(node => {
        node[children] = node[children] && listFilter(node[children])
        return cb(node) || (node[children] && node[children].length)
      })
    }
    return listFilter(tree)
  },
  
  /**树结构遍历，深度优先 */
  forEach<T>(tree: T[], cb: Fn<T>, config?: Config) {
    config = getConfig(config)
    const list = [...tree], { children } = config
    for (let i = 0; i < list.length; i++) {
      cb(list[i])
      list[i][children] && list.splice(i + 1, 0, ...list[i][children])
    }
  },
  
  /**在指定oldNode前插入newNode，如果树中没有oldNode，则不会改变原数组 */
  insertBefore<T>(tree: T[], newNode: T, oldNode: T, config?: Config) {
    insert(tree, oldNode, newNode, config, 0)
  },
  
  /**在指定oldNode后插入newNode，如果树中没有oldNode，则不会改变原数组 */
  insertAfter<T>(tree: T[], oldNode: T, newNode: T, config?: Config) {
    insert(tree, oldNode, newNode, config, 1)
  },
  
  /**删除符合条件的所有节点 */
  removeNode<T>(tree: T[], cb: Fn<T>, config?: Config) {
    config = getConfig(config)
    const { children } = config, list = [tree]
    while (list.length) {
      const nodeList = list.shift()
      const delList = nodeList.reduce((r, n, idx) => (cb(n) && r.push(idx), r), [])
      delList.reverse()
      delList.forEach(idx => nodeList.splice(idx, 1))
      const childrenList = nodeList.map(n => n[children]).filter(l => l && l.length)
      list.push(...childrenList)
    }
  }
}


export default {
  ...tools,
  /**创建闭包了配置项config的实例，为了避免每个函数都传入config参数，你可以使用该API创建一个实例，以上所有API可以当成实例方法使用 */
  createInstance(config: Config) {
    const obj = {} as typeof tools
    for (const key in tools) {
      const func = tools[key]
      obj[key] = (...args) => func(...args, config)
    }
    return obj
  }
}