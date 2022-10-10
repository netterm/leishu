<template>
  <div class="flex flex-col bg-gray-3" :style="{ height: '100%' }">
    <van-cell-group>
      <template #title>
        <van-search
          v-model="keyword"
          style="opacity: 0.8"
          shape="round"
          placeholder="请输入搜索内容"
          class="search"
          background="#1c7afe"
          @search="searchList(isP)"
        >
          <template #left>
            <van-dropdown-menu style="margin-right: 0.1rem">
              <van-dropdown-item
                v-model="value1"
                style="top: 76px"
                :options="option1"
                @change="searchData"
              />
            </van-dropdown-menu>
          </template>
          <template #left-icon>
            <van-dropdown-menu style="margin-right: 0.1rem" class="dropItem">
              <van-dropdown-item
                v-model="empleTypeCode"
                style="top: 76px"
                :options="empleType"
                @change="searchKeyWord"
              />
            </van-dropdown-menu>
            <!-- <div class="filter-wrap" @click="op">
              <div class="label" v-text="empleTypeLabel"></div>
              <van-icon name="arrow-down" icon style="margin: 0 5px" />
            </div> -->
          </template>
        </van-search>
      </template>
    </van-cell-group>
    <!-- 搜索 -->

    <van-pull-refresh
      v-model="refreshing"
      style="overflow: auto"
      @refresh="getList(true)"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getList()"
      >
        <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
        <div
          v-for="(item, index) in list"
          :key="index"
          class="item"
          @click="updata(item)"
        >
          <div class="mainboxTop">
            <div class="mainboxTopL">
              <img src="./icon.png" />
              <span style="font-weight: 900; margin: 0 5px">{{
                item.customs
                  ? item.customs[0].type === 2
                    ? String(item.projectName).replace(/^(.{12}).*$/, '$1...')
                    : String(item.companyName).replace(/^(.{12}).*$/, '$1...')
                  : ''
              }}</span>
              <van-tag :type="item.formOfVisit === 1 ? 'primary' : 'danger'">{{
                item.formOfVisit === 1 ? '上门拜访' : '电话微信'
              }}</van-tag>
            </div>

            <span style="font-weight: 900">{{ item.username }}</span>
          </div>
          <div class="infoBox">
            <span class="info"
              >客户类型：{{
                item.customs
                  ? item.customs[0].type === 1
                    ? '单位'
                    : '项目'
                  : ''
              }}</span
            >
            <span
              v-if="item.customs ? item.customs[0].type === 1 : true"
              class="info"
              >单位名称：{{
                item.companyName
                  ? item.companyName.replace(/^(.{7}).*$/, '$1...')
                  : ''
              }}</span
            >
            <span v-else class="info"
              >项目名称：{{
                item.projectName
                  ? item.projectName.replace(/^(.{7}).*$/, '$1...')
                  : ''
              }}</span
            >
            <span class="info"
              >客户名称：{{ item.customs ? item.customs[0].name : '' }}</span
            >
            <span class="info"
              >职务：{{ item.customs ? item.customs[0].job : '' }}</span
            >
            <span class="info" @click.stop
              >联系方式：<a
                :href="'tel:' + (item.customs ? item.customs[0].phone : '')"
                >{{ item.customs ? item.customs[0].phone : '' }}</a
              >
              <img src="./icon_phone.png" />
            </span>
            <span class="info"
              >合作阶段：{{
                option1?.find(o => o.value === item.cooperationStage)?.text
              }}</span
            >
            <span class="info"
              >拜访时间：{{ item.visitDate ? item.visitDate : '' }}</span
            >
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <div class="addIcon" @click="jump">
      <van-icon name="plus" />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/index'
import { Notify } from 'vant'
import { getDictByCategory } from '@/api/dict'
const auth = useAuthStore()
export default {
  data() {
    return {
      // 搜索类型
      empleTypeCode: null,
      empleTypeLabel: '全部',
      empleType: [
        { text: '全部', value: null },
        { text: '客户', value: 0 },
        { text: '项目', value: 1 },
        { text: '企业', value: 2 },
        { text: '电话', value: 3 }
      ],

      // 搜索配置
      value1: null,
      option1: [{ text: '合作阶段', value: null }],

      keyword: null,
      state: null,
      limit: 10,
      page: 1,
      params: {},
      isP: null,

      // 合作阶段字典表
      cooperation: [],

      // 列表配置
      list: [],
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  computed: {
    account: () => auth.account,
    project: () => auth.project
  },
  activated() {
    this.getList(true)
    // 获取民族字典表
    getDictByCategory('crm_cooperation_stage').then(({ code, data }) => {
      this.option1 = [{ text: '合作阶段', value: null }]
      if (code === 0) {
        data.forEach(item => {
          this.option1.push({
            text: item.name,
            value: item.code
          })
        })
      }
    })
  },
  methods: {
    // 合作阶段选择搜索
    searchData(val) {
      this.finished = false
      this.loading = true
      this.page = 1
      this.list = []
      this.$http
        .get('/center-business/k/q/business/crm/daily/filling/record', {
          params: {
            page: this.page++,
            limit: this.limit,
            cooperationStageCode: val,
            openId: this.account.openId
            // openId: 'o7q4m6DQBmkbhwFha_ObNGBX5Rwg'
          }
        })
        .then(({ code, data, message }) => {
          if (code === 0) {
            ;[].push.apply(this.list, data.records)
            this.finished = data.records.length < this.limit
          } else {
            this.finished = true
            this.page--
            Notify({
              type: 'warning',
              message
            })
          }
          this.loading = false
          this.refreshing = false
        })
    },

    // 搜索内容
    searchKeyWord(val) {
      if (val === 0) {
        this.isP = val
        // 搜索客户
        this.params = {
          page: this.page++,
          limit: this.limit,
          customName: val,
          openId: this.account.openId
        }
      } else if (val === 1) {
        this.isP = val
      } else if (val === 2) {
        this.isP = val
      } else if (val === 3) {
        this.isP = val
      } else {
        this.isP = null
      }
    },
    searchList(val) {
      this.page = 1
      this.list = []
      this.finished = false
      this.loading = true
      if (val === 0) {
        // 搜索客户
        this.params = {
          page: this.page++,
          limit: this.limit,
          customName: this.keyword,
          cooperationStageCode: this.value1,
          openId: this.account.openId
        }
      } else if (val === 1) {
        // 搜索项目
        this.params = {
          page: this.page++,
          limit: this.limit,
          projectName: this.keyword,
          cooperationStageCode: this.value1,
          openId: this.account.openId
        }
      } else if (val === 2) {
        this.isP = val
        // 搜索企业
        this.params = {
          page: this.page++,
          limit: this.limit,
          companyName: this.keyword,
          cooperationStageCode: this.value1,
          openId: this.account.openId
        }
      } else if (val === 3) {
        // 搜索电话
        this.params = {
          page: this.page++,
          limit: this.limit,
          phone: this.keyword,
          cooperationStageCode: this.value1,
          openId: this.account.openId
        }
      } else {
        // 搜索全部
        this.params = {
          page: this.page++,
          limit: this.limit,
          openId: this.account.openId
        }
      }

      this.$http
        .get('/center-business/k/q/business/crm/daily/filling/record', {
          params: this.params
        })
        .then(({ code, data, message }) => {
          if (code === 0) {
            ;[].push.apply(this.list, data.records)
            this.finished = data.records.length < this.limit
          } else {
            this.finished = true
            this.page--
            Notify({
              type: 'warning',
              message
            })
          }
          this.loading = false
          this.refreshing = false
        })
    },

    // 获取列表数据防抖方法
    getList(reset) {
      setTimeout(() => {
        // 是否重置搜索参数
        if (reset) {
          this.finished = false
          this.loading = true
          this.page = 1
          this.list = []
          // this.searchword = null
        }
        this.$http
          .get('/center-business/k/q/business/crm/daily/filling/record', {
            params: {
              page: this.page++,
              limit: this.limit,
              openId: this.account.openId
              // openId: 'o7q4m6DQBmkbhwFha_ObNGBX5Rwg'
            }
          })
          .then(({ code, data, message }) => {
            // 如果为重置搜索则先清空
            if (reset) {
              this.list = []
            }
            if (code === 0) {
              ;[].push.apply(this.list, data.records)
              this.finished = data.records.length < this.limit
            } else {
              this.finished = true
              this.page--
              Notify({
                type: 'warning',
                message
              })
            }
            this.loading = false
            this.refreshing = false
          })
      }, 600)
    },
    jump() {
      this.$router.push({ name: 'createDailyFill' })
    },
    updata(val) {
      this.$router.push({
        name: 'updataDailyfill',
        params: {
          id: val.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.van-cell-group__title) {
  background: #1c7afe;
  color: #fff;
  font-weight: 900;
  padding: 0.1rem;
  text-align: center;
}
:deep(.van-tag) {
  border-radius: 5px;
  padding: 2px 5px;
}
:deep(.van-dropdown-menu__bar) {
  background: #1c7afe;
  margin-right: 0.1rem;
  box-shadow: none;
}
:deep(.van-pull-refresh__track) {
  position: static;
}
:deep(.van-pull-refresh__head) {
  height: auto;
}
:deep(.van-tag) {
  position: static;
}
:deep(.van-dropdown-menu__title) {
  color: #fff;
}

.dropItem {
  :deep(.van-dropdown-menu__bar) {
    background: transparent;
    height: 25px;
    span {
      color: #c8c9cc;
    }
  }
}

.filter-wrap {
  display: flex;
}
.item {
  padding: 20px 10px;
  background: #fff;
  border-radius: 10px;
  margin: 10px;
  .mainboxTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .mainboxTopL {
      display: flex;
      align-items: center;
    }
    img {
      width: 16px;
    }
  }
  .infoBox {
    margin-top: 14px;
    .info {
      margin: 5px 0;
      display: inline-block;
      width: 50%;
      font-size: 12px;
      color: #999;
      a {
        color: #999;
      }
      img {
        margin-left: 5px;
        width: 12px;
        display: inline-block;
      }
    }
  }
}
.addIcon {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1c7afe;
  color: #fff;
  border-radius: 50%;
  font-size: 29px;
  position: absolute;
  bottom: 30px;
  right: 20px;
}
</style>
