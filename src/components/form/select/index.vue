<template>
  <div class="common-select">
    <van-field
      v-bind="$attrs"
      :model-value="fieldValue"
      :clickable="true"
      :readonly="true"
      :is-link="true"
      @click="visible = true"
    />
    <van-popup v-model:show="visible" round position="bottom" teleport="body">
      <van-cascader
        v-model="_value"
        v-bind="$attrs"
        :options="options"
        @close="visible = false"
        @finish="visible = false"
      />
    </van-popup>
  </div>
</template>

<script>
import clone from 'lodash.clonedeep'
export default {
  name: 'CommonSelect',
  glob: true,
  props: {
    modelValue: {
      type: [String, Number, Object, Boolean, RegExp],
      default: () => null
    },
    options: {
      type: Array,
      default: () => []
    },
    split: {
      type: String,
      default: () => '/'
    }
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    _value: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    },
    fieldValue() {
      let fieldValue = ''
      function find(list, parent) {
        list.some(item => {
          const label =
            parent +
            (parent ? this.split : '') +
            item[this.$attrs?.fieldNames?.text || 'text']
          if (
            item[this.$attrs?.fieldNames?.value || 'value'] === this.modelValue
          ) {
            fieldValue = label
            return true
          }
          const children = item[this.$attrs?.fieldNames?.children || 'children']
          if (children?.length) {
            find(children, label)
          }
          return false
        })
      }
      find.call(this, this.options, '')
      return fieldValue
    }
  }
}
</script>

<style lang="scss" scoped></style>
