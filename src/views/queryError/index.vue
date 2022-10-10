<template>
  <div class="query-error">
    <van-field
      v-model="fieldValue"
      is-link
      readonly
      label="设备类型"
      placeholder="选择设备类型"
      @click="show = true"
    />
    <van-popup v-model:show="show" round position="bottom">
      <van-cascader
        v-model="cascaderValue"
        title="选择设备类型"
        active-color="#1c7afe"
        :options="options"
        @close="show = false"
        @finish="onFinish"
      />
    </van-popup>
    <div v-if="fieldValue" class="query-content">
      <span>当前选择的设备：</span>
      <p>
        {{ fieldValue }}
      </p>
    </div>
    <div v-if="errorValue" class="error-content">
      <span>故障代码：</span>{{ errorValue }}
    </div>
    <div class="query-btn">
      <van-button
        type="primary"
        round
        block
        color="#1c7afe"
        @click="handleClear"
        >清空列表</van-button
      >
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import dustData from './errordata/dustData.json'
import towerData from './errordata/towerData.json'
import elevatorData from './errordata/elevatorData.json'
import faceData from './errordata/faceData.json'
import commonData from './errordata/commonData.json'
export default {
  setup() {
    // 级联
    const show = ref(false)
    const fieldValue = ref('')
    const cascaderValue = ref('')
    const errorValue = ref('')
    // 选项列表，children 代表子选项，支持多级嵌套
    const options = ref([])
    options.value.push(dustData, towerData, elevatorData, faceData, commonData)
    // console.log(dustData)
    // 全部选项选择完毕后，会触发 finish 事件
    const onFinish = ({ selectedOptions }) => {
      show.value = false
      // console.log(selectedOptions[selectedOptions.length - 1])
      //选择的所有text文本
      fieldValue.value = selectedOptions
        .map((option, index) => {
          if (index >= selectedOptions.length - 1) return
          return option.text
        })
        .join(' - ')

      //选择的最后一级的text文本
      errorValue.value = selectedOptions[selectedOptions.length - 1].text
    }
    //清空列表数据
    const handleClear = () => {
      fieldValue.value = ''
      errorValue.value = ''
    }
    return {
      show,
      options,
      onFinish,
      fieldValue,
      cascaderValue,
      errorValue,
      handleClear
    }
  }
}
</script>
<style lang="scss" scoped>
.query-error {
  padding: 15px;
  .error-content,
  .query-content {
    padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);
    font-size: 18px;
    font-weight: bold;
    color: #333;
    span {
      color: #1c7afe;
    }
  }
  .query-btn {
    // padding: 15px;
    width: 80%;
    position: fixed;
    bottom: 30%;
    left: 10%;
    :deep(.van-button__text) {
      font-size: 0.45rem;
      font-weight: bold;
    }
  }

  // .query-content {
  //   font-size: 18px;
  //   font-weight: bold;
  //   color: #1c7afe;
  // }
  // .error-content {
  //   font-size: 18px;
  //   font-weight: bold;
  //   color: #333;
  // }
}
</style>
