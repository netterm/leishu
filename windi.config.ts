import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  theme: {
    colors: {
      white: 'var(--van-white)',
      blue: 'var(--van-blue)',
      green: 'var(--van-green)',
      red: 'var(--van-red)',
      orange: 'var(--van-orange)',
      'gray-8': 'var(--van-gray-8)',
      'gray-7': 'var(--van-gray-7)',
      'gray-6': 'var(--van-gray-6)',
      'gray-5': 'var(--van-gray-5)',
      'gray-4': 'var(--van-gray-4)',
      'gray-3': 'var(--van-gray-3)',
      'gray-2': 'var(--van-gray-2)',
      'gray-1': 'var(--van-gray-1)',
      'text-link-color': 'var(--van-text-link-color)'
    },
    fontSize: {
      lg: 'var(--van-font-size-lg)',
      md: 'var(--van-font-size-md)',
      sm: 'var(--van-font-size-sm)',
      xs: 'var(--van-font-size-xs)'
    },
    borderRadius: {
      sm: '0.1rem'
    }
  }
})
