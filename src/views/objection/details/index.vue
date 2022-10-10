<template>
  <div class="page-wrapper overflow-hidden bg-gray-3">
    <div v-if="imgUrl && imgUrl.length" class="card bg-white">
      <h3>附件</h3>
      <van-image
        v-for="(item, index) in imgUrl"
        :key="item"
        :src="getImageUrlById(item)"
        width="4.5rem"
        height="2.82rem"
        fit="cover"
        class="image"
        @click.stop="
          ImagePreview({
            images: imgUrl.map(item => getImageUrlById(item)),
            startPosition: index
          })
        "
      />
    </div>

    <div class="card bg-white">
      <h3>基本信息</h3>
      <van-divider :style="{ margin: 0 }" />
      <van-cell title="创建时间" :value="createDate" />
      <van-cell
        title="身份证号"
        :value="idCard && idCard.replace(/^(\d{6})(\d{8})(\d{4})$/, '$1 $2 $3')"
      />
      <van-cell
        title="异议类型"
        :value="
          (salaryComplaintType.find(dict => dict.code === objectionType) || {})
            .name
        "
      />
      <van-cell
        title="异议类别"
        :value="
          (
            complaintTypeDict.find(dict => dict.code === objectionCategory) ||
            {}
          ).name
        "
      />
      <van-cell title="异议内容" size="large" :label="objectionContent" />
    </div>
  </div>
</template>

<script>
import { getImageUrlById } from '@/utils/getFileUrl'
import { Dialog, ImagePreview } from 'vant'
import { getDictByCategory } from '@/api/dict'
export default {
  name: 'PageObjectionDetails',
  props: [
    'createDate',
    'idCard',
    'imgUrl',
    'objectionCategory',
    'objectionContent',
    'objectionType'
  ],
  data() {
    return {
      complaintTypeDict: [],
      salaryComplaintType: []
    }
  },
  activated() {
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
    ImagePreview
  }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  min-height: 100%;

  .card {
    margin-top: 0.52rem;
    h3 {
      padding: 0.3rem 0.48rem;
    }
    .image {
      margin: 0 0.3rem 0.3rem;
    }
    :deep(.van-cell__title) {
      font-size: 0.32rem;
      flex: none;
    }
    :deep(.van-cell__title) {
      font-size: 0.32rem;
    }
  }
}
</style>
