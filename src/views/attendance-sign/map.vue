<template>
  <div class="wrapper" :class="{ hide: !visible }">
    <baidu-map
      :ak="AK"
      :center="props.location"
      :zoom="20"
      class="map-view"
      @ready="onBaiduMapReady($event)"
    >
      <bm-polygon
        v-for="(path, index) in props.regions"
        :key="index"
        :path="path"
        stroke-color="#07c160"
        fill-color="#07c160"
        :stroke-opacity="0.8"
        :fill-opcity="0.6"
        :stroke-weight="3"
        :editing="false"
      />
      <bm-marker :position="props.location" animation="BMAP_ANIMATION_BOUNCE">
        <bm-label :content="props.address" />
      </bm-marker>
    </baidu-map>
    <van-button
      type="primary"
      class="button-cancel"
      @click="emit('update:visible', false)"
    >
      关闭
    </van-button>
  </div>
</template>

<script setup name="t-baidu-map">
import { BaiduMap, BmMarker, BmLabel, BmPolygon } from 'vue-baidu-map-3x'
import { AK } from '@/global/baidu-map/index'
import { onBeforeMount, ref, watch } from 'vue'

const props = defineProps({
  location: Object,
  regions: Array,
  address: String,
  visible: Boolean
})

const emit = defineEmits(['ready', 'update:visible'])

const mapShow = ref(false) // 地图是否显示

function onBaiduMapReady(e) {
  emit('ready', e)
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all ease-in 200ms;
  &.hide {
    transform: translateY(100%);
  }
  .map-view {
    width: 100%;
    height: 100%;
  }
  .button-cancel {
    position: absolute;
    left: 50%;
    bottom: 0.57rem;
    padding: 0 0.72rem;
    transform: translateX(-50%);
    border-radius: 0.12rem;
    height: 0.9rem;
    line-height: 0.9rem;
    font-size: 0.42rem;
  }
}
</style>
