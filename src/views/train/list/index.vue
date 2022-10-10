<template>
  <div class="flex flex-col bg-gray-3" :style="{ height: '100%' }">
    <van-search
      v-model="keyword"
      placeholder="请输入搜索关键词"
      class=""
      :background="theme.gray3"
      @search="listRef.onLoad(true)"
    />
    <van-tabs
      v-model:active="isPass"
      :color="theme.blue"
      :title-active-color="theme.blue"
      :background="theme.gray3"
      :style="{ marginBottom: '0.54rem' }"
      class=""
      shrink
      @change="listRef.onLoad(true)"
    >
      <van-tab title="全部" :name="-1" />
      <van-tab title="通过" :name="1" />
      <van-tab title="未通过" :name="0" />
    </van-tabs>
    <data-list ref="listRef" :data="onGetList" class="flex-auto">
      <template #cell="{ data }">
        <router-link :to="{ name: 'train-details', params: { id: data.id } }">
          <div
            :style="{ padding: theme.cellVerticalPadding }"
            class="row flex items-center bg-white text-gray-8"
          >
            <div class="left flex-auto w-0">
              <div class="flex items-center">
                <div
                  :style="{ marginRight: '.3rem' }"
                  class="whitespace-nowrap"
                >
                  <van-tag
                    v-if="data.classMethod == 1"
                    type="primary"
                    size="medium"
                  >
                    网上
                  </van-tag>
                  <van-tag
                    v-if="data.classMethod == 0"
                    type="warning"
                    size="medium"
                  >
                    现场
                  </van-tag>
                </div>
                <div class="text-lg">
                  <b>{{ data.trainingName }}</b>
                </div>
              </div>
              <div>
                <div :style="{ margin: '.39rem 0 .45rem 0' }" class="flex">
                  <div class="flex-none w-0.48rem text-center">
                    <van-icon name="bookmark-o" />
                  </div>
                  <span :style="{ margin: '0 0.48rem 0 0.15rem' }"> 类型 </span>
                  <span>
                    {{
                      trainingTypeDict.find(
                        o => o.code === data.trainingTypeCode
                      )?.name
                    }}
                  </span>
                </div>
                <div v-if="data.addr" :style="{ margin: '.45rem 0 .45rem 0' }">
                  <div class="flex-none w-0.48rem text-center">
                    <van-icon name="location-o" />
                  </div>
                  <span :style="{ margin: '0 .48rem 0 .15rem' }"> 地址 </span>
                  <span>{{ data.addr }}</span>
                </div>
                <div class="flex items-center">
                  <div class="flex-none w-0.48rem text-center">
                    <van-icon name="underway-o" />
                  </div>
                  <span
                    :style="{ margin: '0 .48rem 0 .15rem' }"
                    class="flex-none"
                  >
                    时间
                  </span>
                  <div class="flex items-center">
                    <div class="whitespace-nowrap">
                      {{ dayjs(data.startDate).format('YYYY-MM-DD HH:mm') }}
                    </div>
                    <div>&nbsp;至&nbsp;</div>
                    <div class="whitespace-nowrap">
                      {{ dayjs(data.endDate).format('YYYY-MM-DD HH:mm') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="right">
              <van-tag v-if="data.isPass" plain type="success" size="medium">
                已通过
              </van-tag>
              <van-tag v-else plain type="danger" size="medium">未通过</van-tag>
            </div>
          </div>
        </router-link>
      </template>
    </data-list>
  </div>
</template>

<script setup lang="ts" name="page-train-list">
import { getDictByCategory } from '@/api/dict'
import { getTrainingList } from '@/api/home'
import { onSwitchProjectHook } from '@/composition-api'
import { useAuthStore, useThemeStore } from '@/store/index'
import dayjs from 'dayjs'
import { ref } from 'vue'
const theme = useThemeStore()
const auth = useAuthStore()

const keyword = ref('') // 搜索关键字
const isPass = ref<number>(-1) // 培训状态
const listRef = ref() // 列表组件实例

const trainingTypeDict = ref<DictInterface[]>([]) // 培训类型字典

/**
 * 监听获取列表事件
 */
function onGetList() {
  return getTrainingList({
    trainingName: keyword.value,
    isPass: isPass.value === -1 ? null : isPass.value,
    projectId: auth.project.id
  })
}

/**
 * 项目切换时调用钩子
 */
onSwitchProjectHook(() => {
  listRef.value.onLoad(true)
})

// 获取培训类型字典
getDictByCategory('education_type').then(
  ({ code, data, message }: HTTPResponseInterface<DictInterface[]>) => {
    if (code !== 0 && !data) throw Error(message)
    trainingTypeDict.value = data
  }
)
</script>

<style lang="scss" scoped>
.row {
  box-sizing: border-box;
  border: solid var(--van-gray-4);
  border-width: 1px 0 1px 0;
  & + .row {
    margin-top: -1px;
  }
}
</style>
