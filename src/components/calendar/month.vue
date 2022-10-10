<template>
  <div class="calendar-month-wrapper flex justify-center items-center">
    <div class="left flex justify-center items-center" @click="setMonthDiff(-1)">
      <van-icon name="arrow-left" />
    </div>
    <div class="month">
      <span>{{ dayjs(props.modelValue).format('YYYY-MM') }}</span>
    </div>
    <div class="right flex justify-center items-center" @click="setMonthDiff(1)">
      <van-icon name="arrow" />
    </div>
  </div>
</template>

<script setup lang="ts" name="calendar-month">
import dayjs from 'dayjs'
const props = defineProps({
  modelValue: {
    type: Date,
    default: new Date()
  }
})

const emits = defineEmits(['update:modelValue'])

/**
 *
 * @param diff 月份差
 */
function setMonthDiff(diff: number) {
  const date = new Date(props.modelValue)
  date.setMonth(date.getMonth() + diff)
  emits('update:modelValue', date)
}
</script>

<style lang="scss" scoped>
.calendar-month-wrapper {
  height: 0.96rem;
  .left,
  .right {
    width: 0.96rem;
    height: 100%;
  }
  .month {
    position: relative;
    margin: 0 1.74rem;
  }
}
</style>
