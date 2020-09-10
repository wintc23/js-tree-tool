const tree = require('./dist/index')

function getTree () {
  const tree = [
    {
      id: '1',
      title: '节点1',
      children: [
        {
          id: '1-1',
          title: '节点1-1'
        },
        {
          id: '1-2',
          title: '节点1-2',
          children: [
            {
              id: '1-2-1',
              title: '节点1-2-1'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: '节点2',
      children: [
        {
          id: '2-1',
          title: '节点2-1'
        }
      ]
    }
  ]
  return tree
}

function getList () {
  const list = [
    {
      id: '1',
      title: '节点1',
      parentId: '',
    },
    {
      id: '1-1',
      title: '节点1-1',
      parentId: '1'
    },
    {
      id: '1-2',
      title: '节点1-2',
      parentId: '1'
    },
    {
      id: '2',
      title: '节点2',
      parentId: ''
    },
    {
      id: '2-1',
      title: '节点2-1',
      parentId: '2'
    }
  ]
  return list
}

// 创建一个实例，因为数据里的pid属性名与默认值不同，所以需要传递该配置项
const instance = tree.createInstance({ pid: 'parentId' })

// 列表结构转树
function testFromList () {
  const list = getList()
  const tree = instance.fromList(list)
  console.log(JSON.stringify(tree, null, 2))
}

// 树结构转列表结构
function testToList () {
  const tree = getTree()
  const list = instance.toList(tree)
  console.log(list.map(i => i.id))
}

// 查找节点
function testFindNode () {
  const callback = node => node.id == '2-1'
  const tree = getTree()
  const result = instance.findNode(tree, callback)
  console.log(JSON.stringify(result, null, 2))
}

// 查找符合条件的所有节点
function testFindNodeAll () {
  const list = getList()
  const tree = instance.fromList(list)
  
  const callback = node => node.parentId == '1'
  const result = instance.findNodeAll(tree, callback)
  console.log(JSON.stringify(result, null, 2))
}

// 查找节点路径
function testFindPath () {
  const callback = node => node.id == '2-1'
  const tree = getTree()
  const result = instance.findPath(tree, callback)
  console.log(result.map(i => i.id))
}

// 查找符合条件的所有节点的路径
function testFindPathAll () {
  const callback = node => node.id == '2-1' || node.id == '1-2-1'
  const tree = getTree()
  const result = instance.findPathAll(tree, callback)
  console.log(result)
}

// 树节点过滤
function testFilter () {
  const callback = node => node.id == '2-1'
  const tree = getTree()
  const result = instance.filter(tree, callback)
  console.log(JSON.stringify(result, null, 2))
}

// 树节点遍历 深度优先
function testForEach () {
  const tree = getTree()
  const idList = []
  instance.forEach(tree, node => idList.push(node.id))
  console.log(idList)
}

// 节点插入：在node前插入newNode
function testInsertBefore () {
  const tree = getTree()
  const node = instance.findNode(tree, n => n.id == '1-2-1')
  const newNode = {
    id: '1-2-0',
    title: '节点1-2-0'
  }
  instance.insertBefore(tree, newNode, node)
  const idList = []
  instance.forEach(tree, node => idList.push(node.id))
  console.log(idList)
}

// 节点插入：在node后插入newNode
function testInsertAfter () {
  const tree = getTree()
  const node = instance.findNode(tree, n => n.id == '1-2-1')
  const newNode = {
    id: '1-2-2',
    title: '节点1-2-2'
  }
  instance.insertAfter(tree, node, newNode)
  const idList = []
  instance.forEach(tree, node => idList.push(node.id))
  console.log(idList)
}

// 节点删除：删除符合条件的Node
function testRemoveNode () {
  const tree = getTree()
  instance.removeNode(tree, n => n.id == '1')
  console.log(tree)
}

function test () {
  // testToList()
  // testFromList()
  // testFindNode()
  // testFindNodeAll()
  // testFindPath()
  // testFilter()
  // testForEach()
  // testFindPathAll()
  // testInsertBefore()
  // testInsertAfter()
  testRemoveNode()
}

test()