/**
 * 图片压缩
 * @param {File或Blob实例} file
 * @param {图片宽高值较大的值缩减为指定size值,另外值等比例缩放} size
 */
export default (file, size = 1200) => {
  return new Promise((resolve, reject) => {
    // 读取文件base64
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result
      img.onload = () => {
        // 获取图片原始宽高
        const originWidth = img.width
        const originHeight = img.height

        // 创建画布,根据传入的width计算压缩后的宽高并设置为画布尺寸
        const canvas = document.createElement('canvas')
        const scale = 1200 / Math.max(originWidth, originHeight)
        canvas.width = scale * originWidth
        canvas.height = scale * originHeight

        // 绘制图片
        const context = canvas.getContext('2d')
        context.drawImage(img, 0, 0, canvas.width, canvas.height)

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name))
        }, 'image/png', 1)
      }

      img.onerror = () => {
        reject(Error('图片压缩失败'))
      }
    }
  })
}
