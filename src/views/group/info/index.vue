<template>
  <div
    class="overflow-auto box-border"
    :style="{
      padding: theme.cellVerticalPadding,
      backgroundColor: theme.gray1,
      height: '100%'
    }"
  >
    <div class="top">
      <div class="title flex items-center">
        <b class="text-lg">基本信息</b>
      </div>
      <div class="content">
        <div class="line flex justify-between items-center">
          <div class="text-gray-7">
            <span>照片</span>
          </div>
          <div>
            <van-image
              round
              fit="cover"
              :src="getImageUrlById(account.photo)"
              width="1.5rem"
              height="1.5rem"
            />
          </div>
        </div>
        <div class="line flex justify-between items-center">
          <div class="text-gray-7">
            <span>姓名</span>
          </div>
          <div>
            <span>{{ account.name }}</span>
          </div>
        </div>
        <div class="line flex justify-between items-center">
          <div class="text-gray-7">
            <span>性别</span>
          </div>
          <div>
            <span>{{ account.sex ? '男' : '女' }}</span>
          </div>
        </div>
        <div class="line flex justify-between items-center">
          <div class="text-gray-7">
            <span>年龄</span>
          </div>
          <div>
            <span>{{ dayjs().diff(account.birthday, 'years') }}</span>
          </div>
        </div>
        <div class="line flex justify-between items-center">
          <div class="text-gray-7">
            <span>民族</span>
          </div>
          <div>
            <span>
              {{ nationDict?.find(o => o.code === account.nation)?.name }}
            </span>
          </div>
        </div>
        <div class="line flex justify-between items-center">
          <div class="text-gray-7">
            <span>身份证号码</span>
          </div>
          <div>
            <span>
              {{ account.idCard?.replace(/^(\d{6})(\d{8}).*$/, '$1 $2 ****') }}
            </span>
          </div>
        </div>
        <div class="line flex justify-between items-center">
          <div class="text-gray-7">
            <span>学历</span>
          </div>
          <div>
            <span>
              {{
                cultureLevelTypeDict?.find(
                  o => o.code === account.cultureLevelType
                )?.name
              }}
            </span>
          </div>
        </div>
        <div class="line flex justify-between items-center">
          <div class="text-gray-7">
            <span>政治面貌</span>
          </div>
          <div>
            <span>
              {{
                politicsTypeDict?.find(o => o.code === account.politicsType)
                  ?.name
              }}
            </span>
          </div>
        </div>
        <div class="line">
          <div class="text-gray-7">
            <span>地址</span>
          </div>
          <div :style="{ marginTop: '0.18rem' }">
            <span>
              {{ account.address }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <van-divider></van-divider>

    <div class="bottom">
      <div class="title flex items-center">
        <b>项目信息</b>
      </div>
      <div class="content">
        <div class="line flex justify-between items-center">
          <div class="text-gray-7">
            <span>当前项目</span>
          </div>
          <div class="right">
            <span>{{ group.projectName }}</span>
          </div>
        </div>
        <div class="line flex justify-between items-center">
          <div class="text-gray-7">
            <span>班组</span>
          </div>
          <div>
            <span>{{ group.name }}</span>
          </div>
        </div>
        <div class="line flex justify-between items-center">
          <div class="text-gray-7">
            <span>工种</span>
          </div>
          <div>
            <span>{{ group.workerTypeName }}</span>
          </div>
        </div>
        <div class="line flex justify-between items-center">
          <div class="text-gray-7">
            <span>进出场状态</span>
          </div>
          <div>
            <van-tag v-if="group.state" type="success" size="medium"
              >进场</van-tag
            >
            <van-tag v-else type="danger" size="medium">出场</van-tag>
          </div>
        </div>
        <div class="line flex justify-between items-center">
          <div class="text-gray-7">
            <span>{{ group.state ? '进场' : '出场' }}日期</span>
          </div>
          <div>
            {{ group.state ? group.enterDate : group.exitDate }}
          </div>
        </div>
      </div>
    </div>

    <div class="text-center">
      <van-button
        type="primary"
        :style="{ padding: '0 0.96rem' }"
        @click="$router.go(-1)"
      >
        确定
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="group-info">
import { getGroup, getPersonal } from '@/api/home'
import { useAuthStore, useThemeStore } from '@/store'
import { onActivated, ref } from 'vue'
import dayjs from 'dayjs'
import { getDictByCategory } from '@/api/dict'
import { getImageUrlById } from '@/utils/getFileUrl'

const auth = useAuthStore() // 权限状态
const theme = useThemeStore() // 主题状态
const account = ref<Partial<PersonalInterface>>({}) // 账号信息
const group = ref<Partial<GroupInterface>>({}) // 班组信息
const nationDict = ref<DictInterface[]>([]) // 民族字典
const politicsTypeDict = ref<DictInterface[]>([]) // 政治面貌字典
const cultureLevelTypeDict = ref<DictInterface[]>([]) // 学历字典

// 获取民族字典表
getDictByCategory('nation').then(({ code, data, message }) => {
  if (code !== 0) throw Error('获取民族字典异常: ' + message)
  nationDict.value = data
})

// 获取政治面貌字典表
getDictByCategory('politics_type').then(({ code, data, message }) => {
  if (code !== 0) throw Error('获取政治面貌字典异常: ' + message)
  politicsTypeDict.value = data
})

// 获取学历字典表
getDictByCategory('culture_level_type').then(({ code, data, message }) => {
  if (code !== 0) throw Error('获取学历字典异常: ' + message)
  cultureLevelTypeDict.value = data
})

onActivated(() => {
  // 获取中心账号信息
  account.value = {}
  getPersonal().then(
    ({ code, data, message }: HTTPResponseInterface<PersonalInterface>) => {
      if (code !== 0) throw Error('获取账号信息异常: ' + message)
      account.value = data
    }
  )

  // 获取班组信息
  group.value = {}
  getGroup({ projectId: auth.project.id }).then(
    ({ code, data, message }: HTTPResponseInterface<GroupInterface>) => {
      if (code !== 0) throw Error('获取班组信息异常: ' + message)
      group.value = data
    }
  )
})
</script>

<style lang="scss" scoped>
@import '@style/theme.scss';
.title {
  &::before {
    content: '';
    margin-right: 0.18rem;
    width: 0.18rem;
    height: 0.66rem;
    background-color: $primary;
  }
}
.content {
  padding: 0.3rem 0.36rem;
}

.line {
  margin: 0.36rem 0;
  .right {
    margin-left: 0.36rem;
    text-align: right;
  }
}
</style>
