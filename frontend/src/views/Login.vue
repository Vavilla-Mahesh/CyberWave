<template>
  <div class="min-h-screen particle-bg grid-background flex items-center justify-center px-6">
    <div class="w-full max-w-md animate-fade-in">
      <router-link to="/" class="flex items-center justify-center space-x-2 mb-8">
        <div class="w-12 h-12 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center animate-glow">
          <span class="text-white font-bold text-2xl">C</span>
        </div>
        <span class="text-3xl font-bold glow-text">CyberWave</span>
      </router-link>

      <div class="glass-card p-8 shadow-2xl">
        <h2 class="text-3xl font-bold text-center mb-2">Welcome Back</h2>
        <p class="text-gray-400 text-center mb-8">Login to continue your training</p>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-400">
            Don't have an account?
            <router-link to="/register" class="text-cyber-blue hover:text-cyber-purple transition-colors">
              Register here
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    const loading = ref(false)
    
    const form = ref({
      email: '',
      password: ''
    })

    const handleLogin = async () => {
      loading.value = true
      try {
        await store.dispatch('login', form.value)
        const isAdmin = store.getters.isAdmin
        router.push(isAdmin ? '/admin/dashboard' : '/dashboard')
      } catch (error) {
        console.error('Login error:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      handleLogin
    }
  }
}
</script>
