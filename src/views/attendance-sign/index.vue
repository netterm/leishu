<template>
  <div class="page-container bg-gray-3 flex flex-col">
    <header class="flex items-center bg-white rounded-sm">
      <div class="left flex flex-auto w-0 items-center">
        <van-image
          height="1.5rem"
          width="1.5rem"
          :src="getImageUrlById(auth.account.headImgUrl)"
          fit="cover"
          class=""
        />
        <div class="flex-auto w-0" :style="{ margin: '0 0.42rem' }">
          <h3 class="text-lg">{{ auth.account.nickname }}</h3>
          <div class="text-sm van-ellipsis" :style="{ marginTop: '0.24rem' }">
            {{ auth.project.name }}
          </div>
        </div>
      </div>
      <div class="right">
        <router-link
          replace
          :to="{ name: 'project-switch', query: { link: $route.fullPath } }"
        >
          <van-button type="primary" size="small">切换项目</van-button>
        </router-link>
      </div>
    </header>
    <article
      class="flex flex-col flex-auto h-0 bg-white rounded-sm"
      :style="{ padding: '0.66rem 0.54rem' }"
    >
      <div class="tab-wrapper flex">
        <div
          :class="{ active: type === 1 }"
          class="tab in flex-auto bg-gray-3 rounded-sm whitespace-nowrap"
          @click="type = 1"
        >
          <h2 class="text-lg">进场时间</h2>
          <div v-if="records.filter(o => o.type == 1).length">
            <van-icon name="checked" class="icon primary" />
            <span class="time">
              {{
                records.filter(o => o.type == 1)[0].time.replace(/^.*?\s/, '')
              }}
            </span>
            <span>已打卡</span>
          </div>
          <div v-else>未打卡</div>
        </div>
        <div
          :class="{ active: type === 2 }"
          class="tab out flex-auto bg-gray-3 rounded-sm whitespace-nowrap"
          :style="{ marginLeft: '0.63rem' }"
          @click="type = 2"
        >
          <h2 class="text-lg">出场时间</h2>
          <div v-if="records.filter(o => o.type == 2).length">
            <van-icon name="checked" class="icon primary" />
            <span class="time">
              {{
                records.filter(o => o.type == 2)[0].time.replace(/^.*?\s/, '')
              }}
            </span>
            <span>已打卡</span>
          </div>
          <div v-else>未打卡</div>
        </div>
      </div>
      <div
        class="sign-wrapper flex flex-col flex-auto h-0 justify-center items-center"
      >
        <div
          :class="{ error: !allowSign }"
          class="button-sign flex flex-col justify-center items-center text-white"
          @click="allowSign && upload.click()"
        >
          <h1 v-if="allowSign">{{ { 1: '进场', 2: '出场' }[type] }}打卡</h1>
          <h1 v-else>无法打卡</h1>
          <div :style="{ marginTop: '0.33rem' }">
            {{ timer.toLocaleTimeString() }}
          </div>
        </div>
        <div class="tips" :style="{ marginTop: '0.87rem' }">
          <span v-if="allowSign">
            <van-icon name="checked" class="text-green" />
            <span>已进入考勤范围</span>
          </span>
          <span v-else-if="notAttFence">
            <van-icon name="warning" class="text-orange" />
            <span>该项目未设置电子围栏，请进行设置</span>
          </span>
          <span v-else>
            <van-icon name="warning" class="text-orange" />
            <span>未在考勤范围，查看</span>
            <a class="text-blue" @click.prevent="showMap = true">考勤范围</a>
          </span>
        </div>
      </div>
      <div class="to-att-record text-center primary">
        <van-icon name="bar-chart-o" />
        <!-- <router-link :to="{ name: 'attendance-month' }">
          查看打卡记录
        </router-link> -->
      </div>
    </article>
    <map-view
      v-model:visible="showMap"
      :location="location"
      :regions="regions"
      :address="address"
      @ready="onMapReady"
    />
    <input
      v-show="false"
      ref="upload"
      type="file"
      capture="user"
      accept="image/*"
      @change="sign"
    />
  </div>
</template>

<script setup lang="ts" name="attendance-sign">
import { useAuthStore } from '@/store/index'
import {
  getTimerHook,
  onSwitchProjectHook,
  setIntervalHook
} from '@/composition-api/index'
import { getImageUrlById } from '@/utils/getFileUrl'
import { reactive, ref } from 'vue'
import { getNodeDomain } from '@/api/home'
import { Dialog, Toast } from 'vant'
import {
  createAttendance,
  getAttendance,
  getAttendanceFence
} from '@/api/attendance-asign'
import dayjs from 'dayjs'
import MapView from './map.vue'
import BMapLib from '@/utils/BMapLib'
import { getCurrentPosition } from '@/utils/map'

type AttType = { time: string; type: number }

const auth = useAuthStore() // 权限状态管理器
const origin = ref('') // 服务节点源
const timer = getTimerHook() // 动态日期
const notAttFence = ref(false) // 项目是否未设置打卡区域
const allowSign = ref(false) // 是否允许打卡
const regions = ref([]) // 打卡区域坐标系
const address = ref('未定位') // 打卡地址
const records = ref<AttType[]>([]) // 考勤记录
const type = ref(1) // 打卡类型 1进场 2出场
const upload = ref() // 文件上传vm对象
// 定位
const location = reactive({
  lng: 0,
  lat: 0
})
const showMap = ref(false) // 显示地图

// 监听项目切换动作
onSwitchProjectHook(() => {
  getAttendanceInfo() //重新获取考勤信息
  // 验证是否在考勤围栏内
  allowSign.value = false
  isAllowSign()
})
setIntervalHook(isAllowSign, 5000, true)

/**
 * 地图初始化完成
 */
let map = {
  BMap: {},
  map: {},
  BMapLib: {}
}
function onMapReady(e: Record<string, object>) {
  map.BMap = e.BMap
  map.map = e.map
  map.BMapLib = BMapLib(e.BMap)
  getAttendanceInfo() // 地图初始化完成获取一次考勤信息
}

/**
 * 获取定位并计算是否在考勤围栏内(可打卡)
 */
function isAllowSign() {
  getCurrentPosition().then(res => {
    // 设置坐标
    location.lat = res.point.lat
    location.lng = res.point.lng

    // 设置地址
    address.value = res.address

    // 判断当前定位是否在考勤区域内
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentPoint = new (map.BMap as any).Point(location.lng, location.lat)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allowSign.value = regions.value.some((region: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (map.BMapLib as any).GeoUtils.isPointInPolygon(
        currentPoint,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (map.BMap as any).Polygon(
          region.map(
            ({ lng, lat }: { lng: number; lat: number }) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              new (map.BMap as any).Point(lng, lat)
          )
        )
      )
    })
  })
}

/**
 * 获取考勤信息
 */
function getAttendanceInfo() {
  regions.value = []
  records.value = []

  // 获取节点服务器域名
  getNodeDomain({ projectId: auth.project.id })
    .then(({ code, data }: HTTPResponseInterface<string>) => {
      if (code !== 0) {
        throw Error(
          '获取服务器域名信息异常: /center-wechat/k/q/index/node/domain'
        )
      }

      origin.value = data

      // 获取考勤记录
      return getAttendanceRecords()
    })
    .then(() => getAttendanceFence({ projectId: auth.project.id })) // 获取考勤围栏
    .then((res: HTTPResponseInterface<{ longitudeLatitude: string }>) => {
      const { code, data, message } = res
      if (code === 5106) return (notAttFence.value = true)
      if (code !== 0) throw Error('获取考勤围栏异常: ' + message)
      if (data?.longitudeLatitude) {
        // 获取围栏区域
        regions.value = JSON.parse(data.longitudeLatitude)
      }
    })
    .catch((err: Error) => {
      Dialog.alert({
        title: '异常',
        message: err.message ?? err
      })
    })
}

/**
 * 获取考勤记录
 */
function getAttendanceRecords() {
  return getAttendance({
    projectId: auth.project.id,
    date: dayjs().format('YYYY-MM-DD')
  }).then((res: HTTPResponseInterface<Array<AttType>>) => {
    const { code, data, message } = res
    if (code !== 0) throw Error('获取考勤记录异常: ' + message)
    records.value = data
  })
}

// 打卡
function sign(e: Event) {
  // 封装文件
  const formData = new FormData()
  const target = e.target as HTMLInputElement
  ;[].forEach.call(target.files, (file: File) => {
    formData.append('photo', file)
  })

  // 开启加载动画
  const toast = Toast.loading({
    message: '打卡中...',
    forbidClick: true
  })

  // 创建考勤
  createAttendance(
    {
      address: address.value,
      projectId: auth.project.id,
      projectName: auth.project.name,
      type: type.value
    },
    formData
  )
    .then(({ code, message }: HTTPResponseInterface) => {
      if (code !== 0) throw Error('创建考勤异常: ' + message)

      /**
       * 由于创建考勤接口后台存储图片没做同步处理
       * 直接获取考勤记录可能无法拉取到刚创建的考勤信息
       * 所以等待1s后再拉取考勤信息
       */
      return new Promise(resolve => {
        setTimeout(resolve, 1000)
      })
    })
    .then(getAttendanceRecords) // 再次获取考勤记录
    .finally(() => {
      target.value = '' // 清除文件
      toast.clear() // 清除加载动画
    })
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 0.33rem;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  box-sizing: border-box;
  header {
    padding: 0.3rem 0.54rem;
  }
  article {
    margin-top: 0.33rem;
    .tab-wrapper {
      .tab {
        box-sizing: border-box;
        padding: 0.18rem 0.45rem;
        transition: all linear 300ms;
        &.active {
          background-color: var(--van-blue);
          color: var(--van-white);
          .icon {
            color: var(--van-white);
          }
        }
        & > div {
          margin-top: 0.15rem;
        }
        .time {
          margin: 0 0.18rem;
        }
      }
    }
    .button-sign {
      width: 4.5rem;
      height: 4.5rem;
      background: linear-gradient(180deg, #23bbfe, #1c7afe);
      border-radius: 50%;
      &.error {
        background: linear-gradient(180deg, #fe7e7d, #fe1c1c);
      }
    }
  }
}
</style>
