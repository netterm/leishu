<template>
  <div class="page-wrapper flex flex-col bg-gray-3">
    <header class="flex  items-center bg-white">
      <div class="left flex flex-auto w-0 items-center">
        <van-image
          :src="projectPNG"
          width="0.42rem"
          height="0.45rem"
          fit="contain"
          class=""
        >
        </van-image>
        <h2 class="text-lg flex-auto w-0 van-ellipsis">
          {{ auth.project.name }}
        </h2>
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

    <article class="flex-auto h-0 overflow-auto">
      <section
        class="statistics bg-white text-center"
        :style="{ padding: '0.18rem 0' }"
      >
        <div>{{ props.month?.replace(/-/, '年') }}月考勤汇总</div>
        <h2 :style="{ margin: '0.24rem 0' }">{{ times }}</h2>
        <div>
          <b>考勤次数（次）</b>
        </div>
      </section>

      <div class="date-wrapper bg-white" :style="{ margin: '0.6rem 0' }">
        <calendar-date
          v-model="date"
          @month="
            $router.replace({
              name: 'attendance-month-details',
              query: { month: dayjs($event).format('YYYY-MM') }
            })
          "
        >
          <template #label="{ col }">
            <div class="date-col-wrapper">
              <span>
                {{ col.date }}
              </span>
              <div
                v-for="o in [getAttStatusByDate(col.Date)]"
                v-show="o"
                :key="o"
                class="date"
                :class="{ att: o === 2, 'att-all': o === 3 }"
              />
            </div>
          </template>
        </calendar-date>
        <div
          class="tips-wrapper flex justify-center items-center"
          :style="{ paddingBottom: '0.6rem' }"
        >
          <div class="flex items-center">
            <div class="date" />
            <span class="t-size-small">&nbsp;无考勤</span>
          </div>
          <div class="flex items-center" :style="{ margin: '0 0.36rem' }">
            <div class="date att" />
            <span class="t-size-small">&nbsp;缺勤</span>
          </div>
          <div class="flex items-center">
            <div class="date att-all" />
            <span class="t-size-small">&nbsp;全勤</span>
          </div>
        </div>
      </div>

      <section class="records-wrapper bg-white">
        <h2 class="text-center" :style="{ paddingBottom: '0.48rem' }">
          {{ date?.toLocaleDateString() }}
        </h2>
        <div v-if="dayRecords.length">
          <section
            v-if="!dayRecords.find(o => o.type == 2) && !isTodayAndAfter"
            class="record"
          >
            <div class="flex justify-between">
              <b>退场考勤</b>
              <van-button plain type="danger" size="small">缺勤</van-button>
            </div>
          </section>
          <section
            v-for="item in dayRecords"
            :key="item.attTime"
            class="record"
          >
            <div class="flex items-center">
              <div
                class="left flex-auto w-0"
                :style="{ marginRight: '0.48rem' }"
              >
                <div>
                  <b>
                    {{ { 1: '进场', 2: '退场' }[item.type] }}时间
                    {{ item.attTime.replace(/^.*?\s/, '') }}
                  </b>
                </div>
                <div>
                  <van-icon name="friends" class="text-gray-8" />
                  {{ item.attWay }}
                </div>
                <div>
                  <van-icon name="location" class="text-gray-8" />
                  {{ item.recordAddress }}
                </div>
              </div>
              <van-button
                v-if="item.type === 1"
                plain
                type="success"
                size="small"
                class=""
              >
                进场打卡
              </van-button>
              <van-button
                v-if="item.type === 2"
                plain
                type="warning"
                size="small"
                class=""
              >
                退场打卡
              </van-button>
            </div>
          </section>
          <section
            v-if="!dayRecords.find(o => o.type == 1) && !isTodayAndAfter"
            class="record"
          >
            <div class="flex justify-between">
              <b>进场考勤</b>
              <van-button plain type="danger" size="small">缺勤</van-button>
            </div>
          </section>
        </div>
        <div v-else class="text-center">当天无考勤信息</div>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts" name="attendance-details">
import debounce from 'lodash.debounce'
import { computed, onActivated, reactive, ref, watch } from 'vue'
import projectPNG from '@/assets/images/project.png'
import { CalendarDate } from '@/components/calendar/index'
import { getAttendanceDetails } from '@/api/home'
import { useAuthStore } from '@/store/index'
import dayjs from 'dayjs'

const auth = useAuthStore() // 权限状态管理器

const props = defineProps({
  month: String,
  personId: String
})

// 声明考勤类型
type AttType = {
  id: string // 表id
  attTime: string // 年月日
  attWay: string // 考勤方式
  type: 1 | 2 //  进退场 1-进场 2-退场
  recordAddress: string // 考勤地点
}

let date = ref<Date>() // 日期
if (props.month) {
  // 根据月份获取日期,当月则获取今天,其他月则获取最后一天
  const dd = dayjs(props.month).toDate()
  if (props.month === dayjs().format('YYYY-MM')) {
    date.value = dayjs(dayjs().format('YYYY/MM/DD')).toDate()
  } else date.value = new Date(dd.getFullYear(), dd.getMonth() + 1, 0)
}

const times = ref(0) // 考勤次数
const records = reactive<AttType[]>([]) // 考勤信息列表

// 单天考勤记录
const dayRecords = computed(() =>
  records.filter(
    o =>
      dayjs(o.attTime).format('YYYY-MM-DD') ==
      dayjs(date.value).format('YYYY-MM-DD')
  )
)

// 选中日期是否大于等于当天
const isTodayAndAfter = computed(() => {
  let result =
    dayjs(date.value).toDate().getTime() >=
    dayjs(new Date().toLocaleString().replace(/\s.*$/, '00:00:00'))
      .toDate()
      .getTime()

  return result
})

// 获取考勤信息
function getAttendanceRecords() {
  return getAttendanceDetails({
    page: 1,
    size: 10000,
    month: props.month,
    projectId: auth.project.id,
    personId: props.personId
  }).then(
    (res: HTTPResponseInterface<{ records: AttType[]; total: number }>) => {
      const { code, data, message } = res
      if (code !== 0) throw Error('获取考勤异常: ' + message)
      times.value = data?.total ?? 0
      data.records.forEach(att => {
        if (records.find(o => o.attTime === att.attTime)) return
        records.push(att)
      })
    }
  )
}

// 根据日期获取考勤状态
function getAttStatusByDate(dd: Date) {
  if (dd.getTime() > new Date().getTime()) return 0 // 传入日期大于当前天
  let hadIn = false
  let hadOut = false
  let atts = records.filter(
    o => o.attTime.replace(/\s.*$/, '') === dayjs(dd).format('YYYY-MM-DD')
  )
  atts.forEach(att => {
    if (att.type == 1) hadIn = true
    if (att.type == 2) hadOut = true
  })
  if (hadIn && hadOut) return 3
  if (hadIn || hadOut) return 2
  return 1
}

watch(() => props.month, debounce(getAttendanceRecords, 600)) // 监听月份变化获取考勤
onActivated(() => {
  records.splice(0) // 清空考勤信息
  getAttendanceRecords() // 重新获取考勤
})
</script>

<style lang="scss" scoped>
.page-wrapper {
  height: 100%;
  box-sizing: border-box;
  header {
    margin-bottom: 0.36rem;
    padding: 0.27rem 0.36rem;
    h2 {
      margin: 0 0.48rem;
    }
  }
  .tips-wrapper,
  .date-col-wrapper {
    .date {
      height: 0.18rem;
      width: 0.18rem;
      border-radius: 50%;
      background-color: var(--van-gray-6);
    }
    .att {
      background-color: var(--van-orange);
    }
    .att-all {
      background-color: var(--van-blue);
    }
  }
  .date-col-wrapper {
    position: relative;
    .date {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translate(-50%, 100%);
    }
  }
  .records-wrapper {
    padding: 0.48rem 0.84rem;
    .record {
      position: relative;
      &:last-of-type {
        &::before {
          content: none;
        }
      }
      &::before {
        content: '';
        position: absolute;
        margin-right: 0.63rem;
        top: 0.12rem;
        bottom: -0.12rem;
        width: 1px;
        background-color: var(--van-gray-8);
      }
      &::after {
        content: '';
        position: absolute;
        top: 0.12rem;
        left: 0;
        margin-left: -0.135rem;
        width: 0.3rem;
        height: 0.3rem;
        border-radius: 50%;
        background-color: var(--van-gray-8);
      }
      & > div {
        margin-left: 0.63rem;
        padding-bottom: 0.9rem;
      }
      .left {
        & > div + div {
          margin-top: 0.18rem;
        }
      }
    }
  }
}
</style>
