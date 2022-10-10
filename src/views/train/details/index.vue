<template>
  <div
    class="overflow-auto box-border"
    :style="{
      padding: theme.cellVerticalPadding,
      backgroundColor: theme.gray1,
      height: '100%'
    }"
  >
    <div class="top">
      <div class="title flex items-center">
        <b class="text-lg"> 课程信息 </b>
      </div>
      <div class="content">
        <div class="line flex justify-between">
          <div class="text-gray-7">
            <span>课程名称</span>
          </div>
          <div>
            <span>{{ trainingInfo.trainingName }}</span>
          </div>
        </div>
        <div class="line flex justify-between">
          <div class="text-gray-7">
            <span>课程类型</span>
          </div>
          <div>
            <span>
              {{
                trainingTypeDict.find(
                  o => o.code === trainingInfo.trainingTypeCode
                )?.name
              }}
            </span>
          </div>
        </div>
        <div class="line flex justify-between">
          <div class="text-gray-7">
            <span>授课方式</span>
          </div>
          <div>
            {{ { 1: '网上', 0: '现场' }[trainingInfo.classMethod as string] }}
          </div>
        </div>
        <div class="line flex justify-between">
          <div class="text-gray-7">
            <span>培训机构</span>
          </div>
          <div>
            <span>{{ trainingInfo.orgName }}</span>
          </div>
        </div>
        <div class="line flex justify-between">
          <div class="text-gray-7">
            <span>培训人</span>
          </div>
          <div>
            <span>{{ trainingInfo.trainer }}</span>
          </div>
        </div>
        <div class="line flex justify-between">
          <div class="text-gray-7">
            <span>课程时长</span>
          </div>
          <div>
            <span>{{ trainingInfo.trainingDuration }}</span>
          </div>
        </div>
        <div class="line flex justify-between">
          <div class="text-gray-7">
            <span>课程时长</span>
          </div>
          <div>
            <span>{{ trainingInfo.trainingDuration }}分钟</span>
          </div>
        </div>
        <div class="line flex justify-between">
          <div class="text-gray-7">
            <span>课程开始时间</span>
          </div>
          <div>
            <span>{{ trainingInfo.startDate }}</span>
          </div>
        </div>
        <div class="line flex justify-between">
          <div class="text-gray-7">
            <span>课程结束时间</span>
          </div>
          <div>
            <span>{{ trainingInfo.endDate }}</span>
          </div>
        </div>
        <div v-if="trainingInfo.description" class="line">
          <div class="text-gray-7">
            <span>课程简述</span>
          </div>
          <div :style="{ marginTop: '0.18rem', textIndent: '0.63rem' }">
            <span>{{ trainingInfo.description }}</span>
          </div>
        </div>
      </div>
    </div>

    <van-divider />

    <div class="bottom">
      <div class="title flex items-center">
        <b class="text-lg">培训信息</b>
      </div>
      <div class="content">
        <div v-if="trainingInfo.courseLength" class="line flex justify-between">
          <div class="text-gray-7">
            <span>培训时长</span>
          </div>
          <div>
            <span>{{ trainingInfo.courseLength }}分钟</span>
          </div>
        </div>
        <div
          v-if="trainingInfo.trainingPoint"
          class="line flex justify-between"
        >
          <div class="text-gray-7">
            <span>培训得分</span>
          </div>
          <div>
            <span>{{ trainingInfo.trainingPoint }}分</span>
          </div>
        </div>
        <div v-if="trainingInfo.isPass" class="line flex justify-between">
          <div class="text-gray-7">
            <span>培训结果</span>
          </div>
          <div>
            <span v-if="trainingInfo.isPass" :style="{ color: theme.green }">
              已通过
            </span>
            <span v-else :style="{ color: theme.red }"> 未通过 </span>
          </div>
        </div>
        <div class="line">
          <div class="text-gray-7">
            <span>培训日期</span>
          </div>
          <div :style="{ marginTop: '0.18rem' }">
            {{
              dayjs(trainingInfo.startDate?.toString()).format(
                'YYYY-MM-DD HH:mm'
              )
            }}
            至
            {{
              dayjs(trainingInfo.endDate?.toString()).format('YYYY-MM-DD HH:mm')
            }}
          </div>
        </div>
      </div>
    </div>

    <div class="text-center">
      <van-button
        type="primary"
        :style="{ padding: '0 0.96rem' }"
        @click="$router.go(-1)"
      >
        确定
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="page-train-details">
import { getDictByCategory } from '@/api/dict'
import { getTraining } from '@/api/home'
import { useAuthStore, useThemeStore } from '@/store'
import dayjs from 'dayjs'
import { Dialog } from 'vant'
import { onActivated, ref } from 'vue'

const props = defineProps<{ trainingId: string }>() // 属性
const auth = useAuthStore() // 权限状态
const theme = useThemeStore() // 主题状态
const trainingInfo = ref<Record<string, string | number | boolean>>({}) // 路由query对象
const trainingTypeDict = ref<DictInterface[]>([]) // 培训类型字典

onActivated(() => {
  getTraining({
    trainingId: props.trainingId,
    projectId: auth.project.id
  })
    .then(({ code, data }) => {
      if (code !== 0 || !data) throw Error('获取培训信息异常')
      trainingInfo.value = data
    })
    .catch(err => {
      console.error(err)
      return Dialog.alert({
        title: '提示',
        message: err.message
      })
    })
})

// 获取培训类型字典
getDictByCategory('education_type').then(
  ({ code, data, message }: HTTPResponseInterface<DictInterface[]>) => {
    if (code !== 0 || !data) throw Error(message)
    trainingTypeDict.value = data
  }
)
</script>

<style lang="scss" scoped>
@import '@style/theme.scss';
.title {
  &::before {
    content: '';
    margin-right: 0.18rem;
    width: 0.18rem;
    height: 0.66rem;
    background-color: $primary;
  }
}

.content {
  padding: 0.3rem 0.36rem;
}

.line {
  margin: 0.36rem 0;
}
</style>
