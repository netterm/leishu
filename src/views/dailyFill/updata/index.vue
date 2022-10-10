<template>
  <div class="page-wrapper overflow-hidden">
    <van-cell-group>
      <!-- 输入任意文本 -->

      <van-form @submit="submit">
        <van-field
          v-model="formData.username"
          placeholder="请输入名称"
          label="销售"
          input-align="right"
          readonly
          :rules="[{ required: true, message: '请填写用户名' }]"
          required
        />
        <!-- readonly -->
        <van-field
          v-model="formData.visitDate"
          :clickable="true"
          readonly
          label="拜访时间"
          placeholder="请选择拜访时间"
          input-align="right"
          required
          :rules="[{ required: true, message: '请填写拜访时间' }]"
          @click="dateshow = true"
        />
        <van-cell
          title="拜访方式"
          required
          :rules="[{ required: true, message: '请填写拜访方式' }]"
        >
          <van-radio-group
            v-model="formData.formOfVisit"
            direction="horizontal"
            @change="checkFormOfVisit"
          >
            <van-radio name="1" icon-size="16px">上门拜访</van-radio>
            <van-radio name="2" icon-size="16px">电话微信</van-radio>
          </van-radio-group>
        </van-cell>
        <van-cell
          title="客户类型"
          required
          :rules="[{ required: true, message: '请填写客户类型' }]"
        >
          <van-radio-group
            v-model="formData.customerType"
            direction="horizontal"
            @change="checkcustomerType"
          >
            <van-radio name="1" icon-size="16px">单位</van-radio>
            <van-radio name="2" icon-size="16px">项目</van-radio>
          </van-radio-group>
        </van-cell>
        <van-field
          v-if="isProject"
          v-model="formData.projectName"
          placeholder="请输入项目名称"
          label="项目名称"
          input-align="right"
          :rules="[{ required: true, message: '请填写项目名称' }]"
          required
          @input="verify"
          @blur="close"
        />
        <van-field
          v-else
          v-model="formData.companyName"
          center
          clearable
          label="单位名称"
          placeholder="请输入单位名称"
          input-align="right"
          :error-message="errMsg"
          :rules="[{ required: true, message: '请填写单位名称' }]"
          required
          @input="getCompanyName"
          @blur="close"
        >
          <!-- <template #button>
            <van-button size="small" type="primary" @click="getCompanyName"
              >验证</van-button
            >
          </template> -->
        </van-field>
        <van-field
          v-if="isProject"
          v-model="formData.projectAddress"
          placeholder="请输入项目地址"
          label="项目地址"
          input-align="right"
          :rules="[{ required: true, message: '请填写项目地址' }]"
          required
        />
        <van-field
          v-if="isProject"
          v-model="formData.companyName"
          center
          clearable
          label="企业名称"
          placeholder="请输入企业名称"
          input-align="right"
          :rules="[{ required: true, message: '请填写企业名称' }]"
          :error-message="errMsg"
          required
          @input="getCompanyName"
          @blur="close"
        >
          <!-- <template #button>
            <van-button size="small" type="primary" @click="getCompanyName"
              >验证</van-button
            >
          </template> -->
        </van-field>
        <!-- 添加多组人员信息 -->
        <div v-for="(item, index) in personArr" :key="index">
          <div class="conTitle">
            <span>联系人</span>
            <div class="btnBox">
              <van-icon
                v-if="personArr.length !== 1"
                name="clear"
                style="font-size: 18px"
                @click="del(index)"
              />
              <van-button
                v-if="index === personArr.length - 1"
                type="info"
                size="small"
                style="margin-left: 10px; background: #1c7afe; color: #fff"
                @click="addNum"
                >添加</van-button
              >
            </div>
          </div>
          <!-- 人员内容 -->
          <van-field
            v-model="item.name"
            placeholder="请输入客户名称"
            label="客户名称"
            input-align="right"
            :rules="[{ required: true, message: '请填写客户名称' }]"
            required
          />
          <van-field
            v-model="item.phone"
            placeholder="请输入客户联系方式"
            label="联系方式"
            type="tel"
            input-align="right"
            :rules="[{ required: true, message: '请填写联系方式' }]"
            required
          />
          <van-field
            v-model="item.job"
            placeholder="请输入客户担任职务"
            input-align="right"
            label="职务"
          />
        </div>

        <van-field
          v-model="cooperationText"
          :clickable="true"
          :readonly="isReadyonly"
          label="合作阶段"
          input-align="right"
          placeholder="请选择合作阶段"
          :rules="[{ required: true, message: '请填写合作阶段' }]"
          required
          @click="checkCooperationStage(cooperationText)"
        />
        <van-field
          v-if="isSuccess"
          v-model="cjcp"
          placeholder="请输入成交产品"
          label="成交产品"
          input-align="right"
        />
        <van-field
          v-if="isSuccess"
          v-model="formData.contractAmount"
          placeholder="请输入合同金额"
          label="合同金额"
          input-align="right"
          type="number"
        />
        <van-field
          v-model="formData.jobContent"
          rows="3"
          autosize
          label="具体工作内容"
          label-width="100%"
          type="textarea"
          placeholder="请输入"
          class="flex-col"
          :rules="[{ required: true, message: '请填写工作内容' }]"
          required
        />
        <van-cell
          title="拜访文件/照片"
          label="png、jpg、jpeg及pdf格式"
          label-class="labelClass"
          title-style="width:145px"
        >
          <van-uploader
            v-model="fileList"
            :after-read="upload"
            :before-delete="delImg"
            multiple
            :max-count="5"
          />
        </van-cell>
        <van-field
          v-model="formData.gpsLocation"
          center
          clearable
          label="打卡定位"
          readonly
          input-align="right"
          :error="formData.gpsLocation"
          required
          :rules="[{ required: true, message: '请填写定位' }]"
        >
          <template #button>
            <van-button size="small" type="primary" @click="getGps($event)"
              >定位</van-button
            >
          </template>
        </van-field>

        <!-- 时间线判断start -->
        <div style="margin: 0.4rem; font-weight: 900">
          <h2 style="">填报时间线</h2>
        </div>
        <van-steps
          v-if="dateArr[0]"
          direction="vertical"
          :active="dateArr.length"
        >
          <!-- finish-icon="setting-o" -->
          <van-step v-for="(item, index) in dateArr" :key="index">
            <div v-if="index !== dateArr.length - 1">
              <h3 style="color: #1c7afe; font-weight: 600">
                {{ item.modifyDate }}
              </h3>
              <p
                v-if="
                  index !== dateArr.length - 1 &&
                  item.companyName !== dateArr[index + 1].companyName
                "
                style="font-size: 14px"
              >
                单位/企业名称:{{ item.companyName }}
                <span v-if="index !== dateArr.length - 1" style="color: #999"
                  >（原:{{ dateArr[index + 1].companyName }}）</span
                >
              </p>
              <p
                v-if="
                  index !== dateArr.length - 1 &&
                  item.projectName !== dateArr[index + 1].projectName
                "
                style="font-size: 14px"
              >
                项目名称:{{ item.projectName }}
                <span v-if="index !== dateArr.length - 1" style="color: #999"
                  >（原:{{
                    dateArr[index + 1].projectName
                      ? dateArr[index + 1].projectName
                      : '无'
                  }}）</span
                >
              </p>
              <p
                v-if="
                  index !== dateArr.length - 1 &&
                  item.projectAddress !== dateArr[index + 1].projectAddress
                "
                style="font-size: 14px"
              >
                项目地址:{{ item.projectAddress }}
                <span v-if="index !== dateArr.length - 1" style="color: #999"
                  >（原:{{
                    dateArr[index + 1].projectAddress
                      ? dateArr[index + 1].projectAddress
                      : '无'
                  }}）</span
                >
              </p>

              <div
                v-if="item.customs.length === dateArr[index + 1].customs.length"
              >
                <div v-for="(value, i) in item.customs" :key="i">
                  <p v-if="value.name !== dateArr[index + 1].customs[i].name">
                    <span style="margin-right: 5px"
                      >客户名称:{{ value.name }}</span
                    >
                    <span style="margin-right: 5px"
                      >联系方式:{{ value.phone }}</span
                    >
                    <span>职务:{{ value.job }}</span>
                  </p>
                </div>
              </div>
              <div v-else>
                <p v-for="(value, i) in item.customs" :key="i">
                  <span style="margin-right: 5px"
                    >客户名称:{{ value.name }}</span
                  >
                  <span style="margin-right: 5px"
                    >联系方式:{{ value.phone }}</span
                  >
                  <span>职务:{{ value.job }}</span>
                </p>
              </div>
              <p
                v-if="
                  index !== dateArr.length - 1 &&
                  item.formOfVisit !== dateArr[index + 1].formOfVisit
                "
                style="font-size: 14px"
              >
                拜访方式:{{ item.formOfVisit === 1 ? '上门拜访' : '电话微信' }}
                <span v-if="index !== dateArr.length - 1" style="color: #999"
                  >（原:{{
                    dateArr[index + 1].formOfVisit === 1
                      ? '上门拜访'
                      : '电话微信'
                  }}）</span
                >
              </p>
              <p
                v-if="
                  index !== dateArr.length - 1 &&
                  item.cooperationStage !== dateArr[index + 1].cooperationStage
                "
                style="font-size: 14px"
              >
                合作阶段:{{
                  hzArr?.find(o => o.code === item.cooperationStage)?.name
                }}
                <span v-if="index !== dateArr.length - 1" style="color: #999"
                  >（原:{{
                    hzArr?.find(
                      o => o.code === dateArr[index + 1].cooperationStage
                    )?.name || '无'
                  }}）</span
                >
              </p>
              <p
                v-if="
                  index !== dateArr.length - 1 &&
                  item.contractAmount !== dateArr[index + 1].contractAmount
                "
                style="font-size: 14px"
              >
                合同金额:{{ item.contractAmount }}
                <span v-if="index !== dateArr.length - 1" style="color: #999"
                  >（原:{{ dateArr[index + 1].contractAmount ?? 0 }}）</span
                >
              </p>
              <p
                v-if="
                  index !== dateArr.length - 1 &&
                  item.jobContent !== dateArr[index + 1].jobContent
                "
                style="font-size: 14px"
              >
                工作内容:{{ item.jobContent }}
                <span v-if="index !== dateArr.length - 1" style="color: #999"
                  >（原:{{ dateArr[index + 1].jobContent }}）</span
                >
              </p>
              <div v-if="item.files.length === dateArr[index + 1].files.length">
                <div v-for="(val, i) in item.files" :key="i">
                  <p
                    v-if="val.fileId !== dateArr[index + 1].files[i].fileId"
                    style="display: flex"
                  >
                    拜访照片:
                    <span>
                      <van-image
                        height="2rem"
                        width="2rem"
                        :src="getImageUrlById(val.fileId)"
                        fit="cover"
                        style="margin-right: 5px"
                        @click="showPopup(val.fileId)"
                      />
                    </span>
                  </p>
                </div>
              </div>
              <div v-else>
                <p style="display: flex">
                  拜访照片:
                  <span>
                    <van-image
                      v-for="(val, i) in item.files"
                      :key="i"
                      height="2rem"
                      width="2rem"
                      :src="getImageUrlById(val.fileId)"
                      fit="cover"
                      style="margin-right: 5px"
                      @click="showPopup(val.fileId)"
                    />
                  </span>
                </p>
              </div>
            </div>
            <div v-else>
              <h3 style="color: #1c7afe; font-weight: 600">
                {{ item.modifyDate }}
              </h3>
              <p style="font-size: 14px">
                单位/企业名称:{{ item.companyName ?? '无' }}
              </p>
              <p v-if="item.projectName" style="font-size: 14px">
                项目名称:{{ item.projectName ? item.projectName : '无' }}
              </p>
              <p v-if="item.projectAddress" style="font-size: 14px">
                项目地址:{{ item.projectAddress ? item.projectAddress : '无' }}
              </p>

              <div v-for="(value, i) in item.customs" :key="i">
                <p>
                  <span style="margin-right: 5px"
                    >客户名称:{{ value.name }}</span
                  >
                  <span style="margin-right: 5px"
                    >联系方式:{{ value.phone }}</span
                  >
                  <span>职务:{{ value.job }}</span>
                </p>
              </div>

              <p style="font-size: 14px">
                拜访方式:{{ item.formOfVisit === 1 ? '上门拜访' : '电话微信' }}
              </p>
              <p style="font-size: 14px">
                合作阶段:{{
                  hzArr?.find(o => o.code === item.cooperationStage)?.name
                }}
              </p>
              <p v-if="item.contractAmount" style="font-size: 14px">
                合同金额:{{ item.contractAmount }}
              </p>
              <p v-if="item.jobContent" style="font-size: 14px">
                工作内容:{{ item.jobContent }}
              </p>
              <p style="display: flex">
                拜访照片:
                <span>
                  <van-image
                    v-for="(val, i) in item.files"
                    :key="i"
                    height="2rem"
                    width="2rem"
                    :src="getImageUrlById(val.fileId)"
                    fit="cover"
                    style="margin-right: 5px"
                    @click="showPopup(val.fileId)"
                  />
                </span>
              </p>
            </div>
          </van-step>
        </van-steps>
        <p v-else style="text-align: center">暂无记录</p>
        <!-- 时间线判断end -->

        <div v-if="isSelf" style="margin: 16px">
          <van-button class="submitButton" type="info" native-type="submit"
            >再次提交</van-button
          >
        </div>
      </van-form>
    </van-cell-group>

    <!-- 选择器 -->
    <van-popup v-model:show="dateshow">
      <van-datetime-picker
        v-model="dates"
        type="datetime"
        title="拜访时间"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="dStart"
        @cancel="dateshow = false"
      />
    </van-popup>
    <van-popup v-model:show="select">
      <van-picker
        title="标题"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="select = false"
      />
    </van-popup>
    <van-popup v-model:show="show" style="width: 100%; background: none">
      <van-image
        height="100%"
        width="100%"
        :src="getImageUrlById(fileId)"
        fit="cover"
      />
    </van-popup>
  </div>
  <div v-if="nameList" class="nameList">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了">
      <van-cell
        v-for="item in list"
        :key="item"
        :title="item.name"
        @click="checkProject(item)"
      />
    </van-list>
  </div>
  <div v-if="companyNameList" class="nameList" :class="comName">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了">
      <van-cell
        v-for="item in companyList"
        :key="item"
        :title="item.name"
        @click="checkCompany(item)"
      />
    </van-list>
  </div>
  <div class="wrapper" :class="{ hide: !showMap }">
    <baidu-map
      :ak="AK"
      :center="addressObj.location"
      :zoom="20"
      class="map-view"
      @ready="handler"
    >
      <bm-marker
        :position="addressObj.location"
        animation="BMAP_ANIMATION_BOUNCE"
      >
        <bm-label :content="addressObj.address" />
      </bm-marker>
    </baidu-map>
    <van-button type="primary" class="button-cancel" @click="showMap = false">
      关闭
    </van-button>
  </div>
</template>

<script>
import { getDictByCategory } from '@/api/dict'
import { getImageUrlById } from '@/utils/getFileUrl'
import { useAuthStore } from '@/store/index'
import { uploadFiles } from '@/api/file'
import { defineComponent } from 'vue'
import BMapLib from '@/utils/BMapLib'
import { Dialog, Notify } from 'vant'
import { getCurrentPosition } from '@/utils/map'
import { BaiduMap, BmMarker, BmLabel } from 'vue-baidu-map-3x'
import { AK } from '@/global/baidu-map/index'
import { onBeforeMount, ref, watch } from 'vue'
const auth = useAuthStore()
const account = auth.account
export default {
  name: 'Updata',
  components: { BaiduMap, BmMarker },
  data() {
    return {
      // 是否为本人
      isSelf: false,

      // 拜访照片弹窗
      show: false,
      fileId: null,

      // 时间线配置
      dateArr: [],
      isChange: false,

      AK,
      // 选择框弹窗
      dateshow: false,
      select: false,
      nameList: false,
      companyNameList: false,
      comName: null,
      cjcp: null,
      mapKeyword: null,
      isReadyonly: true,

      // 单位/项目
      isProject: false,
      isSuccess: false,
      errMsg: null,
      // 地图
      showMap: false,
      map: {
        BMap: {},
        map: {},
        BMapLib: {}
      },

      // 填报内容
      formData: {
        username: account.name,
        visitDate: null,
        formOfVisit: '1',
        customerType: '1',
        projectName: null,
        projectAddress: null,
        companyName: null,
        customs: [],
        cooperationStage: null,
        productList: [],
        contractAmount: null,
        jobContent: null,
        openId: null,
        creditCode: null,
        projectId: null,
        gpsLocation: null,
        latitude: null,
        longitude: null,
        city: null,
        district: null,
        province: null,
        companyCertification: null,
        parentId: null,
        files: []
      },

      addressObj: {
        address: '',
        location: {
          lat: 104.715575, // 纬度
          lng: 28.44432 // 经度
        }
      },

      obj: {},

      // 日期选择范围
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2035, 10, 1),
      dates: new Date(),

      // 选择器内容
      columns: [],
      // 合作阶段字典表
      cooperationDit: [],
      cooperationText: null,
      // 合作阶段arr
      hzArr: [],

      fileList: [],
      fileListOld: [],
      list: [],
      companyList: [],
      loading: false,
      finished: false,
      isSubmit: false,

      // 联系人
      personArr: [
        {
          name: null,
          phone: null,
          type: '1',
          job: null
        }
      ]
    }
  },
  computed: {
    // account: () => auth.account
  },
  activated() {
    this.fileList = []
    this.formData.companyCertification = false
    // 获取合作阶段字典表
    getDictByCategory('crm_cooperation_stage').then(({ code, data }) => {
      if (code === 0) {
        this.columns = []
        this.hzArr = data
        data.forEach(item => {
          this.columns.push(item.name)
          this.cooperationDit.push(item.code)
        })
      }
    })

    // 获取数据
    this.getData(this.$route.params)
    // 获取时间线
    this.getDate(this.$route.params)
    this.getGps()
  },
  methods: {
    getImageUrlById,

    // 添加联系人
    addNum() {
      this.personArr.push({
        type: this.formData.customerType,
        name: null,
        phone: null,
        job: null
      })
    },
    // 删除联系人
    del(val) {
      this.personArr.splice(val, 1)
    },

    showPopup(val) {
      this.fileId = val
      console.log(123)
      this.show = true
    },

    // 获取formData
    getData(val) {
      this.$http
        .get('/center-business/k/q/business/crm/daily/filling/record/id', {
          params: {
            id: val.id
          }
        })
        .then(({ code, data }) => {
          if (code === 0) {
            let file = []
            if (data.files) {
              data.files.forEach(item => {
                file.push(item.fileId)
                this.fileList.push({
                  url: getImageUrlById(item.fileId),
                  isImage: true
                })
              })
            }
            if (data.creditCode) {
              this.errMsg = null
            } else {
              this.errMsg = '该企业未通过验证'
            }
            this.personArr = data.customs
            console.log(data.openId)
            //判断是否为本人登录
            if (data.openId === account.openId) {
              this.isSelf = true
            } else {
              this.isSelf = false
            }
            Object.keys(this.formData).forEach(item => {
              this.formData[item] = data[item]
              this.formData.formOfVisit += ''
              this.formData.customerType = data.customs[0].type + ''
              this.formData.files = file
              this.formData.visitDate = this.$moment(new Date()).format(
                'YYYY-MM-DD HH:mm:ss'
              )
              // 是否有成交产品
              data.productList
                ? (this.formData.productList = data.productList)
                : (this.formData.productList = [])
              // 是否为合同签订阶段
              data.cooperationStage === 'contract_signing'
                ? (this.isSuccess = true)
                : (this.isSuccess = false)
              // 合作阶段
              this.hzArr.forEach(val => {
                data.cooperationStage === val.code
                  ? (this.cooperationText = val.name)
                  : ''
              })
            })
          }
        })
    },
    // 获取时间线
    getDate(val) {
      this.$http
        .get(
          `/center-business/k/q/business/crm/daily/filling/record/timeLine/${val.id}`
        )
        .then(({ code, data }) => {
          if (code === 0) {
            if (data) this.dateArr = data
          }
        })
    },

    // 日期选择确认
    dStart(val) {
      this.dateshow = false
      this.formData.visitDate = this.$moment(val).format('YYYY-MM-DD HH:mm:ss')
    },
    // 合作阶段
    onConfirm(value, index) {
      this.select = false
      this.cooperationText = value
      this.formData.cooperationStage = this.cooperationDit[index]
      if (value === '合同签订') this.isSuccess = true
      else {
        ;(this.cjcp = null), (this.formData.contractAmount = null)
        this.isSuccess = false
      }
      // if (value === '其他' || '请输入'.indexOf(value) === 0) {
      //   this.isReadyonly = false
      //   this.select = false
      //   this.cooperationText = '请输入'
      // }
    },
    checkCooperationStage(val) {
      this.select = true
      // if (val === '其他' || val === '请输入') {
      //   this.select = false
      //   this.isReadyonly = false
      // } else {
      //   this.select = true
      // }
    },
    // 单位/项目
    checkcustomerType(name) {
      this.companyNameList = false
      this.errMsg = null
      if (name === '2') {
        // this.formData.companyName = null
        // this.formData.creditCode = null
        this.isProject = true
        this.comName = 'comName'
      } else {
        // this.formData.projectName = null
        // this.formData.projectAddress = null
        this.isProject = false
        this.comName = null
      }
    },
    checkFormOfVisit(name) {},
    // 表单初始化
    init() {
      Object.keys(this.formData).forEach(item => {
        this.formData[item] = null
        this.formData.productList = []
        this.formData.customs = []
        this.formData.files = []
        this.formData.username = account.name
        this.formData.formOfVisit = '1'
        this.formData.customerType = '1'
      })
      this.fileList = []
    },
    // 验证项目名
    verify() {
      this.formData.projectId = null
      this.formData.projectAddress = null
      console.log(this.formData.projectName)
      setTimeout(() => {
        this.$http
          .get('/center-business/k/q/business/project/info/list/byName', {
            params: {
              name: this.formData.projectName,
              limit: 10
            }
          })
          .then(({ code, data }) => {
            if (code === 0) {
              if (data[0]) {
                this.list = data
                this.finished = data.length < 10
                this.nameList = true
              } else {
                this.nameList = false
              }
            }
          })
      }, 1000)
      if (this.formData.projectName === '') {
        this.nameList = false
      }
    },
    // 验证企业名称
    getCompanyName() {
      setTimeout(() => {
        this.errMsg = '该企业未通过验证'
        this.formData.companyCertification = false
        this.formData.creditCode = null
        this.$http
          .get('/center-business/k/q/business/corp/info/like', {
            params: {
              companyName: this.formData.companyName
            }
          })
          .then(({ code, data, message }) => {
            if (code === 0) {
              if (data[0]) {
                this.companyList = data
                this.finished = data.length < 10
                this.companyNameList = true
              } else {
                this.companyNameList = false
              }
            }
          })
      }, 1000)
    },
    // 单位/企业名称选择
    checkCompany(val) {
      this.formData.companyName = val.name
      this.formData.creditCode = val.code
      this.formData.companyCertification = true
      this.companyNameList = false
      this.errMsg = null
    },
    // 项目名称选择
    checkProject(val) {
      this.formData.projectName = val.name
      this.formData.projectId = val.nodeProjectId
      this.formData.projectAddress = val.address
      this.nameList = false
    },
    // 关闭选择弹框
    close() {
      setTimeout(() => {
        this.companyNameList = false
        this.nameList = false
      }, 500)
    },
    submit() {
      this.formData.productList = []
      this.personArr.forEach(item => {
        item.type = this.formData.customerType
      })
      this.formData.customs = this.personArr
      this.formData.openId = account.openId
      // this.formData.openId = 'o7q4m6DQBmkbhwFha_ObNGBX5Rwg'
      this.formData.parentId = this.$route.params.id
      if (this.cjcp) {
        this.formData.productList.push(this.cjcp)
      } else {
        this.formData.productList = []
      }
      this.$http
        .post(
          '/center-business/k/q/business/crm/daily/filling/record',
          this.formData
        )
        .then(({ code, message }) => {
          if (code === 0) {
            Notify({
              type: 'success',
              message: '填报完成'
            })
            this.init()
            this.$router.go(-1)
          } else {
            Notify({
              type: 'danger',
              message
            })
          }
        })
    },
    // 文件上传
    upload({ file }) {
      let imgId = null
      const formData = new FormData()
      formData.append('files', file)
      uploadFiles('wx_dailyfill_image', formData)
        .then(({ code, data }) => {
          if (code !== 4002) throw Error('图片上传失败')
          imgId = data[0]
          this.formData.files.push(imgId)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 删除图片前的回调，可以返回Promise
    delImg(file, detail) {
      return new Promise((resolve, reject) => {
        Dialog.confirm({
          title: '标题',
          message: '确认删除图片？'
        })
          .then(() => {
            // 存放图片的数组
            this.fileList.splice(detail.index, 1)
            this.formData.files.splice(detail.index, 1)
            resolve()
          })
          .catch(error => {
            Dialog.alert({
              title: '标题',
              message: '已取消'
            })
            reject(error)
          })
      })
    },
    // 获取考勤定位
    getGps(e) {
      getCurrentPosition().then(res => {
        console.log(res)
        // this.showMap = true
        // 设置坐标
        this.addressObj.location.lat = res.point.lat
        this.addressObj.location.lng = res.point.lng
        // 设置地址
        this.addressObj.address = res.address

        this.formData.latitude = res.point.lat
        this.formData.longitude = res.point.lng
        this.formData.gpsLocation = res.address
        this.formData.city = res.addressComponents.city
        this.formData.district = res.addressComponents.district
        this.formData.province = res.addressComponents.province
      })
    },
    handler({ BMap, map }) {
      this.map.BMap = BMap
      this.map.map = map
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/theme';
:deep(.van-cell-group__title) {
  background: #1c7afe;
  color: #fff;
  font-weight: 900;
  text-align: center;
}
:deep(.van-cell__title) {
  // flex: none;
  box-sizing: border-box;
  width: var(--van-field-label-width);
  margin-right: var(--van-field-label-margin-right);
  color: var(--van-field-label-color);
  text-align: left;
  word-wrap: break-word;
}
:deep(.van-radio-group--horizontal) {
  justify-content: flex-end;
}
:deep(.van-popup--center) {
  width: 90%;
}
:deep(.van-cell--required)::before {
  position: initial;
}
:deep(.van-button--small) {
  border-radius: 0.15rem;
}
:deep(.van-hairline--top-bottom) {
  position: initial;
}
:deep(.van-cell__value) {
  flex: 2;
}
.conTitle {
  background: #e6e6e6;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0.5rem;
  .btnBox {
    display: flex;
    align-items: center;
  }
}

.submitButton {
  width: 60%;
  height: 48px;
  background: #1c7afe;
  color: #fff;
  font-size: 21px;
  font-weight: 900;
  margin: 32px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
}
.nameList {
  background: #fff;
  width: 9rem;
  max-height: 40%;
  overflow-y: auto;
  position: absolute;
  top: 7.8rem;
  box-shadow: 3px 5px 16px 0px;
  right: 20px;
}

.comName {
  top: 10.5rem;
}

.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all ease-in 200ms;
  &.hide {
    transform: translateY(100%);
  }
  .map-view {
    width: 100%;
    height: 100%;
  }
  .button-cancel {
    position: absolute;
    left: 50%;
    bottom: 0.57rem;
    padding: 0 0.72rem;
    transform: translateX(-50%);
    border-radius: 0.12rem;
    height: 0.9rem;
    line-height: 0.9rem;
    font-size: 0.42rem;
  }
}
</style>
