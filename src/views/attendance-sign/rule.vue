<template>
  <div class="page-container">
    <van-collapse v-model="active">
      <van-collapse-item name="1">
        <template #title>
          <h2>考勤时间</h2>
        </template>

        <van-cell class="cell">
          <template #title>
            <h3>上下班时间</h3>
          </template>
          <template #label>
            <span>
              周一、二、三、四、五 A：09:00-18:00<br />
              周六、日休息
            </span>
          </template>
        </van-cell>

        <van-cell class="cell">
          <template #title>
            <h3>迟到规则</h3>
          </template>
          <template #label>
            <span>
              迟到10分钟及以上视为严重迟到<br />
              迟到30分钟及以上视为旷工
            </span>
          </template>
        </van-cell>
      </van-collapse-item>
      <van-collapse-item title="补卡规则" name="2">
        <template #title>
          <h2>补卡规则</h2>
        </template>

        <van-cell class="cell">
          <template #title>
            <h3>缺卡后可以补卡</h3>
          </template>
          <template #label>
            <span>
              补卡起算日期为1号的每个月最多补卡2次,可补过去30个自然日内的缺卡
            </span>
          </template>
        </van-cell>
      </van-collapse-item>
      <van-collapse-item title="考勤范围" name="3">
        <template #title>
          <h2>考勤范围</h2>
        </template>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script setup lang="ts" name="attendance-rule">
import { ref } from 'vue'
const active = ref(['1'])
</script>

<style lang="scss" scoped>
.cell {
  margin: calc(-1 * var(--van-cell-vertical-padding))
    calc(-1 * var(--van-cell-horizontal-padding));
}

.page-container {
  height: 100%;
  background-color: var(--van-background-color);
}
</style>
