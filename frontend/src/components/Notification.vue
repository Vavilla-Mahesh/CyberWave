<template>
  <transition name="slide-fade">
    <div v-if="show" :class="notificationClasses" class="fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg max-w-md animate-slide-up">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div v-if="type === 'success'" class="text-cyber-green text-2xl">✓</div>
          <div v-else-if="type === 'error'" class="text-cyber-pink text-2xl">✕</div>
          <div v-else class="text-cyber-blue text-2xl">ℹ</div>
          <p class="text-white font-medium">{{ message }}</p>
        </div>
        <button @click="$emit('close')" class="ml-4 text-gray-400 hover:text-white transition-colors">
          ✕
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Notification',
  props: {
    message: String,
    type: {
      type: String,
      default: 'success'
    },
    show: Boolean
  },
  emits: ['close'],
  setup(props) {
    const notificationClasses = computed(() => {
      const baseClasses = 'glass-card border-l-4'
      const typeClasses = {
        success: 'border-cyber-green',
        error: 'border-cyber-pink',
        info: 'border-cyber-blue'
      }
      return `${baseClasses} ${typeClasses[props.type] || typeClasses.info}`
    })

    return { notificationClasses }
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  transform: translateX(100px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>
