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
  let list = [
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

const instance = tree.createInstance({ pid: 'parentId' })

function testTreeToList () {
  const tree = getTree()
  const list = instance.treeToList(tree)
  console.log(JSON.stringify(list, null, 2))
}

function testListToTree () {
  const list = getList()
  const tree = instance.listToTree(list)
  console.log(JSON.stringify(tree, null, 2))
}

function testTreeFindNode () {
  const callback = node => node.id == '2-1'
  const tree = getTree()
  const result = instance.treeFindNode(tree, callback)
  console.log(JSON.stringify(result, null, 2))
}

function testTreeFindNodeAll () {
  const list = getList()
  const tree = instance.listToTree(list)
  
  const callback = node => node.parentId == '1'
  const result = instance.treeFindNodeAll(tree, callback)
  console.log(JSON.stringify(result, null, 2))
}

function testTreeFindPath () {
  const callback = node => node.id == '2-1'
  const tree = getTree()
  const result = instance.treeFindPath(tree, callback)
  console.log(JSON.stringify(result, null, 2))
}

function testTreeFilter () {
  const callback = node => node.id == '2-1'
  const tree = getTree()
  const result = instance.treeFilter(tree, callback)
  console.log(JSON.stringify(result, null, 2))
}

function testTreeForEach () {
  const tree = getTree()
  const idList = []
  instance.treeForEach(tree, node => idList.push(node.id))
  console.log(idList)
}

function test () {
  testTreeToList()
  testListToTree()
  testTreeFindNode()
  testTreeFindNodeAll()
  testTreeFindPath()
  testTreeFilter()
  testTreeForEach()
}

test()