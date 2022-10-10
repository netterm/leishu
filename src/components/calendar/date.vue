<template>
  <div class="table-wrapper bg-white">
    <calendar-month
      v-model="yearMonth"
      @update:model-value="emits('month', $event)"
    />
    <table>
      <thead>
        <tr>
          <td v-for="day in days" :key="day" class="text-center text-gray-6">
            <div>
              <b>{{ day }}</b>
            </div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in dates.length / 7" :key="row">
          <td
            v-for="col in dates.slice((row - 1) * 7, (row - 1) * 7 + 7)"
            :key="`${row}-${col.date}`"
            class="text-center"
            :class="{
              'text-gray-6': col.month !== month,
              active: col.Date.getTime() == props.modelValue.getTime()
            }"
            @click="
              () => {
                yearMonth = col.Date
                emits('update:modelValue', col.Date)
              }
            "
          >
            <slot :col="col">
              <div>
                <div class="flex f-v-c text">
                  <slot name="label" :col="col">
                    {{ col.date }}
                  </slot>
                </div>
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" name="calendar-date">
import CalendarMonth from './month.vue'
import { ref, computed } from 'vue'
const days = ['日', '一', '二', '三', '四', '五', '六'] // 星期

// 声明日期类型
type DateType = {
  Date: Date
  year: number
  month: number
  date: number
  day: string
}

// 传入属性
const props = defineProps({
  // 选中的日期
  modelValue: {
    type: Date,
    default: new Date()
  }
})

const emits = defineEmits(['update:modelValue', 'month']) // 声明事件

let year = ref(props.modelValue.getFullYear()) // 年份
let month = ref(props.modelValue.getMonth()) // 月份
let dates = ref<DateType[]>([]) // 日列表

// 年月-计算属性
const yearMonth = computed({
  get() {
    return new Date(year.value, month.value)
  },
  set(dd) {
    year.value = dd.getFullYear()
    month.value = dd.getMonth()
    getDates() // 获取日期列表
  }
})

getDates() // 当前页面初始化时先获取一次日期列表

// 获取当月日期列表
function getDates() {
  dates.value = [] // 清空日列表

  let firstDate = new Date(year.value, month.value, 1) // 第一天
  // 第一天不为星期天时向前遍历查询星期天的日期
  while (firstDate.getDay() !== 0) firstDate.setDate(firstDate.getDate() - 1)

  let lastDate = new Date(year.value, month.value + 1, 0) // 最后一天
  // 最后一天不为星期六向后遍历查询星期六
  while (lastDate.getDay() !== 6) lastDate.setDate(lastDate.getDate() + 1)

  // 从第一天遍历到最后一天并填充当月日列表
  while (firstDate.getTime() <= lastDate.getTime()) {
    dates.value.push({
      Date: new Date(firstDate),
      year: firstDate.getFullYear(),
      month: firstDate.getMonth(),
      date: firstDate.getDate(),
      day: days[firstDate.getDay()]
    })
    firstDate.setDate(firstDate.getDate() + 1)
  }
}
</script>

<style lang="scss" scoped>
.table-wrapper {
  padding: 0.27rem 0.51rem 0.6rem;
  table {
    width: 100%;
    border-collapse: collapse;
    td {
      & > div {
        width: 1.35rem;
        height: 1.17rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &.active {
        .text {
          background-color: var(--van-blue);
          color: var(--van-white);
          border-radius: 50%;
        }
      }
      .text {
        display: inline-block;
        width: 0.6rem;
        height: 0.6rem;
        line-height: 0.6rem;
      }
    }
  }
}
</style>
