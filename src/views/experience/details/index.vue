<template>
  <div class="h-full bg-gray-1">
    <div class="pt-0.93rem px-0.69rem">
      <div class="flex flex-align">
        <div class="w-0.18rem h-0.66rem mr-0.18rem bg-blue"></div>
        <div class="text-lg font-bold">项目信息</div>
      </div>
      <div class="flex justify-between my-0.21rem">
        <div class="flex-none text-gray-7">项目名称</div>
        <div class="ml-0.21rem flex-auto w-0 text-right">
          {{ experience.projectName }}
        </div>
      </div>
      <div class="flex justify-between my-0.21rem">
        <div class="flex-none text-gray-7">项目地址</div>
        <div class="ml-0.21rem flex-auto w-0 text-right">
          {{ experience.projectAddress }}
        </div>
      </div>
      <div class="flex justify-between my-0.21rem">
        <div class="flex-none text-gray-7">项目经理</div>
        <div class="ml-0.21rem flex-auto w-0 text-right">
          {{ experience.projectManager }}
        </div>
      </div>
      <div class="flex justify-between my-0.21rem">
        <div class="flex-none text-gray-7">联系电话</div>
        <div class="ml-0.21rem flex-auto w-0 text-right">
          {{ experience.projectPhone }}
        </div>
      </div>
      <div class="flex justify-between my-0.21rem">
        <div class="flex-none text-gray-7">项目状态</div>
        <div class="ml-0.21rem flex-auto w-0 text-right">
          {{ experience.projectStatus }}
        </div>
      </div>
      <div class="flex justify-between my-0.21rem">
        <div class="flex-none text-gray-7">开工日期</div>
        <div class="ml-0.21rem flex-auto w-0 text-right">
          {{ dayjs(experience.projectStartDate).format('YYYY-MM-DD') }}
        </div>
      </div>
      <div class="flex justify-between my-0.21rem">
        <div class="flex-none text-gray-7">完工日期</div>
        <div class="ml-0.21rem flex-auto w-0 text-right">
          {{ dayjs(experience.projectCompleteDate).format('YYYY-MM-DD') }}
        </div>
      </div>
    </div>

    <div class="py-0.93rem px-0.69rem">
      <div class="flex flex-align">
        <div class="w-0.18rem h-0.66rem mr-0.18rem bg-blue"></div>
        <div class="text-lg font-bold">参建人员</div>
      </div>
      <div class="flex justify-between my-0.21rem">
        <div class="flex-none text-gray-7">姓名</div>
        <div class="ml-0.21rem flex-auto w-0 text-right">
          {{ experience.personName }}
        </div>
      </div>
      <div class="flex justify-between my-0.21rem">
        <div class="flex-none text-gray-7">所属企业</div>
        <div class="ml-0.21rem flex-auto w-0 text-right">
          {{ experience.corpName }}
        </div>
      </div>
      <div class="flex justify-between my-0.21rem">
        <div class="flex-none text-gray-7">班组</div>
        <div class="ml-0.21rem flex-auto w-0 text-right">
          {{ experience.groupName }}
        </div>
      </div>
      <div class="flex justify-between my-0.21rem">
        <div class="flex-none text-gray-7">工种</div>
        <div class="ml-0.21rem flex-auto w-0 text-right">
          {{ experience.workerType }}
        </div>
      </div>
      <div class="flex justify-between my-0.21rem">
        <div class="flex-none text-gray-7">进退场状态</div>
        <div class="ml-0.21rem flex-auto w-0 text-right">
          <van-tag v-if="experience.status" type="success" size="medium">
            进场
          </van-tag>
          <van-tag v-else type="danger" size="medium">退场</van-tag>
        </div>
      </div>
      <div class="flex justify-between my-0.21rem">
        <div class="flex-none text-gray-7">进场日期</div>
        <div class="ml-0.21rem flex-auto w-0 text-right">
          {{ dayjs(experience.enterDate).format('YYYY-MM-DD') }}
        </div>
      </div>
      <div v-if="!experience.status" class="flex justify-between my-0.21rem">
        <div class="flex-none text-gray-7">退场日期</div>
        <div class="ml-0.21rem flex-auto w-0 text-right">
          {{ dayjs(experience.exitDate).format('YYYY-MM-DD') }}
        </div>
      </div>
    </div>

    <div class="text-center">
      <van-button type="primary" class="!px-0.96rem" @click="$router.go(-1)">
        确定
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="page-experience-details">
import dayjs from 'dayjs'
import { getExperienceDetail } from '@/api/home'
import { onActivated, ref } from 'vue'
import { Dialog } from 'vant'

// 传入组件属性值
const props = defineProps<{
  id: string
  projectId: string
  status: string
}>()

const experience = ref<Partial<JobRecordDetailInterface>>({}) // 从业经历详情

onActivated(() => {
  experience.value = {} // 清空已有数据

  // 获取从业经历详情
  getExperienceDetail(props)
    .then(({ code, data, message }) => {
      if (code !== 0) throw Error('获取从业经历详情异常: ' + message)
      experience.value = data
    })
    .catch(err => {
      console.error(err)
      return Dialog.alert({
        title: '提示',
        message: err.message
      })
    })
})
</script>
