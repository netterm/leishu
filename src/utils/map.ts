/**
 * 获取当前位置信息
 */
export function getCurrentPosition() {
  return new Promise<GetLocationResult>(resolve => {
    new BMap.Geolocation().getCurrentPosition(e => {
      new BMap.Geocoder().getLocation(e.point, res => {
        resolve(res)
      })
    })
  })
}
