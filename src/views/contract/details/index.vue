<template>
  <div class="page-wrapper">
    <contract-template v-bind="$props"></contract-template>
    <!-- <div class="button-wrap flex">
      <van-button class="text-lg flex-auto w-0">拒签</van-button>
      <van-button
        square
        type="success"
        class="text-lg flex-auto w-0"
        @click.stop="
          $router.push({ name: 'contract-signature', query:$props })
        "
      >
        签署
      </van-button>
    </div> -->
  </div>
</template>

<script>
import ContractTemplate from './template'
import props from './props'
export default {
  name: 'PageContractDetails',
  components: { ContractTemplate },
  props
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  overflow: hidden;
  .button-wrap {
    margin-top: 2rem;
  }
}
</style>
