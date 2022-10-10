<template>
  <div class="page-wrapper">
    <h1>手机快捷登录</h1>
    <div class="text-gray-7 text-md"><span>注册的账号将与微信绑定</span></div>

    <common-form :options="form" class="form-wapper">
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
          loading-text="登录中..."
          type="success"
          native-type="submit"
          class="button-wrap text-lg"
        >
          授权并登录
        </van-button>
      </template>
    </common-form>

    <div class="tips text-xs">
      <span>
        点击授权并登入，即代表同意<a>《隐私政策》</a>和<a>《服务条款》</a>
      </span>
    </div>
  </div>
</template>

<script>
import { sendCode } from '@/api/auth'
import { useAuthStore } from '@/store/index'
import { Dialog, Field } from 'vant'
import { markRaw } from 'vue'
const auth = useAuthStore()

const style = { marginTop: '0.48rem' }

export default {
  name: 'PageLogin',
  props: {
    redirect: {
      type: String,
      default: () => null
    },
    userId: {
      type: String,
      default: () => null
    }
  },
  data() {
    return {
      // 按钮配置
      buttons: {
        code: { countdown: 0 },
        submit: { loading: false }
      },

      // 表单配置
      form: {
        fields: {
          phone: {
            component: markRaw(Field),
            attrs: {
              style,
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
              style,
              rules: [{ required: true }],
              placeholder: '验证码'
            }
          },
          name: {
            component: markRaw(Field),
            attrs: {
              style,
              rules: [{ required: true }],
              placeholder: '请输入姓名'
            }
          },
          idCard: {
            component: markRaw(Field),
            attrs: {
              style,
              rules: [{ required: true }],
              placeholder: '请输入身份证号码'
            }
          }
        },

        on: {
          // 提交
          submit: data => {
            this.buttons.submit.loading = true
            auth
              .Login(Object.assign({ userId: auth.account.id }, data))
              .then(() => {
                console.log('输出login', data, this.redirect)
                this.buttons.submit.loading = false
                this.$router.push(this.redirect || '/')
              })
              .catch(error => {
                this.buttons.submit.loading = false
                Dialog.alert({
                  title: '登录失败',
                  message: error.message,
                  type: 'error'
                }).then(() => {})
              })
          }
        }
      }
    }
  },
  methods: {
    // 获取验证码
    getCode() {
      const phone = this.form.fields.phone.value
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
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  padding: 0 0.84rem;
  h1 {
    margin: 0.99rem 0 0.29rem;
  }
  .form-wapper {
    margin-top: 1.22rem;
  }
  .button-wrap {
    margin-top: 1.37rem;
    height: 1.16rem;
  }
  .tips {
    position: absolute;
    bottom: 0.94rem;
    left: 50%;
    transform: translate(-50%, 0);
    text-align: center;
    white-space: nowrap;
  }
}
</style>
