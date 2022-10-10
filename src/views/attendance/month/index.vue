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

    <div class="table-wrapper flex-auto h-0 overflow-auto bg-white">
      <table v-if="list.length">
        <thead>
          <tr class="font-bold">
            <td>序号</td>
            <td>考勤月份</td>
            <td>出勤次数</td>
            <td>考勤状态</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list" :key="item.id">
            <td class="text-gray-7">{{ index + 1 }}</td>
            <td class="text-gray-7">{{ item.month }}</td>
            <td class="font-bold success">{{ item.attNums }}</td>
            <td
              class="text-blue"
              @click.stop="
                $router.push({
                  name: 'attendance-month-details',
                  query: { month: item.month },
                  params: { personId: item.personId }
                })
              "
            >
              详情>
            </td>
          </tr>
        </tbody>
      </table>
      <van-empty v-else description="无考勤数据" />
    </div>
  </div>
</template>

<script setup lang="ts" name="page-attendance-month">
import { getAttendanceList } from '@/api/home'
import projectPNG from '@/assets/images/project.png'
import { useAuthStore } from '@/store/index'
import { Dialog } from 'vant'
import { onActivated, ref } from 'vue'

// 考勤声明类型
type AttType = { id: string; month: string; attNums: string; personId: string }

const auth = useAuthStore() // 权限状态管理器
const list = ref<AttType[]>([])

// 切入页面时获取考勤信息
onActivated(() => {
  getAttendanceList({ projectId: auth.project.id })
    .then(({ code, data, message }: HTTPResponseInterface<AttType[]>) => {
      if (code !== 0 && !data) throw Error(message)
      list.value = data
    })
    .catch(err => {
      Dialog.alert({
        title: '未获取到考勤信息',
        message: err.message
      }).then(() => {})
    })
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/theme';
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
  .table-wrapper {
    padding: 0 0.46rem;
    table {
      width: 100%;
      border-collapse: collapse;
      tr {
        border-bottom: 1px solid $light-gray;
      }
      td {
        padding: 0.46rem 0;
        white-space: nowrap;
        text-align: center;
      }
    }
  }
}
</style>
