<template>
  <div class="page-wrapper">
    <common-form ref="form" :options="form">
      <template #before-cultureLevelType>
        <div class="title danger">
          <span>身份信息</span>
        </div>
      </template>

      <template #prepend>
        <div class="title danger">
          <span>身份证上传</span>
        </div>

        <van-uploader
          class="uploader block text-center"
          :after-read="uploadFront"
        >
          <h2>身份证正面</h2>
          <div class="text-sm text-gray-7">
            <span class="text-red">*</span>
            <span>请上传身份证头像面图片<br />并且保持横向拍摄</span>
          </div>
          <van-image
            :src="imgs.front || idCardFrontPNG"
            fit="contain"
            accept="image/*"
            class="image"
          >
          </van-image>
        </van-uploader>

        <van-uploader
          class="uploader block text-center"
          :after-read="uploadBack"
        >
          <h2>身份证背面</h2>
          <div class="text-sm text-gray-7">
            <span class="text-red">*</span>
            <span>请上传身份证国徽面图片<br />并且保持横向拍摄</span>
          </div>
          <van-image
            :src="imgs.back || idCardBackPNG"
            fit="contain"
            accept="image/*"
            class="image"
          >
          </van-image>
        </van-uploader>

        <div class="title danger">
          <span>人脸上传</span>
        </div>
        <van-uploader
          ref="uploadAtt"
          accept="image/*"
          class="uploader block text-center"
          :after-read="uploadFace"
        >
          <h2>人脸考勤照片</h2>
          <div class="text-sm text-gray-7">
            <span class="text-red">*</span>
            <span>请上传清晰的自拍照图片</span>
          </div>
          <van-image
            :src="
              form.fields.photo.value
                ? getImageUrlById(form.fields.photo.value)
                : facePNG
            "
            fit="contain"
            accept="image/*"
            class="image"
          >
          </van-image>
        </van-uploader>
      </template>

      <template #code-button>
        <a
          v-if="buttons.code.countdown === 0"
          class="text-md"
          @click.stop="getCode"
        >
          获取验证码
        </a>
        <span v-else class="text-md text-gray-7">
          重新获取({{ buttons.code.countdown }})
        </span>
      </template>

      <template #append>
        <van-button
          round
          block
          :loading="buttons.submit.loading"
          loading-text="提交中..."
          type="success"
          native-type="submit"
          class="button-submit text-lg"
        >
          提交
        </van-button>
      </template>
    </common-form>
  </div>
</template>

<script>
import { attendance as attendanceModule } from '@/global/upload-module'
import { uploadBase64, uploadFiles } from '@/api/file'
import {
  uploadFront,
  uploadBack,
  registerRealname,
  uploadCompress,
  registerFaceCompare
} from '@/api/realname'
import { useAuthStore, useLoadingStore } from '@/store/index'
import { getDictByCategory } from '@/api/dict'
import { getImageUrlById } from '@/utils/getFileUrl'
import compressImage from '@/utils/compressImage'
import idCardFrontPNG from '@/assets/images/id_card_front.png'
import idCardBackPNG from '@/assets/images/id_card_back.png'
import facePNG from '@/assets/images/face.png'
import { sendCode } from '@/api/auth'
import { Dialog, Field } from 'vant'
import { markRaw } from 'vue'
const auth = useAuthStore()
const loading = useLoadingStore()
export default {
  name: 'PageAuthentication',
  props: {
    link: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      idCardFrontPNG,
      idCardBackPNG,
      facePNG,

      buttons: {
        code: { countdown: 0 },
        submit: { loading: false }
      },

      nationDict: [], // 民族字典

      imgs: {
        front: null,
        back: null
      },

      idcardFrontFile: null, // 身份证正面照文件

      form: {
        fields: {
          userId: {
            attrs: { label: '用户id' },
            value: auth.account.id
          },
          photo: { attrs: { label: '考勤头像' }, value: null },
          frontImageFileId: { attrs: { label: '身份证正面照' }, value: null },
          address: { attrs: { label: '地址' }, value: null },
          birthday: { attrs: { label: '生日' }, value: null },
          name: { attrs: { label: '姓名' }, value: null },
          nation: { attrs: { label: '民族' }, value: null },
          idCard: { attrs: { label: '身份证号' }, value: null },
          sex: { attrs: { label: '性别' }, value: null },
          startDate: { attrs: { label: '身份证开始日期' }, value: null },
          endDate: { attrs: { label: '身份证结束日期' }, value: null },
          police: { attrs: { label: '签发机关' }, value: null },
          cultureLevelType: {
            component: 'common-select',
            attrs: {
              label: '学历',
              placeholder: '请选择学历',
              fieldNames: { text: 'name', value: 'code' },
              options: []
            }
          },
          politicsType: {
            component: 'common-select',
            attrs: {
              label: '政治面貌',
              placeholder: '请选择整治面貌',
              fieldNames: { text: 'name', value: 'code' },
              options: [
                { text: '硕士', value: true },
                { text: '本科', value: false }
              ]
            }
          },
          mobile: {
            component: markRaw(Field),
            attrs: {
              label: '手机号',
              rules: [{ required: true }],
              placeholder: '请输入手机号'
            }
          },
          code: {
            component: {
              is: markRaw(Field),
              scopedSlots: { button: 'code-button' }
            },
            attrs: {
              label: '验证码',
              rules: [{ required: true }],
              placeholder: '验证码'
            }
          }
        },

        on: {
          submit: data => {
            this.buttons.submit.loading = true
            new Promise((resolve, reject) => {
              const hadNull = Object.keys(data).some(field => {
                const isNull = [null, undefined].includes(data[field])
                if (isNull) {
                  this.$refs.form.scrollToField(field)
                  reject(
                    Error(this.form.fields[field].attrs.label + '未填写验证!')
                  )
                }
                return isNull
              })
              if (!hadNull) {
                resolve(registerRealname(data))
              }
            })
              .then(({ code, message }) => {
                if (code !== 0) throw Error(message)
                this.buttons.submit.loading = false
                this.$router.push(
                  this.link
                    ? this.link
                    : {
                        name: 'home',
                        query: { userId: data.userId }
                      }
                )
              })
              .catch(err => {
                this.buttons.submit.loading = false
                Dialog.alert({
                  title: '提交失败',
                  message: err.message
                })
              })
          }
        }
      }
    }
  },

  activated() {
    // 获取民族字典表
    getDictByCategory('nation').then(({ code, data }) => {
      if (code === 0) this.nationDict = data
    })
    // 获取政治面貌字典表
    getDictByCategory('politics_type').then(({ code, data }) => {
      if (code === 0) this.form.fields.politicsType.attrs.options = data
    })
    // 获取学历字典表
    getDictByCategory('culture_level_type').then(({ code, data }) => {
      if (code === 0) this.form.fields.cultureLevelType.attrs.options = data
    })
  },

  methods: {
    getImageUrlById,

    // 获取验证码
    getCode() {
      const phone = this.form.fields.mobile.value
      if (phone?.length !== 11) return

      this.buttons.code.countdown = 60
      const interval = window.setInterval(() => {
        if (this.buttons.code.countdown === 1) window.clearInterval(interval)
        this.buttons.code.countdown--
      }, 1000)

      // 发送短信验证码
      sendCode({ phone })
        .then(({ code, message }) => {
          if (code !== 0) throw Error(message)
        })
        .catch(err => {
          Dialog.alert({
            title: '异常',
            message: err.message
          }).then(() => {})
        })
    },

    // 是否小于2Mb
    isLessThan2Mb(file) {
      /* const maxSize = 2 * 1024 * 1024
      if (file.size > maxSize) {
        Dialog.alert({
          title: '上传失败',
          message: '文件超过2Mb'
        }).then(() => {})
        return false
      } */
      return true
    },

    // 人脸上传
    uploadFace({ file }) {
      // 文件尺寸验证
      if (!this.isLessThan2Mb(file)) return

      // 是否上传身份证正面照验证
      if (!this.idcardFrontFile) {
        Dialog.alert({
          title: '未上传身份证正面照',
          message: '请先上传身份证正面照,再进行人脸上传操作!'
        }).then(() => {})
        return
      }

      // 压缩图片
      loading.loadStart({ message: '正在压缩图片' })
      compressImage(file)
        .then(file => {
          // 发送人证对比请求
          loading.loadStart({ message: '正在进行人证对比' })
          const formData = new FormData()
          formData.append('faceImg', file)
          formData.append('idCardImg', this.idcardFrontFile)
          return registerFaceCompare(formData)
        })
        .then(({ code, message }) => {
          if (code !== 0) throw Error(message)
          // 图片压缩请求
          loading.loadStart({ message: '正在压缩人脸图片' })
          const formData = new FormData()
          formData.append('photo', file)
          return uploadCompress(formData)
        })
        .then(({ code, data, message }) => {
          if (code !== 0) throw Error(message)
          // 上传人脸图片
          loading.loadStart({ message: '正在上传人脸图片' })
          return uploadBase64(attendanceModule.face, [data])
        })
        .then(({ code, data, message }) => {
          if (code !== 0) throw Error(message)
          // 将人脸上传成功后返回的文件id存储到表单中
          alert('识别成功: ' + data)
          this.$refs.form.set({ photo: data?.[0] })
          loading.loadStop()
        })
        .catch(err => {
          this.$refs.uploadAtt.clearFiles()
          return Dialog.alert({
            title: '上传失败',
            message: err.message
          })
        })
        .finally(() => {
          loading.loadStop()
        })
    },

    // 身份证正面上传
    uploadFront({ file, content }) {
      // 文件尺寸验证
      if (!this.isLessThan2Mb(file)) return

      this.idcardFrontFile = file

      this.imgs.front = content
      const formData = new FormData()
      formData.append('file', file)
      // ocr识别
      uploadFront(formData)
        .then(({ code, data = {}, message }) => {
          if (code !== 0) throw Error(message)
          this.$refs.form.set({
            address: data.address,
            birthday: this.$moment(data.birth).format('YYYY-MM-DD'),
            name: data.name,
            nation:
              this.nationDict.find(dict => dict.name.includes(data.nationality))
                ?.code || null,
            idCard: data.num,
            sex: data.sex === '男'
          })

          // 上传图片到服务器
          const formData = new FormData()
          formData.append('files', file)
          return uploadFiles(attendanceModule.idCardFront, formData)
        })

        .then(({ code, data, message }) => {
          if (code !== 4002) throw Error(message)
          this.$refs.form.set({ frontImageFileId: data?.[0] })
        })
        .catch(err => {
          Dialog.alert({
            title: '上传失败',
            message: err.message
          }).then(() => {})
        })
    },

    uploadBack({ file, content }) {
      // 文件尺寸验证
      if (!this.isLessThan2Mb(file)) return

      this.imgs.back = content
      const formData = new FormData()
      formData.append('file', file)
      uploadBack(formData)
        .then(({ code, data = {}, message }) => {
          if (code !== 0) throw Error(message)
          const startDateObj = this.$moment(
            (data.startDate || '').replace('.', '/')
          )
          this.$refs.form.set({
            startDate: startDateObj.format('YYYY-MM-DD'),
            endDate: data.endDate
              ? this.$moment(data.endDate.replace('.', '/')).format(
                  'YYYY-MM-DD'
                )
              : startDateObj.add(100, 'year').format('YYYY-MM-DD'),
            police: data.issue
          })
        })
        .catch(err => {
          Dialog.alert({
            title: '上传失败',
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
  overflow: hidden;
  padding: 0 0.84rem;
  :deep(.van-field__control) {
    text-align: right;
    font-size: 0.42rem;
  }
  .title {
    margin: 0.39rem -0.25rem 0.56rem -0.25rem;
    font-size: 0.46rem;
    padding: 0.26rem 0.41rem;
    border-bottom: 1px solid $light-gray;
  }
  .uploader,
  .image {
    width: 7.08rem;
  }
  .image {
    height: 3.93rem;
  }
  .uploader {
    margin: 0.86rem auto 0;
    h2 {
      margin: 0 0 0.13rem;
    }
    .image {
      margin: 0.22rem 0 0;
      border: $gray 1px dashed;
    }
  }
  .button-submit {
    margin: 1.45rem 0 1.14rem;
  }
}
</style>
