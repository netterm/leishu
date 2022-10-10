<template>
  <van-field v-bind="$attrs" :model-value="modelValue?.toString() ?? null">
    <template #input>
      <van-uploader
        v-bind="$attrs"
        :model-value="fileList"
        :max-count="$attrs.maxCount || 1"
        :after-read="upload"
        :deletable="$attrs.disabled !== true"
        @delete="del"
      />
    </template>
  </van-field>
</template>

<script>
import { getImageUrlById } from '@/utils/getFileUrl'
import cloneDeep from 'lodash.clonedeep'

export default {
  name: 'CommonUploader',
  glob: true,
  props: {
    modelValue: {
      type: [Array, String, Number],
      default: () => null
    }
  },
  computed: {
    fileList() {
      let result = []
      if (this?.modelValue?.length) {
        result = this.modelValue.map(item => ({
          url: getImageUrlById(item, this.$attrs.hbase),
          isImage: this.$attrs.isImage
        }))
      }
      return result
    }
  },
  methods: {
    // 上传文件
    upload(_file) {
      const file = _file.file
      const formData = new FormData()
      Object.keys(this.$attrs.params || {}).forEach(field => {
        if (typeof this.$attrs.params === 'function') {
          formData.append(field, this.$attrs.params[field](file))
        } else {
          formData.append(field, this.$attrs.params[field])
        }
      })
      formData.append(this.$attrs.fieldName || 'files', file)
      this.$http({
        url: this.$attrs.action || '/center/file/k/s/file/api/files/base_image',
        method: this.$attrs.method || 'post',
        data: formData
      })
        .then(({ code, data, message }) => {
          if (code !== 4002) throw Error(message)
          this.$nextTick(() => {
            const files = data.concat(this.modelValue ?? [])
            files.splice(
              files.findIndex(o => o.content == _file.content),
              1
            )
            if (files.length) {
              this.$emit('update:modelValue', files)
            } else {
              this.$emit('update:modelValue', data)
            }
          })
        })
        .catch(err => {
          this.$notify(err.message)
        })
    },
    // 删除文件
    del(file) {
      const fileList = cloneDeep(this.modelValue ?? [])
      fileList.splice(
        fileList.findIndex(url => getImageUrlById(url) === file.url),
        1
      )
      this.$emit('update:modelValue', fileList)
    }
  }
}
</script>

<style lang="scss" scoped></style>
