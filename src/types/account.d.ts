// 微信账号信息接口
declare interface AccountInterface {
  id: string // id
  idCard: string // 身份证
  name: string // 姓名
  phone: string // 电话
  headImgUrl: string // 头像
  nickname: string // 昵称
  nicknameBase64: string // 昵称 base64
  openId: string // 微信openId
  personJoinState: 0 | 1 | 2 // 是否进场
}

// 个人信息接口
declare interface PersonalInterface {
  address: string // 地址
  birthday: string // 生日
  collectType: number // 信息采集方式:0=身份证阅读器、1=OCR识别、2=手动录入、3=自动匹配、4=shark同步 5=微信个人录入
  cultureLevelType: string // 学历
  driverElevatorCertificateNumber: string // 升降机司机证书编号
  driverTowerCertificateNumber: string // 塔机司机证书编号
  endDate: string // 有效期截止
  headImg: string // 身份证头像
  id: number // 主键
  idCard: string // 身份证号码
  idCardCode: string // 身份证物理编号
  installerElevatorCertificateNumber: string // 塔机拆卸工证书编号
  installerTowerCertificateNumber: string // 塔机拆卸工证书编号
  mobile: string // 电话
  name: string // 姓名
  nation: string // 民族
  photo: string // 头像
  police: string // 发证机关
  politicsType: string // 政治面貌
  sex: boolean // 性别
  signalTowerCertificateNumber: string // 塔机信号工证书编号
  startDate: string // 有效期起始
}
