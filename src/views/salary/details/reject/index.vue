<template>
  <van-popup v-model:show="visible" class="popup">
    <div class="dialog-wrapper">
      <div class="title flex items-center">
        <span class="font-bold">我有异议</span>
      </div>

      <common-form ref="form" :options="form">
        <template #append>
          <div class="button-wrapper flex justify-between">
            <van-button round @click.prevent.stop="cancel">取消</van-button>
            <van-button
              round
              type="success"
              :loading="buttons.submit.loading"
              loading-text="提交中..."
              native-type="submit"
            >
              提交
            </van-button>
          </div>
        </template>
      </common-form>
    </div>
  </van-popup>
</template>

<script>
import props from '../props'
import { salary as salaryModule } from '@/global/upload-module'
import { salaryReject } from '@/api/salary'
import { getDictByCategory } from '@/api/dict'
import { useAuthStore } from '@/store/index'
import { Dialog, Field } from 'vant'
import { markRaw } from 'vue'
const auth = useAuthStore()
export default {
  name: 'SalaryReject',
  props,
  data() {
    return {
      visible: false,

      buttons: { submit: { loading: false } },

      form: {
        fields: {
          id: { value: this.id },
          projectId: { value: auth.project.id },
          type: {
            component: 'common-select',
            attrs: {
              label: '异议分类',
              placeholder: '请选择异议分类',
              title: '异议分类',
              fieldNames: { text: 'name', value: 'code' },
              rules: [{ required: true }],
              options: []
            }
          },
          content: {
            component: markRaw(Field),
            attrs: {
              label: '异议内容',
              type: 'textarea',
              autosize: true,
              rules: [{ required: true }],
              placeholder: '请输入异议内容'
            }
          },
          imgUrls: {
            component: 'common-uploader',
            attrs: {
              label: '附件上传',
              placeholder: '如无附件,可不用上传！',
              style: { border: 'none' },
              action:
                '/center/file/k/s/file/api/files/' + salaryModule.salaryReject,
              isImage: true,
              maxCount: 3,
              rules: [{ required: true }]
            },
            value: []
          }
        },

        on: {
          submit: ({ id, projectId, type, content, imgUrls }) => {
            salaryReject({ id, projectId, type, content }, imgUrls)
              .then(({ code, message }) => {
                if (code !== 0) throw Error(message)
                this.$router.go(-1)
              })
              .catch(err => {
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
  methods: {
    show() {
      this.visible = true
      getDictByCategory('salary_complaint_type')
        .then(({ code, data, message }) => {
          if (code !== 0) throw Error(message)
          this.form.fields.type.attrs.options = data
        })
        .catch(err => {
          Dialog.alert({
            title: '未获取到异议分类字典',
            message: err.message
          })
        })
    },

    cancel() {
      this.$refs.form.init()
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/theme';
.popup {
  border-radius: 0.1rem;
}
.dialog-wrapper {
  width: 8.6rem;
  .title {
    padding: 0.26rem 0.39rem;
    border-bottom: 1px solid $light-gray;
    &::before {
      content: '';
      margin-right: 0.19rem;
      display: block;
      width: 0.08rem;
      height: 0.38rem;
      background-color: $primary;
    }
  }

  .button-wrapper {
    padding: 0.51rem 0.9rem;
    & > * {
      width: 2.8rem;
      height: 0.82rem;
    }
  }
}
</style>
