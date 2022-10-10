<template>
  <div class="page-wrapper overflow-auto">
    <div
      v-if="!account.idCard"
      class="tips-realname-wrapper flex justify-between items-center"
    >
      <div class="text-red flex items-center">
        <van-icon name="warning" class="icon" />
        <span class="tips text-md">请尽快完成实名认证</span>
      </div>
      <van-button
        plain
        type="success"
        size="small"
        class="button"
        @click="$router.push({ name: 'authentication' })"
      >
        <span class="text-sm whitespace-nowrap">立即认证</span>
      </van-button>
    </div>
    <header class="flex">
      <van-image
        width="1.5rem"
        height="1.5rem"
        :src="account.headImgUrl"
        class="overflow-hidden rounded-sm"
      />
      <div class="center flex flex-col justify-between">
        <div class="text-lg font-bold">
          <span>{{ account.nickname }}</span>
        </div>
        <div class="text-lg font-bold">
          <span>{{ account.phone }}</span>
        </div>
        <div class="realname flex items-center text-sm">
          <van-image
            width="0.51rem"
            height="0.37rem"
            :src="account.idCard ? wxRealnamePNG : wxRealnameNonePNG"
          />
          <span :class="account.idCard ? 'primary' : 'danger'">
            {{ account.idCard ? '已' : '未' }}实名认证
          </span>
        </div>
      </div>
      <div class="right flex items-end">
        <van-image
          width="0.38rem"
          height="0.38rem"
          :src="wxCodePNG"
          fit="cover"
          @click="$router.push({ name: 'qrcode' })"
        />
        <van-icon name="arrow" class="text-gray-7" />
      </div>
    </header>

    <van-grid :column-num="3" class="nav-wrapper">
      <van-grid-item
        v-for="nav in navs"
        :key="nav.name"
        :class="{ disabled: nav.disabled }"
        @click="clickNav(nav)"
      >
        <van-image
          width="1.24rem"
          height="1.24rem"
          :src="nav.img"
          class="block"
        />
        <span class="text text-md text-gray-7">{{ nav.name }}</span>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import storage from 'store'
import { RouterView } from 'vue-router'
import { getImageUrlById } from '@/utils/getFileUrl'
import wxRealnamePNG from '@/assets/images/wx_realname.png'
import wxRealnameNonePNG from '@/assets/images/wx_realname_none.png'
import wxCodePNG from '@/assets/images/wx_code.png'
import personal4PNG from '@/assets/images/personal_img4.png'
import personal5PNG from '@/assets/images/personal_img5.png'
import personal6PNG from '@/assets/images/personal_img6.png'
import personal7PNG from '@/assets/images/personal_img7.png'
import personal8PNG from '@/assets/images/personal_img8.png'
import personal9PNG from '@/assets/images/personal_img9.png'
import personal10PNG from '@/assets/images/personal_img10.png'
import personal11PNG from '@/assets/images/personal_img11.png'
import personal12PNG from '@/assets/images/personal_img12.png'
import personal13PNG from '@/assets/images/personal_img13.png'
import personal14PNG from '@/assets/images/personal_img14.png'
import personal15PNG from '@/assets/images/personal_img15.png'
import { useAuthStore } from '@/store/index'
const auth = useAuthStore()

export default {
  name: 'PageHome',
  data() {
    return {
      wxRealnamePNG,
      wxRealnameNonePNG,
      wxCodePNG,

      navs: [
        // {
        //   img: personal10PNG,
        //   route: { name: 'attendance-sign' },
        //   name: '电子打卡'
        // },
        {
          img: personal10PNG,
          route: { name: 'dailyFill' },
          name: '每日填报'
        }
      ]
    }
  },
  computed: {
    account: () => auth.account
  },
  methods: {
    getImageUrlById,

    clickNav(nav) {
      if (nav.disabled) return

      if (nav.do) nav.do()

      if (nav.route) this.$router.push(nav.route)

      if (nav.href) window.location.href = nav.href
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  box-sizing: border-box;
  height: 100%;
  padding: 0 0.41rem;
  .tips-realname-wrapper {
    margin: 0 -0.41rem;
    padding: 0.3rem 0.41rem;
    background: #fef7b1;
    .icon {
      font-size: 0.6rem;
    }
    .tips {
      margin-left: 0.28rem;
    }
    .button {
      border-radius: 0.1rem;
    }
  }

  header {
    margin: 0.63rem 0 0.58rem;
    .center {
      margin: 0 0.5rem;
      flex: 1;
      .realname {
        & > * + * {
          margin-left: 0.14rem;
        }
      }
    }
    .right {
      & > * + * {
        margin-left: 0.4rem;
      }
    }
  }

  .nav-wrapper {
    margin: 0.59rem -0.41rem 0;
    .disabled {
      filter: grayscale(100%);
    }
    .text {
      margin-top: 0.21rem;
    }
  }
}
</style>
