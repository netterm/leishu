<template>
  <div class="page-wrapper flex flex-col bg-gray-3">
    <header class="flex items-center bg-white">
      <div class="left flex flex-auto w-0 items-center">
        <van-image
          :src="projectPNG"
          width="0.42rem"
          height="0.45rem"
          fit="contain"
          class=""
        >
        </van-image>
        <h2 class="text-lg flex-auto w-0 van-ellipsis">{{ project.name }}</h2>
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

    <div class="flex-auto h-0 overflow-auto">
      <data-list :key="listKey" :data="getList">
        <template #cell="{ data: item }">
          <div
            class="item bg-white text-gray-7"
            @click.stop="$router.push({ name: 'salary-details', query: item })"
          >
            <div class="top flex items-center">
              <span class="date text-gray-7 font-bold">
                {{
                  item.salaryDate &&
                  item.salaryDate.replace(/^(\d{4})-(\d{2}).*$/, '$1-$2')
                }}
              </span>
              <van-button
                round
                plain
                size="small"
                :type="
                  (() =>
                    ({ null: 'warning', true: 'primary', false: 'danger' }[
                      item.confirm
                    ]))()
                "
                class="button text-sm whitespace-nowrap"
              >
                {{
                  { null: '未确认', true: '确认', false: '有异议' }[
                    item.confirm
                  ]
                }}
              </van-button>
            </div>
            <div class="middle flex text-md">
              <div class="flex-auto w-0">
                <div class="text-gray-8 font-bold">{{ item.bankName }}</div>
                <div class="font-bold">
                  {{
                    item.bankCard &&
                    item.bankCard.replace(/^(\d{4})\d{4}/, '$1****')
                  }}
                </div>
              </div>
              <div class="flex-auto w-0">
                <div class="font-bold">应发：￥{{ item.shouldPay }}</div>
                <div class="text-red font-bold">实发：￥{{ item.salary }}</div>
              </div>
            </div>
            <div class="bottom">
              <div>交易时间：{{ item.payDate }}</div>
              <!-- <div>备注：工资发放</div> -->
            </div>
          </div>
        </template>
      </data-list>
    </div>
  </div>
</template>

<script>
import { getSalaryList } from '@/api/home'
import projectPNG from '@/assets/images/project.png'
import { useAuthStore } from '@/store/index'
const useAuth = useAuthStore()
export default {
  name: 'PageSalaryList',
  data() {
    return {
      projectPNG,

      listKey: 0
    }
  },
  computed: {
    project: () => useAuth.project
  },
  activated() {
    this.listKey = Date.now()
  },
  methods: {
    getList() {
      return getSalaryList({ projectId: this.project.id })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  height: 100%;
  box-sizing: border-box;
  header {
    padding: 0.27rem 0.36rem;
    h2 {
      margin: 0 0.48rem;
    }
  }
  .item {
    margin-top: 0.23rem;
    padding: 0.18rem 0.3rem 0.5rem;
    .top {
      .button {
        margin-left: 0.54rem;
        width: 1.6rem;
        height: 0.6rem;
      }
    }
    .middle,
    .bottom {
      padding-left: 0.54rem;
    }
    .middle {
      margin-top: 0.25rem;
    }
    .bottom {
      margin-top: 0.4rem;
      & > div + div {
        margin-top: 0.24rem;
      }
    }
  }
}
</style>
