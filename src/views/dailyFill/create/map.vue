<template>
  <div class="wrapper" :class="{ hide: !visible }">
    <baidu-map
      :ak="AK"
      :center="props.location"
      :zoom="20"
      class="map-view"
      @ready="onBaiduMapReady($event)"
    >
      <bm-marker :position="props.location" animation="BMAP_ANIMATION_BOUNCE">
        <bm-label :content="props.address" />
      </bm-marker>
    </baidu-map>
    <van-button
      type="primary"
      class="button-cancel"
      @click="$emit('update:visible', false)"
    >
      关闭
    </van-button>
  </div>
</template>

<script>
import { BaiduMap, BmMarker, BmLabel } from 'vue-baidu-map-3x'
import { AK } from '@/global/baidu-map/index'
import { onBeforeMount, ref, watch } from 'vue'

export default {
  props: {
    location: {
      typeof: Object,
      default: null
    },
    address: {
      typeof: String,
      default: null
    }
  },
  data() {
    return {
      mapShow: false
    }
  },
  created() {
    this.onBaiduMapReady(e)
  },
  methods: {
    // onBaiduMapReady({ map: _map }) {
    //   this.ready = true
    //   map = _map
    // }
    onBaiduMapReady(e) {
      this.$emit('ready', e)
    }
  }
}

// const mapShow = ref(false) // 地图是否显示

// function onBaiduMapReady(e) {
//   emit('ready', e)
// }
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
