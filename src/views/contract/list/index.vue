<template>
  <div class="page-wrapper overflow-hidden bg-gray-3">
    <data-list :key="listKey" :data="getList">
      <template #cell="{ data: item }">
        <div
          class="item"
          @click.stop="$router.push({ name: 'contract-details', query: item })"
        >
          <div class="title flex items-center">
            <van-image
              :src="contractPNG"
              width="0.7rem"
              height="0.7rem"
              fit="contain"
              class="icon"
            >
            </van-image>
            <h3>{{ item.contractCode }}</h3>
          </div>
          <van-divider :style="{ margin: '0.16rem 0.54rem 0.3rem 0.54rem' }" />
          <van-cell :border="false" title="发起人">
            <span class="text-gray-8">{{ item.corpName }}</span>
          </van-cell>
          <van-cell :border="false" title="状态">
            <van-tag round plain :type="item.signId ? 'primary' : 'warning'">
              {{ item.signId ? '已签署' : '未签署' }}
            </van-tag>
          </van-cell>
        </div>
      </template>
    </data-list>
  </div>
</template>

<script>
import { getContractList } from '@/api/home'
import { useAuthStore } from '@/store/index'
import contractPNG from '../assets/images/contract.png'
const auth = useAuthStore()
export default {
  name: 'PageContractList',
  data() {
    return {
      contractPNG,
      listKey: 0
    }
  },
  activated() {
    this.listKey = Date.now()
  },
  methods: {
    getList() {
      return getContractList({ projectId: auth.project.id })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  height: 100%;
  box-sizing: border-box;
  padding: 0.52rem 0.36rem;
  .item {
    margin-bottom: 0.54rem;
    padding: 0.22rem 0;
    background: url('../assets/images/bg.png') no-repeat;
    background-size: 100% 100%;
    .title {
      padding: 0 0.54rem;
      .icon {
        margin-right: 0.39rem;
      }
    }
    :deep(.van-cell) {
      padding: 0 0.54rem;
      font-size: 0.36rem;
      background: none;
      .van-cell__title {
        flex: none;
      }
    }
  }
}
</style>
