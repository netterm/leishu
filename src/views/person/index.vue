<template>
  <div class="page-wrapper overflow-hidden bg-gray-3">
    <van-cell-group>
      <template #title>
        <h2 class="text-gray-8">基础信息</h2>
      </template>
      <van-cell title="头像">
        <van-image
          round
          :src="getImageUrlById(accountInfo.photo)"
          fit="cover"
          width="1.55rem"
          height="1.55rem"
        ></van-image>
      </van-cell>
      <van-cell title="姓名">
        <span class="text-blue">{{ accountInfo.name }}</span>
      </van-cell>
      <van-cell title="性别" :value="accountInfo.sex ? '男' : '女'" />
      <van-cell
        title="民族"
        :value="nationDict.find(dict => dict.code === accountInfo.nation)?.name"
      />
      <van-cell
        title="年龄"
        :value="
          $moment().format('YYYY') -
          $moment(
            accountInfo.birthday && accountInfo.birthday.replace('-', '/')
          ).format('YYYY')
        "
      />
      <van-cell
        title="出身日期"
        :value="
          accountInfo.birthday && accountInfo.birthday.replace(/\s.*?$/, '')
        "
      />
      <van-cell
        title="手机号码"
        :value="
          accountInfo.mobile &&
          accountInfo.mobile.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1 $2 $3')
        "
      ></van-cell>
    </van-cell-group>

    <van-cell-group>
      <template #title>
        <h2 class="text-gray-8">身份证信息</h2>
      </template>
      <van-cell title="身份证有效期">
        <span class="text-red">{{
          accountInfo.endDate && accountInfo.endDate.replace(/\s.*?$/, '')
        }}</span>
      </van-cell>
      <van-cell title="身份证号码">
        <span class="whitespace-nowrap">
          {{
            accountInfo.idCard &&
            accountInfo.idCard.replace(/^(\d{6})(\d{8})(\d{4})$/, '$1 $2 $3')
          }}
        </span>
      </van-cell>
      <van-cell title="身份证地址" :value="accountInfo.address"></van-cell>
    </van-cell-group>

    <!-- <van-cell-group>
      <template #title>
        <h2 class="text-gray-8">项目信息</h2>
      </template>
      <van-cell title="项目名称">
        <span class="text-blue">成都市成华区安邦地块安邦项目</span>
      </van-cell>
      <van-cell title="门禁授权" value="人脸"></van-cell>
      <van-cell title="当前状态">
        <span class="text-green">进场</span>
      </van-cell>
      <van-cell title="人员类型" value="建筑工人"></van-cell>
      <van-cell title="班组" value="木工组"></van-cell>
      <van-cell title="工种" value="木工"></van-cell>
    </van-cell-group> -->
  </div>
</template>

<script>
import { getImageUrlById } from '@/utils/getFileUrl'
import { getPersonal } from '@/api/home'
import { getDictByCategory } from '@/api/dict'
import { useAuthStore } from '@/store/index'
import { Dialog } from 'vant'
const auth = useAuthStore()
export default {
  name: 'PagePerson',
  data() {
    return {
      nationDict: [],

      accountInfo: {}
    }
  },
  computed: {
    account: () => auth.account,
    project: () => auth.project
  },
  activated() {
    // 获取民族字典表
    getDictByCategory('nation').then(({ code, data }) => {
      if (code === 0) this.nationDict = data
    })

    // 获取用户详情
    getPersonal()
      .then(({ code, data, message }) => {
        if (code !== 0 && !data) throw Error(message)
        this.accountInfo = data
      })
      .catch(err => {
        Dialog.alert({
          title: '未获取到用户信息',
          message: err.message
        }).then(() => {})
      })
  },
  methods: {
    getImageUrlById
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/theme';
.page-wrapper {
  min-height: 100%;
  box-sizing: border-box;
  :deep(.van-cell__title) {
    flex: none;
  }
  h2 {
    margin: 0;
    display: flex;
    align-items: center;
    &::before {
      content: '';
      margin-right: 0.28rem;
      width: 0.1rem;
      height: 0.66rem;
      background: $primary;
    }
  }
}
</style>
