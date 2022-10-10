<template>
  <div class="router-view-wrapper">
    <router-view v-slot="{ Component }">
      <keep-alive :max="10">
        <component
          :is="Component"
          v-if="$route?.meta?.keepAlive !== false"
          :key="getKey(Component)"
          router-view
        />
      </keep-alive>
      <component :is="Component" v-if="$route?.meta?.keepAlive === false" />
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'AliveRouterView',
  glob: true,
  methods: {
    getKey(Component) {
      return Component?.type?.name
    }
  }
}
</script>

<style lang="scss" scoped>
.router-view-wrapper {
  overflow: hidden auto;
  height: 100%;
}
</style>
