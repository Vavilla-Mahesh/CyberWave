<template>
  <nav class="glass-card sticky top-0 z-40 border-b border-white border-opacity-10">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center animate-glow">
            <span class="text-white font-bold text-xl">C</span>
          </div>
          <span class="text-2xl font-bold glow-text">CyberWave</span>
        </router-link>

        <div class="hidden md:flex items-center space-x-8">
          <template v-if="isAuthenticated">
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            <router-link to="/analytics" class="nav-link">Analytics</router-link>
            <router-link to="/leaderboard" class="nav-link">Leaderboard</router-link>
            <router-link v-if="isAdmin" to="/admin/dashboard" class="nav-link text-cyber-pink">Admin</router-link>
            <div class="flex items-center space-x-4">
              <div class="text-cyber-green font-semibold">
                {{ userPoints }} pts
              </div>
              <button @click="handleLogout" class="btn-secondary">Logout</button>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link">Login</router-link>
            <router-link to="/register" class="btn-primary">Get Started</router-link>
          </template>
        </div>

        <button @click="toggleMenu" class="md:hidden text-cyber-blue">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden mt-4 space-y-4 animate-fade-in">
        <template v-if="isAuthenticated">
          <router-link to="/dashboard" class="block nav-link" @click="toggleMenu">Dashboard</router-link>
          <router-link to="/analytics" class="block nav-link" @click="toggleMenu">Analytics</router-link>
          <router-link to="/leaderboard" class="block nav-link" @click="toggleMenu">Leaderboard</router-link>
          <router-link v-if="isAdmin" to="/admin/dashboard" class="block nav-link text-cyber-pink" @click="toggleMenu">Admin</router-link>
          <button @click="handleLogout" class="w-full btn-secondary">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="block nav-link" @click="toggleMenu">Login</router-link>
          <router-link to="/register" class="block btn-primary text-center" @click="toggleMenu">Get Started</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Navbar',
  setup() {
    const store = useStore()
    const router = useRouter()
    const mobileMenuOpen = ref(false)

    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const isAdmin = computed(() => store.getters.isAdmin)
    const userPoints = computed(() => store.getters.userPoints)

    const toggleMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const handleLogout = () => {
      store.dispatch('logout')
      router.push('/')
      mobileMenuOpen.value = false
    }

    return {
      isAuthenticated,
      isAdmin,
      userPoints,
      mobileMenuOpen,
      toggleMenu,
      handleLogout
    }
  }
}
</script>

<style scoped>
.nav-link {
  @apply text-gray-300 hover:text-cyber-blue transition-colors duration-300 font-medium;
}
</style>
