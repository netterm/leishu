<template>
  <div class="page-wrapper overflow-hidden bg-gray-3">
    <!-- <van-sticky>
      <van-nav-bar
        title="签章选择"
        class="header"
        @click-left="$router.go(-1)"
        @click-right.stop
      >
        <template #left>
          <i class="van-icon van-icon-arrow-left"></i>
        </template>
        <template #right>
          <span class="text-gray-7">签章管理</span>
        </template>
      </van-nav-bar>
    </van-sticky> -->

    <div
      class="signature-wrap overflow-hidden bg-white"
      @click.stop="isCompany = false"
    >
      <div class="title text-center text-gray-7">个人签章</div>
      <van-image
        :src="image1JPG"
        height="2.61rem"
        class="block"
        fit="contain"
      ></van-image>
      <van-divider />
      <div class="bottom flex justify-between items-center">
        <van-tag type="success">个人</van-tag>
        <span>
          <van-icon
            :name="isCompany ? 'circle' : 'checked'"
            :class="isCompany ? 'gray' : 'primary'"
          />
          <span>选择</span>
        </span>
      </div>
    </div>

    <div
      class="signature-wrap overflow-hidden bg-white"
      @click.stop="isCompany = true"
    >
      <div class="title text-center text-gray-7">四川世家星湖湾有限责任公司</div>
      <van-image
        :src="image2JPG"
        height="2.61rem"
        class="block"
        fit="contain"
      ></van-image>
      <van-divider />
      <div class="bottom flex justify-between items-center">
        <van-tag type="danger">企业</van-tag>
        <span>
          <van-icon
            :name="isCompany ? 'checked' : 'circle'"
            :class="isCompany ? 'primary' : 'gray'"
          />
          <span>选择</span>
        </span>
      </div>
    </div>

    <van-button square block type="success" class="button-next"
      >下一步</van-button
    >
  </div>
</template>

<script>
import image1JPG from './images/1.jpg'
import image2JPG from './images/2.jpg'
export default {
  name: 'PageContractSignature',
  data() {
    return {
      image1JPG,
      image2JPG,
      isCompany: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/theme';
.page-wrapper {
  position: relative;
  min-height: 100%;
  box-sizing: border-box;
  .header {
    .van-icon {
      color: $gray;
    }
  }

  .signature-wrap {
    margin: 0.52rem 0.37rem;
    .title {
      margin: 0.34rem 0;
    }
    .bottom {
      margin-bottom: 0.36rem;
      padding: 0 0.32rem;
    }
  }

  .button-next {
    position: absolute;
    bottom: 0;
  }
}
</style>
