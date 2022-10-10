<template>
  <van-form
    ref="form"
    v-bind="options.attrs || {}"
    @failed="options?.on?.failed"
    @submit="onSubmit"
  >
    <slot name="prepend"></slot>
    <template v-for="(item, key) in options?.fields || {}">
      <slot :name="`before-${key}`"></slot>

      <slot :name="`form-item-${key}`">
        <component
          v-bind="item.attrs || {}"
          :is="item?.component?.is || item.component || null"
          v-if="item.component"
          :key="item.id"
          v-model="item.value"
          :name="key"
          class="form-item"
          v-on="item.on || {}"
        >
          <template
            v-for="(slotName, key) in item?.component?.scopedSlots || {}"
            #[key]
          >
            <slot :name="slotName"> </slot>
          </template>
        </component>
      </slot>

      <slot :name="`after-${key}`"></slot>
    </template>

    <slot name="append"></slot>
  </van-form>
</template>

<script>
import { Field } from 'vant'
import { markRaw } from 'vue'

export default {
  name: 'CommonForm',
  glob: true, // 将该组件注册为全局组件
  props: {
    // 表单配置参数
    options: {
      type: Object,
      default: () => ({
        attrs: {}, // van-form组件属性
        on: {}, // van-form组件监听事件

        // 表单控件组
        fields: {
          // 一个表单name为test的控件
          test: {
            attrs: {
              label: '测试',
              placeholder: '这是一个输入框',
              rules: [{ required: true }]
            },

            // 表单项组件控件配置
            component: {
              is: markRaw(Field), // component组件is属性值
              attrs: {}, // 组件属性
              on: {}, // 组件事件监听

              // 组件插槽定义 form-item-key:表单控件的插槽名称 parent-slot-key:引入该表单组件的插槽名称
              scopedSlots: { 'form-item-key': 'parent-slot-key' }
            },

            value: null // 表单项的值
          }
        }
      })
    }
  },

  created() {
    this.init(true)
  },

  methods: {
    /**
     * 初始化表单
     * @param first:是否为首次执行
     */
    init(first) {
      if (this.options.fields) {
        Object.keys(this.options.fields).forEach(field => {
          const item = this.options.fields[field]
          item.id = parseInt(Math.random() * 10000).toString() + Date.now()
          if (first) item.default = item.value ?? null
          item.value = item.default ?? null
        })
      }
    },

    // 设置表单值
    set(data = {}) {
      Object.keys(data).forEach(field => {
        // eslint-disable-next-line vue/no-mutating-props
        this.options.fields[field].value = data[field]
      })
    },

    // 获取表单值
    get(data = []) {
      const values = {}
      data.forEach(field => {
        values[field] = this.options.fields[field].value
      })
      return values
    },

    // 提交
    onSubmit() {
      this.validate()
        .then(() => {
          const values = {}
          Object.keys(this.options.fields || {}).forEach(field => {
            values[field] = this.options.fields[field].value
          })
          this.options?.on?.submit(values)
        })
        .catch(() => {})
    },

    // van-form组件方法
    submit() {
      return this.$refs.form?.submit(...arguments)
    },

    validate() {
      return this.$refs.form?.validate(...arguments)
    },
    resetValidation() {
      return this.$refs.form?.resetValidation(...arguments)
    },
    scrollToField() {
      return this.$refs.form?.scrollToField(...arguments)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/theme';
.form-item {
  padding: 0.3rem 0.48rem;
  font-size: 0.42rem;
  border-bottom: 1px solid $light-gray;
  &::after {
    display: none;
    left: 0;
    right: 0;
  }
  :deep(.van-field) {
    padding: 0;
  }
  :deep(.van-field::after) {
    display: none;
  }
}
</style>
