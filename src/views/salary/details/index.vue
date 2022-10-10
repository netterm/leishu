<template>
  <div class="page-wrapper overflow-hidden bg-gray-3">
    <van-cell-group class="cell-group overflow-hidden">
      <h1 class="text-red text-center">
        <span class="icon">￥</span>
        <span class="text">{{ salary }}</span>
      </h1>
      <van-cell
        :border="false"
        title="交易时间"
        :value="payDate"
        class="text-md"
      />
      <van-cell
        :border="false"
        title="工资月份"
        :value="salaryDate"
        class="text-md"
      />
      <van-cell
        :border="false"
        title="工资应发"
        :value="`￥${shouldPay}`"
        class="text-md"
      />
      <van-cell
        :border="false"
        title="发放项目"
        :value="projectName"
        class="text-md"
      />
      <van-cell :border="false" title="工资银行" class="text-md">
        <div class="flex justify-end items-center">
          <span class="text-gray-8">{{ bankName }}</span>
        </div>
      </van-cell>
      <van-cell
        :border="false"
        title="工资卡号"
        :value="bankCard && bankCard.replace(/^(\d{4})\d{4}/, '$1****')"
        class="text-md"
      />

      <van-divider :style="{ padding: '0.85rem 0.4rem 0 0.4rem' }" />

      <van-cell
        :border="false"
        title="对方账号"
        :value="
          employeeBankCard &&
          employeeBankCard.replace(/^(\d{4})\d{4}/, '$1****')
        "
        class="text-md"
      />
      <van-cell
        :border="false"
        title="对方户名"
        :value="generalContractor"
        class="text-md"
      />
      <van-cell
        :border="false"
        title="对方账户行别"
        :value="employeeBankName"
        class="text-md"
      />
    </van-cell-group>

    <div v-if="!confirm" class="button-group text-center">
      <div class="button-sure-wrap">
        <van-button round class="button-sure" type="success" @click.stop="sure"
          >工资确认</van-button
        >
      </div>
      <div class="button-reject-wrap">
        <a class="button-reject danger font-bold" @click.stop="$refs.reject.show()"
          >我有异议?</a
        >
      </div>
    </div>

    <reject-dialog v-bind="$props" ref="reject"></reject-dialog>
  </div>
</template>

<script>
import props from './props'
import RejectDialog from './reject'
import { salarySure } from '@/api/salary'
import { useAuthStore } from '@/store/index'
import { Dialog } from 'vant'
const auth = useAuthStore()
export default {
  name: 'PageSalaryDetails',
  components: { RejectDialog },
  props,
  data() {
    return {}
  },
  computed: {
    project: () => auth.project
  },
  methods: {
    sure() {
      Dialog.confirm({
        title: '提示',
        message:
          '请确认核对该月所发工资是否准确,确认后无法对该工资单进行其他操作!'
      })
        .then(() =>
          salarySure({
            id: this.id,
            projectId: this.project.id
          })
        )
        .then(({ code, message }) => {
          if (code !== 0) throw Error(message)
          this.$router.go(-1)
        })
        .catch(err => {
          if (err === 'cancel') return
          Dialog.alert({
            title: '提交失败',
            message: err.message
          }).then(() => {})
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/theme';
.page-wrapper {
  min-height: 100%;
  box-sizing: border-box;
  h1 {
    margin: 0.62rem 0 0;
    font-size: 0.62rem;
    .icon {
      font-size: 0.24rem;
    }
  }
  .cell-group {
    padding: 0 0 0.26rem;
    :deep(.van-cell) {
      padding: 0.18rem 0.48rem;
      align-items: center;
      .van-cell__title {
        flex: 0.4;
        white-space: nowrap;
        color: $gray;
      }
    }
  }

  .button-sure-wrap {
    margin-top: 1.45rem;
    .button-sure {
      width: 6.51rem;
      height: 1.22rem;
    }
  }
  .button-reject-wrap {
    margin-top: 0.37rem;
  }
}
</style>
