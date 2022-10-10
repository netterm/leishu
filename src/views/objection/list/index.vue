<template>
  <div class="page-wrapper overflow-hidden bg-gray-3">
    <data-list :key="listKey" :data="getList">
      <template #cell="{ data }">
        <div
          class="cell flex items-stretch"
          @click.stop="$router.push({ name: 'objection-details', query: data })"
        >
          <van-image
            :src="getImageUrlById(data.imgUrl[0])"
            width="3.8rem"
            height="2.38rem"
            fit="cover"
          />
          <div class="right flex flex-auto w-0 flex-col justify-between">
            <h3 class="title van-multi-ellipsis--l2">
              {{ data.objectionContent }}
            </h3>
            <div class="bottom flex">
              <van-tag type="warning">
                {{
                  (
                    complaintTypeDict.find(
                      dict => dict.code === data.objectionCategory
                    ) || {}
                  ).name
                }}
              </van-tag>
              <van-tag type="danger" :style="{ marginLeft: '0.1rem' }">
                {{
                  (
                    salaryComplaintType.find(
                      dict => dict.code === data.objectionType
                    ) || {}
                  ).name
                }}
              </van-tag>
            </div>
            <div class="flex items-center">
              <van-icon name="clock-o" class="icon" />
              <span>{{ data.createDate }}</span>
            </div>
          </div>
        </div>
      </template>
    </data-list>
  </div>
</template>

<script>
import { getObjection } from '@/api/home'
import { getImageUrlById } from '@/utils/getFileUrl'
import { getDictByCategory } from '@/api/dict'
import { useAuthStore } from '@/store/index'
import { Dialog } from 'vant'
const auth = useAuthStore()
export default {
  name: 'PageObjectionList',
  data() {
    return {
      listKey: 0,
      complaintTypeDict: [],
      salaryComplaintType: []
    }
  },
  computed: {
    project: () => auth.project
  },
  activated() {
    this.listKey = Date.now()

    getDictByCategory('complaint_type')
      .then(({ code, data, message }) => {
        if (code !== 0) throw Error(message)
        this.complaintTypeDict = data
        return getDictByCategory('salary_complaint_type')
      })
      .then(({ code, data, message }) => {
        if (code !== 0) throw Error(message)
        this.salaryComplaintType = data
      })
      .catch(err => {
        Dialog.alert({
          title: '未获取到字典表',
          message: err.message
        })
      })
  },
  methods: {
    getImageUrlById,

    getList() {
      return getObjection({ projectId: this.project.id })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/theme';
.page-wrapper {
  height: 100%;
  .cell {
    margin: 0.52rem 0;
    padding: 0.37rem;
    background-color: $white;
    .right {
      margin-left: 0.28rem;
      .icon {
        margin-right: 0.1rem;
      }
    }
  }
}
</style>
