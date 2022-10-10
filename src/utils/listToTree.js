function listToTree (list, tree, parentId) {
  list.forEach(item => {
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}

export default function (arr) {
  const result = []
  arr.filter(i => !arr.find(m => m.id === i.parentId)).forEach(obj => {
    if (arr.find(n => n.parentId === obj.id)) {
      Object.assign(obj, { children: [] })
      listToTree(arr, obj.children, obj.id)
    }
    result.push(obj)
  })
  return result
}
