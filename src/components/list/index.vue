<template>
  <div class="overflow-auto h-full">
    <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
      <van-list
        v-bind="$attrs"
        v-model:loading="loading"
        v-model:error="error"
        :finished="finished"
        finished-text="没有更多了"
        :error-text="errorText"
        @load="onLoad"
      >
        <template v-for="(item, index) in list">
          <slot name="cell" :data="item" :index="index"> </slot>
        </template>
        <template #finished>
          <van-empty v-if="page == 1 && !list.length" description="暂无数据" />
          <span v-else>没有更多了</span>
        </template>
        <template #error>
          <van-empty
            v-if="page == 1 && !list.length"
            image="error"
            :description="errorText"
          />
          <span v-else>{{ errorText }}</span>
        </template>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  name: 'DataList',
  props: {
    data: {
      type: Function,
      default: () => function () {}
    },
    limit: {
      type: [Number, String],
      default: 10
    }
  },
  glob: true,
  data() {
    return {
      refreshLoading: false,

      loading: false,
      finished: false,
      error: false,
      errorText: '',

      page: 0,
      list: []
    }
  },
  methods: {
    /**
     * 清除列表数据并重置分页配置
     */
    onRefresh() {
      this.finished = false
      this.loading = true
      this.onLoad(true)
    },

    /**
     * 获取列表数据
     * @param reset:是否重置数据,如不为false则在数组后追加数据
     */
    onLoad(reset = this.refreshLoading) {
      // 是否重置分页配置
      if (reset) {
        this.page = 0
        this.list = []
        this.refreshLoading = false
      }

      // 获取数据
      return this.data({ page: ++this.page, limit: this.limit })
        .then(({ code, data, message }) => {
          if (code !== 0) return Promise.reject(message)

          // 插入数据
          Array.prototype.push.apply(this.list, data?.records ?? data ?? [])

          if (data?.records) {
            //如果当前页数据尺寸小于分页尺寸,加载结束
            this.finished = data.records.length < this.limit
          } else {
            //其余情况,加载结束
            this.finished = true
          }
        })
        .catch(err => {
          this.error = true
          this.errorText = err.message || err
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
