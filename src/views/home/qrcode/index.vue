<template>
  <div class="page-container flex justify-center items-center">
    <div class="center-wrapper rounded-sm bg-white">
      <div class="info-wrapper flex items-center">
        <div class="left " :style="{ marginRight: '.36rem' }">
          <van-image
            width="1.5rem"
            height="1.5rem"
            :src="auth.account.headImgUrl"
          />
        </div>
        <div class="right flex-auto w-0">
          <h2>{{ auth.account.nickname }}</h2>
          <div class="t-size-small">使用惠工云APP扫码</div>
        </div>
      </div>
      <div class="divider" />
      <div class="qrcode-wrapper">
        <van-image :src="url" class="block" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="account-qrcode">
import { useAuthStore, useThemeStore } from '@/store/index'
import { toCanvas } from 'qrcode'
import { ref } from 'vue'
const auth = useAuthStore()
const theme = useThemeStore()
const url = ref() // 二维码地址

const canvasSize = 500 // 画布尺寸
const logoSize = 75 // logo尺寸
const borderWidth = 14 // logo背景的边框宽度
const canvas = document.createElement('canvas')
canvas.width = canvasSize
canvas.height = canvasSize
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

toCanvas(
  canvas,
  JSON.stringify({
    url: location.origin + '/center-wechat/k/q/index/personal',
    headers: {
      userId: auth.account.id,
      idCard: auth.account.idCard,
      openId: auth.account.openId
    },
    identify: 'create_person'
  }),
  {
    width: canvasSize,
    errorCorrectionLevel: 'L',
    color: {
      dark: theme.gray8.toString(),
      light: theme.white.toString()
    }
  }
)
  .then(
    () =>
      new Promise<HTMLImageElement>(resolve => {
        const image = new Image()
        image.src = '/favicon.png'
        image.onload = () => resolve(image)
      })
  )
  .then(image => {
    const offset = canvasSize / 2 - logoSize / 2 // logo画布偏移距离
    ctx.fillStyle = theme.white.toString() // 设置填充画笔的颜色为主题白
    const logoBgSize = logoSize + borderWidth * 2 // logo背景的尺寸
    const logoBgOffset = offset - borderWidth // logo背景的画布偏移距离
    ctx.fillRect(logoBgOffset, logoBgOffset, logoBgSize, logoBgSize) // 绘制logo背景
    ctx.drawImage(image, offset, offset, logoSize, logoSize) // 绘制logo
    url.value = canvas.toDataURL() // 画布转database并渲染到页面
  })
</script>

<style lang="scss" scoped>
.page-container {
  position: relative;
  height: 100%;
  background-color: var(--van-blue);
  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.24);
  }
  .center-wrapper {
    position: relative;
    padding: 0.6rem;
    z-index: 1;
    box-sizing: border-box;
    width: 9.45rem;
    max-width: 84%;
    box-shadow: rgba(0, 0, 0, 0.3) 0.09rem 0.09rem 0.12rem;
  }
  .divider {
    margin-top: 0.3rem;
    border-bottom: 0.09rem dotted var(--van-gray-5);
  }
  .qrcode-wrapper {
    user-select: none;
  }
}
</style>
