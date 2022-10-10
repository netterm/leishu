export function setTitle(to) {
  return new Promise(resolve => {
    const title = to?.meta?.title || '工人端'
    if (typeof title === 'function') {
      document.title = title(to)
    } else {
      document.title = title
    }
    resolve()
  })
}
