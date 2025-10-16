<template>
  <div id="app" class="min-h-screen">
    <router-view />
    <Notification v-if="notification.show" 
                  :message="notification.message" 
                  :type="notification.type" 
                  @close="closeNotification" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Notification from './components/Notification.vue'

export default {
  name: 'App',
  components: {
    Notification
  },
  setup() {
    const store = useStore()
    
    const notification = computed(() => store.state.notification)
    
    const closeNotification = () => {
      store.commit('hideNotification')
    }
    
    return {
      notification,
      closeNotification
    }
  }
}
</script>
