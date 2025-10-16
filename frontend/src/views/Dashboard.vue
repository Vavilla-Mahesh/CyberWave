<template>
  <div class="min-h-screen">
    <Navbar />
    
    <div class="container mx-auto px-6 py-12">
      <div class="mb-12 animate-fade-in">
        <h1 class="text-4xl font-bold mb-2">Welcome back, <span class="glow-text">{{ username }}</span>!</h1>
        <p class="text-gray-400">Continue your cybersecurity training journey</p>
      </div>

      <!-- Progress Overview -->
      <div class="grid md:grid-cols-3 gap-6 mb-12">
        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-300">Total Points</h3>
            <div class="text-3xl">🏆</div>
          </div>
          <div class="text-4xl font-bold text-cyber-green">{{ userPoints }}</div>
        </div>

        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-300">Badges Earned</h3>
            <div class="text-3xl">🎖️</div>
          </div>
          <div class="text-4xl font-bold text-cyber-purple">{{ userBadges.length }}</div>
        </div>

        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-300">Modules Completed</h3>
            <div class="text-3xl">✓</div>
          </div>
          <div class="text-4xl font-bold text-cyber-blue">{{ completedModules.length }}/4</div>
        </div>
      </div>

      <!-- Training Modules -->
      <div class="mb-12">
        <h2 class="text-3xl font-bold mb-6">Training Modules</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <router-link to="/training/email" class="glass-card p-8 hover:scale-105 transition-all duration-300 group">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-2xl font-bold group-hover:text-cyber-blue transition-colors">Email Phishing</h3>
              <div class="text-5xl">📧</div>
            </div>
            <p class="text-gray-400 mb-4">Learn to identify suspicious emails and phishing attempts</p>
            <div class="flex items-center justify-between">
              <span class="text-cyber-blue font-semibold">Start Training →</span>
              <div v-if="completedModules.includes('email')" class="text-cyber-green text-2xl">✓</div>
            </div>
          </router-link>

          <router-link to="/training/sms" class="glass-card p-8 hover:scale-105 transition-all duration-300 group">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-2xl font-bold group-hover:text-cyber-purple transition-colors">SMS Phishing</h3>
              <div class="text-5xl">📱</div>
            </div>
            <p class="text-gray-400 mb-4">Recognize smishing attacks via text messages</p>
            <div class="flex items-center justify-between">
              <span class="text-cyber-purple font-semibold">Start Training →</span>
              <div v-if="completedModules.includes('sms')" class="text-cyber-green text-2xl">✓</div>
            </div>
          </router-link>

          <router-link to="/training/qr" class="glass-card p-8 hover:scale-105 transition-all duration-300 group">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-2xl font-bold group-hover:text-cyber-green transition-colors">QR Phishing</h3>
              <div class="text-5xl">📷</div>
            </div>
            <p class="text-gray-400 mb-4">Understand the risks of malicious QR codes</p>
            <div class="flex items-center justify-between">
              <span class="text-cyber-green font-semibold">Start Training →</span>
              <div v-if="completedModules.includes('qr')" class="text-cyber-green text-2xl">✓</div>
            </div>
          </router-link>

          <router-link to="/training/social" class="glass-card p-8 hover:scale-105 transition-all duration-300 group">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-2xl font-bold group-hover:text-cyber-pink transition-colors">Social Media</h3>
              <div class="text-5xl">👥</div>
            </div>
            <p class="text-gray-400 mb-4">Detect fake profiles and impersonation attacks</p>
            <div class="flex items-center justify-between">
              <span class="text-cyber-pink font-semibold">Start Training →</span>
              <div v-if="completedModules.includes('social')" class="text-cyber-green text-2xl">✓</div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Badges Section -->
      <div v-if="userBadges.length > 0" class="glass-card p-8">
        <h2 class="text-2xl font-bold mb-6">Your Badges</h2>
        <div class="flex flex-wrap gap-4">
          <div v-for="badge in userBadges" :key="badge" class="flex items-center space-x-2 bg-cyber-dark-light px-4 py-2 rounded-lg border border-cyber-blue">
            <span class="text-2xl">🎖️</span>
            <span class="font-semibold capitalize">{{ badge }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Navbar from '../components/Navbar.vue'

export default {
  name: 'Dashboard',
  components: {
    Navbar
  },
  setup() {
    const store = useStore()

    const username = computed(() => store.state.user?.username || 'User')
    const userPoints = computed(() => store.getters.userPoints)
    const userBadges = computed(() => store.getters.userBadges)
    const completedModules = computed(() => store.getters.completedModules)

    onMounted(() => {
      store.dispatch('fetchUserProfile')
      store.dispatch('fetchUserProgress')
    })

    return {
      username,
      userPoints,
      userBadges,
      completedModules
    }
  }
}
</script>
