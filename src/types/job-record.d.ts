// 从业记录接口
declare interface JobRecordInterface {
  category: string // 人员类型
  enterDate: string // 进场时间
  exitDate: string // 出场时间
  groupName: string // 所属班组名称
  id: string // 主键ID
  projectName: string // 所属项目名称
  projectId: string // 所属项目id
  status: boolean // 状态: true=在场 false=出场
  workerType: string // 工种
}

// 从业记录详情接口
declare interface JobRecordDetailInterface {
  corpName: string // 所属企业
  enterDate: string // 进场时间
  exitDate: string // 出场时间
  groupName: string // 所属班组名称
  id: string // 主键ID
  personName: string // 人员姓名
  projectAddress: string // 项目地址
  projectCompleteDate: string // 项目完工时间
  projectManager: string // 项目经理
  projectName: string // 项目名称
  projectId: string // 项目id
  projectPhone: string // 联系电话
  projectStartDate: string // 项目开工时间
  projectStatus: string // 项目状态
  status: boolean // 状态，true=在场；false=出场
  workerType: string // 工种
}
