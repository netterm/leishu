/**
 * 根据id获取图片显示路径
 * @param id 图片id
 * @param isHBase 是否为hbase存储
 * @returns
 */
export function getImageUrlById(id?: string, isHBase?: boolean) {
  if (!id) return undefined
  if (/^(http|\/center)/.test(id)) {
    return id
  } else {
    const url =
      (isHBase
        ? '/center/file/k/q/hbase/open/image/'
        : '/center/file/k/q/open/image/') + id
    return url.replace('//', '/')
  }
}

/**
 * 根据id获取文件下载路径
 * @param id 文件id
 * @param isHBase 是否为hbase存储
 * @returns
 */
export function getFileUrlById(id: string, isHBase?: boolean) {
  if (!id) return undefined
  if (/^(http|\/center)/.test(id)) {
    return id
  } else {
    const url =
      (isHBase
        ? '/center/file/k/q/hbase/open/download/'
        : '/center/file/k/q/open/download/') + id
    return url.replace('//', '/')
  }
}

/**
 * 根据视频文件id获取视频播放路径
 * @param id 视频id
 * @param isHBase 是否为hbase存储
 * @returns
 */
export function getVideoUrlById(id: string, isHBase?: boolean) {
  if (!id) return undefined
  if (/^(http|\/center)/.test(id)) {
    return id
  } else {
    return (
      (isHBase
        ? '/center/file/k/q/hbase/open/video/play/'
        : '/center/file/k/q/open/video/play/') + id
    )
  }
}
