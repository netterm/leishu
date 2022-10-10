function globComponents(app) {
  // 寻找components目录下所有用户glob:true属性的组件
  const components = import.meta.globEager('./**/*.(vue|jsx|tsx)')
  Object.keys(components).forEach(path => {
    const componentConfig = components[path].default
    if (componentConfig.glob)
      app.component(componentConfig.name, componentConfig)
  })
}

export default app => {
  app.use(globComponents) // 加载有glob:true属性的全局组件
}
