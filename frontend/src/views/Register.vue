<template>
  <div class="min-h-screen particle-bg grid-background flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-md animate-fade-in">
      <router-link to="/" class="flex items-center justify-center space-x-2 mb-8">
        <div class="w-12 h-12 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center animate-glow">
          <span class="text-white font-bold text-2xl">C</span>
        </div>
        <span class="text-3xl font-bold glow-text">CyberWave</span>
      </router-link>

      <div class="glass-card p-8 shadow-2xl">
        <h2 class="text-3xl font-bold text-center mb-2">Get Started</h2>
        <p class="text-gray-400 text-center mb-8">Create your account to begin training</p>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Username</label>
            <input
              v-model="form.username"
              type="text"
              required
              class="input-field"
              placeholder="username"
            />
          </div>

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
            <div class="mt-2">
              <div class="flex items-center space-x-2">
                <div class="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    :class="passwordStrengthClass"
                    class="h-full transition-all duration-300"
                    :style="{ width: passwordStrength + '%' }"
                  ></div>
                </div>
                <span :class="passwordStrengthTextClass" class="text-xs">{{ passwordStrengthText }}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || passwordStrength < 60"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-400">
            Already have an account?
            <router-link to="/login" class="text-cyber-blue hover:text-cyber-purple transition-colors">
              Login here
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Register',
  setup() {
    const store = useStore()
    const router = useRouter()
    const loading = ref(false)
    
    const form = ref({
      username: '',
      email: '',
      password: ''
    })

    const passwordStrength = computed(() => {
      const password = form.value.password
      if (!password) return 0
      
      let strength = 0
      if (password.length >= 6) strength += 25
      if (password.length >= 10) strength += 25
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
      if (/\d/.test(password)) strength += 25
      
      return strength
    })

    const passwordStrengthText = computed(() => {
      const strength = passwordStrength.value
      if (strength === 0) return ''
      if (strength < 50) return 'Weak'
      if (strength < 75) return 'Medium'
      return 'Strong'
    })

    const passwordStrengthClass = computed(() => {
      const strength = passwordStrength.value
      if (strength < 50) return 'bg-cyber-pink'
      if (strength < 75) return 'bg-yellow-500'
      return 'bg-cyber-green'
    })

    const passwordStrengthTextClass = computed(() => {
      const strength = passwordStrength.value
      if (strength < 50) return 'text-cyber-pink'
      if (strength < 75) return 'text-yellow-500'
      return 'text-cyber-green'
    })

    const handleRegister = async () => {
      loading.value = true
      try {
        await store.dispatch('register', form.value)
        router.push('/dashboard')
      } catch (error) {
        console.error('Registration error:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      passwordStrength,
      passwordStrengthText,
      passwordStrengthClass,
      passwordStrengthTextClass,
      handleRegister
    }
  }
}
</script>
