declare interface BMapIcon {
  new (url: string, icon: BMapIcon): unknown
}

declare interface BMapSize {
  new (number, number): unknown
}

declare type BMapPointType = {
  lng: number
  lat: number
}

declare interface BMapPoint {
  new (lng: number, lat: number): BMapPointType
}

declare interface BMapAddressComponents {
  city: string // 市
  district: string // 区
  province: string // 省
  street: string // 街道
  streetNumber: string // 街道号
}

declare interface BMapSurroundingPoi {
  Yi?: string
  address: string
  city?: string
  phoneNumber?: null | string | number
  point: BMapPointType
  postcode?: null | string | number
  tags?: string[]
  title?: string
  type?: number
  uid?: string
}

declare interface GetLocationResult {
  address: string // 地址
  addressComponents: BMapAddressComponents
  business: string
  point: BMapPointType
  surroundingPois: BMapSurroundingPoi[]
}

declare interface BMapGeocoder {
  new (): {
    getPoint(address: string, callback: (point: BMapPointType) => void): void
    getLocation(
      point: BMapPointType,
      callback: (result: GetLocationResult) => void
    ): void
  }
}

declare interface BMapGeolocation {
  new (): {
    getCurrentPosition(
      callback: (e: {
        latitude: string
        longitude: string
        speed: null
        timestamp: null
        point: BMapPointType
        address: {
          city: string
          city_code: number
          district: string
          province: string
          street: string
          street_number: string
        }
      }) => void
    ): void
  }
}

declare interface BMap {
  Geocoder: BMapGeocoder
  Geolocation: BMapGeolocation
  Point: BMapPoint
  Size: BMapSize
  Icon: BMapIcon
}

declare const BMap: BMap = window.BMap
