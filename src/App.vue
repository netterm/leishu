<template>
  <config-provider :theme-vars="themeVars" :style="{ height: '100%' }">
    <!-- 路由视图 -->
    <alive-router-view id="app"></alive-router-view>

    <!-- 全局加载动画 -->
    <van-overlay :show="loading.visible" z-index="999" class="loading-wrap">
      <van-loading :type="loading.type" :color="loading.color" vertical>
        <span :style="{ color: loading.color }" v-text="loading.message"></span>
      </van-loading>
    </van-overlay>
  </config-provider>
</template>

<script setup lang="ts" name="AppRoot">
import { ConfigProvider } from 'vant'
import { computed } from 'vue'
import { useLoadingStore, useThemeStore } from './store/index'
const loading = useLoadingStore()
const themeVars = computed(() => {
  const vars = useThemeStore().$state as unknown
  return vars as Record<string, string>
})
</script>

<style lang="scss" scoped>
.loading-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
