## JS树结构数据处理工具

## 一、简介
tree-tool是一个用于处理js树结构的一些函数，无任何依赖，体积非常小，仅有3KB。

其实代码本身很简单，但是因为问我的同学太多了，加之我在好几个项目需要用到几乎完全相同的代码，我就写了些非常通用的函数收集在这个库里。


## 二、安装
```bash
#使用yarn
yarn add tree-tool
#使用npm
npm install tree-tool
```

## 三、使用

### 引用
```js
// commonjs
const treeTool = require('tree-tool')

// esm
import treeTool from 'tree-tool'
```

### API说明
| 功能 | API  | 备注 |
| ---- | :----: | :----: | :----: |
| 列表结构转树结构 | treeTool.listToTree(list[, config]) | |
| 树结构转列表结构 | treeTool.treeToList(tree[, config] ) | |
| 查找符合条件的单个节点 | treeTool.treeFindNode(tree, callback[, config]) | 返回广度优先遍历查找到的第一个符合条件(callback(node)为true)的节点，没有则返回null |
| 查找符合条件的所有节点 | treeTool.treeFindNodeAll(tree, callback[, config]) |
| 查找节点路径 | treeTool.treeFilter(tree, callback[, config]) | 返回符合条件(callback(node)为true)的节点的所有祖先节点有序组成的数组，没有找到节点则返回null |
| 树结构筛选 | treeTool.treeFindNode(tree, callback[, config]) | 返回符合筛选条件(callback(node)为true)的树节点构成的树，一个节点符合条件，其祖先节点也会被保留返回 |
| 树结构遍历 | treeTool.treeForEach(tree, callback[, config]) | 对于所有节点node调用callback(node)，广度优先 |
| 创建闭包了配置项config的实例 | treeTool.createInstance(config) | 为了避免每个函数都传入config参数，你可以使用该API创建一个实例，以上所有API可以当成实例方法使用 |

参数说明：
1. list 列表 给定一组node节点列表，每个node节点至少包含两个属性：唯一标识和父节点标识，例如：
  ```js
    let list = [
    { id: '1', title: '节点1', parentId: '', },
    { id: '1-1', title: '节点1-1', parentId: '1' },
    { id: '1-2', title: '节点1-2', parentId: '1' },
    { id: '2', title: '节点2', parentId: '' },
    { id: '2-1', title: '节点2-1', parentId: '2' }
  ]
  ```
2. tree 树结构数据 一个数组表示的一棵树，例如：
  ```js
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
  ```
3. callback 回调函数，接收node参数，在查找、筛选等功能中表示约束条件，在遍历功能中则为对每个节点的操作。
4. config 可选，用于自定义node节点的唯一标识、父节点、子节点的属性名称，默认值如下（可只定义其中某几个）
  ```js
  {
    id: 'id', // 唯一标识属性名
    children: 'children', // 子节点属性名
    pid: 'pid' // 父节点标识属性名
  }
  ```

## 四、使用示例
```js
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
function testListToTree () {
  const list = getList()
  const tree = instance.listToTree(list)
  console.log(JSON.stringify(tree, null, 2))
}

// 树结构转列表结构
function testTreeToList () {
  const tree = getTree()
  const list = instance.treeToList(tree)
  console.log(JSON.stringify(list, null, 2))
}

// 查找节点
function testTreeFindNode () {
  const callback = node => node.id == '2-1'
  const tree = getTree()
  const result = instance.treeFindNode(tree, callback)
  console.log(JSON.stringify(result, null, 2))
}

// 查找符合条件的所有节点
function testTreeFindNodeAll () {
  const list = getList()
  const tree = instance.listToTree(list)
  
  const callback = node => node.parentId == '1'
  const result = instance.treeFindNodeAll(tree, callback)
  console.log(JSON.stringify(result, null, 2))
}

// 查找节点路径
function testTreeFindPath () {
  const callback = node => node.id == '2-1'
  const tree = getTree()
  const result = instance.treeFindPath(tree, callback)
  console.log(JSON.stringify(result, null, 2))
}

// 树节点过滤
function testTreeFilter () {
  const callback = node => node.id == '2-1'
  const tree = getTree()
  const result = instance.treeFilter(tree, callback)
  console.log(JSON.stringify(result, null, 2))
}

// 树节点遍历
function testTreeForEach () {
  const tree = getTree()
  const idList = []
  instance.treeForEach(tree, node => idList.push(node.id))
  console.log(idList)
}
```

-------
## 联系我

使用过程中有任何问题，请联系我：

Email: lushg-tcxg@qq.com

wechat: mask_23

-----
## 有BUG或新需求

欢迎在issue提树结构相关的新需求或者本库的BUG，以帮助我完善这个小树库，感谢。

您也可以通过PR参与完善，非常感谢。
