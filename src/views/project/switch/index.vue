<template>
  <div class="page-wrapper overflow-hidden bg-gray-3">
    <div v-if="projectList.length">
      <div
        v-for="item in projectList"
        :key="item.id"
        class="item"
        @click.stop="setProject(item)"
      >
        <div class="text-lg font-bold title">
          <van-icon name="hotel-o" class="icon primary" />
          <span>{{ item.name }}</span>
        </div>
        <div class="text-sm text-gray-7 text">
          <van-icon name="location" class="icon" />
          <span>工程属地：{{ item.areaName }}</span>
        </div>
        <div class="text-sm text-gray-7 text">
          <van-icon name="location" class="icon" />
          <span>工程地址：{{ item.address }}</span>
        </div>
      </div>
    </div>
    <van-empty
      v-else
      description="该账号下无相关项目信息!"
      class="bg-white"
    ></van-empty>

    <div class="none text-right">
      <a @click.prevent.stop="hadNone">没有找到我的工程?</a>
    </div>
  </div>
</template>

<script>
import { getProjectList, pullProjectList } from '@/api/project'
import { useAuthStore, useLoadingStore } from '@/store/index'
import { Dialog, Toast } from 'vant'
const loading = useLoadingStore()
const auth = useAuthStore()
export default {
  name: 'ProjectSwitch',
  props: {
    link: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      projectList: []
    }
  },
  activated() {
    this.getProjectList()
  },
  methods: {
    getProjectList() {
      const toast = Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      getProjectList()
        .then(({ code, data, message }) => {
          if (code !== 0) throw Error('获取项目列表异常: ' + message)
          this.projectList = data || []
        })
        .finally(toast.clear)
    },

    setProject(project) {
      auth.SetProject(project).then(() => {
        if (this.link) this.$router.replace(this.link)
        else this.$router.push({ name: 'home' })
      })
    },

    hadNone() {
      const toast = Toast.loading({
        message: '拉取列表中...',
        forbidClick: true,
        duration: 0
      })
      pullProjectList()
        .then(({ code, message }) => {
          if (code !== 0) throw Error(message)
          this.getProjectList()
        })
        .catch(err => {
          Dialog.alert({
            title: '请求失败',
            message: err?.message ?? err
          })
        })
        .finally(toast.clear)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/theme';
.page-wrapper {
  min-height: 100%;
  box-sizing: border-box;
  .item {
    margin-top: 0.32rem;
    padding: 0.2rem 0.39rem;
    background-color: $white;
    .icon {
      margin-right: 0.1rem;
    }
    .title {
      margin-bottom: 0.4rem;
      line-height: 1.4;
    }
    .text {
      margin-top: 0.3rem;
    }
  }

  .none {
    margin-top: 0.49rem;
    padding: 0 0.36rem;
  }
}
</style>
