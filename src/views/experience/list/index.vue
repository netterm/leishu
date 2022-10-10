<template>
  <div ref="pageRef" class="page-wrapper overflow-auto box-border bg-gray-3">
    <div class="account-info card">
      <div class="info flex items-center">
        <div class="flex-auto w-0">
          <div class="left flex items-center">
            <h2 class="name">{{ person.name }}</h2>
            <van-tag :type="person.sex ? 'primary' : 'danger'">
              {{ person.sex ? '男' : '女' }}
            </van-tag>
          </div>
          <div class="descri text-gray-7">
            <van-icon name="phone-o" />
            <span>
              {{
                person.mobile?.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1 $2 $3')
              }}
            </span>
          </div>
        </div>
        <van-image
          :src="getImageUrlById(person.photo)"
          width="1.81rem"
          height="1.81rem"
          fit="cover"
          class="overflow-hidden rounded-sm"
        />
      </div>
      <div class="statistics flex items-center">
        <div class="flex-auto w-0 text-center">
          <h2 class="font-bold">{{ historicalProjectNum }}</h2>
          <div class="text-gray-7">历史参建</div>
        </div>
        <div class="flex-auto w-0 text-center">
          <h2 class="font-bold">{{ currentProjectNum }}</h2>
          <div class="text-gray-7">进场项目数</div>
        </div>
        <div class="flex-auto w-0 text-center">
          <h2 class="font-bold">{{ exitProjectNum }}</h2>
          <div class="text-gray-7">出场项目数</div>
        </div>
        <!-- <div class="flex-auto w-0 text-center">
          <h2>2</h2>
          <div class="text-gray-7">评价</div>
        </div> -->
      </div>
    </div>
    <div class="title flex items-center">
      <van-image
        :src="projectPNG"
        width="0.52rem"
        height="0.57rem"
        fit="contain"
        class="icon"
      />
      <h2 class="font-bold">项目经历</h2>
    </div>
    <div v-if="records.length" class="card divide-y divide-gray-4">
      <div v-for="item in records" :key="item.id" class="py-0.36rem px-0.78rem">
        <router-link
          :to="{
            name: 'experience-details',
            params: { id: item.id },
            query: { projectId: item.projectId, status: item.status ? 1 : 0 }
          }"
          class="text-gray-8"
        >
          <div class="flex aligns-center">
            <div class="flex-none">
              <van-tag v-if="item.status" type="success" size="medium">
                进场
              </van-tag>
              <van-tag v-else type="danger" size="medium">出场</van-tag>
            </div>
            <div class="ml-0.18rem flex-auto w-0 truncate">
              <span class="text-lg font-bold">{{ item.projectName }}</span>
            </div>
          </div>
          <div class="mt-0.36rem flex aligns-center">
            <div class="flex-none w-0.48rem text-center text-gray-7">
              <van-icon name="friends-o" />
            </div>
            <div class="flex-none ml-0.18rem mr-0.48rem text-gray-7">班组</div>
            <div class="flex-auto w-0">{{ item.groupName }}</div>
          </div>
          <div class="mt-0.36rem flex aligns-center">
            <div class="flex-none w-0.48rem text-center text-gray-7">
              <van-icon name="manager-o" />
            </div>
            <div class="flex-none ml-0.18rem mr-0.48rem text-gray-7">工种</div>
            <div class="flex-auto w-0">{{ item.workerType }}</div>
          </div>
          <div class="mt-0.36rem flex aligns-center">
            <div class="flex-none w-0.48rem text-center text-gray-7">
              <van-icon name="user-o" />
            </div>
            <div class="flex-none ml-0.18rem mr-0.48rem text-gray-7">
              人员类型
            </div>
            <div class="flex-auto w-0">{{ item.category }}</div>
          </div>
          <div class="mt-0.36rem flex aligns-center">
            <div class="flex-none w-0.48rem text-center text-gray-7">
              <van-icon name="clock-o" />
            </div>
            <div class="flex-none ml-0.18rem mr-0.48rem text-gray-7">
              在职时间
            </div>
            <div class="flex-auto w-0">
              {{ dayjs(item.enterDate).format('YYYY-MM-DD') }}
              ~
              {{
                item.status ? '至今' : dayjs(item.exitDate).format('YYYY-MM-DD')
              }}
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div v-else class="card">
      <van-skeleton title :row="6" class="item" />
    </div>

    <!-- <div class="title flex items-center">
      <van-image
        :src="evaluatePNG"
        width="0.56rem"
        height="0.49rem"
        fit="contain"
        class="icon"
      />
      <h2>评价</h2>
    </div>
    <div class="evaluate card">
      <div class="line text-gray-7">
        1. 知识面丰富，自我调节能力极佳，身体健康，能长期保持良 好的工作状态。
      </div>
      <div class="line text-gray-7">
        2. 知识面丰富，自我调节能力极佳，身体健康，能长期保持良 好的工作状态。
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts" name="page-experience-list">
import dayjs from 'dayjs'
import { getExperience, getPersonal } from '@/api/home'
import projectPNG from '../images/project.png'
// import evaluatePNG from './images/evaluate.png'
import { useAuthStore } from '@/store/index'
import { Dialog } from 'vant'
import { onActivated, ref } from 'vue'
import { saveScrollHook } from '@/composition-api'
import { getImageUrlById } from '@/utils/getFileUrl'

const pageRef = ref<Element>() // 页面实例
const auth = useAuthStore() // 权限状态
const person = ref<Partial<PersonalInterface>>({}) // 人员信息
const records = ref<JobRecordInterface[]>([]) // 从业记录列表
const historicalProjectNum = ref(0) // 历史参建项目数
const currentProjectNum = ref(0) // 进场项目数
const exitProjectNum = ref(0) // 出场项目数

saveScrollHook(pageRef) // 存储进度条状态

onActivated(() => {
  getPersonal()
    .then(({ code, data, message }) => {
      if (code !== 0 || !data) throw Error(message)
      person.value = data
    })
    .catch(err => {
      return Dialog.alert({
        title: '未获取到人员信息',
        message: err.message
      })
    })

  getExperience({ projectId: auth.project.id })
    .then(
      (
        res: HTTPResponseInterface<{
          historicalProjectNum: number
          currentProjectNum: number
          exitProjectNum: number
          jobRecordDataVoList: JobRecordInterface[]
        }>
      ) => {
        const { code, data, message } = res
        if (code !== 0 || !data) throw Error(message)
        records.value = data.jobRecordDataVoList
        historicalProjectNum.value = data.historicalProjectNum
        currentProjectNum.value = data.currentProjectNum
        exitProjectNum.value = data.exitProjectNum
      }
    )
    .catch(err => {
      Dialog.alert({
        title: '未获取到从业经历',
        message: err.message
      }).then(() => {})
    })
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/theme';
.page-wrapper {
  padding: 0.52rem 0.38rem;
  height: 100%;

  h2 {
    font-size: 0.52rem;
  }

  .card {
    overflow: hidden;
    margin: 0.22rem 0 0.45rem;
    background: #ffffff;
    box-shadow: 0px 0.06rem 0.11rem 0.01rem rgba(4, 0, 0, 0.05);
    border-radius: 0.12rem;
  }

  .title {
    .icon {
      margin-right: 0.15rem;
    }
  }

  .account-info {
    .info {
      margin: 0.29rem 0.83rem 0.82rem;
      .left {
        .name {
          margin-right: 0.2rem;
        }
      }
      .descri {
        margin-top: 0.3rem;
      }
    }
    .statistics {
      margin: 0 0 0.52rem;
    }
  }

  .evaluate {
    padding: 0 0.36rem;
    .line {
      margin: 0.43rem 0;
    }
  }
}
</style>
