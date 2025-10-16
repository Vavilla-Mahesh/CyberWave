<template>
  <div class="min-h-screen">
    <Navbar />
    <div class="container mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold mb-8 text-center">🏆 Leaderboard</h1>
      
      <div class="max-w-4xl mx-auto glass-card p-8">
        <div class="space-y-4">
          <div v-for="(user, index) in sampleLeaderboard" :key="index" 
               class="flex items-center justify-between p-4 bg-cyber-dark-light rounded-lg hover:bg-opacity-80 transition-all">
            <div class="flex items-center space-x-4">
              <div :class="getRankClass(index)" class="w-12 h-12 flex items-center justify-center rounded-full font-bold">
                {{ index + 1 }}
              </div>
              <div>
                <div class="font-semibold text-lg">{{ user.username }}</div>
                <div class="text-sm text-gray-400">{{ user.modulesCompleted }} modules completed</div>
              </div>
            </div>
            <div class="text-2xl font-bold text-cyber-green">{{ user.points }} pts</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import Navbar from '../components/Navbar.vue'

export default {
  name: 'Leaderboard',
  components: { Navbar },
  setup() {
    const sampleLeaderboard = ref([
      { username: 'CyberMaster', points: 2500, modulesCompleted: 4 },
      { username: 'SecurityPro', points: 2200, modulesCompleted: 4 },
      { username: 'PhishHunter', points: 1800, modulesCompleted: 3 }
    ])

    const getRankClass = (index) => {
      if (index === 0) return 'bg-yellow-500 text-gray-900'
      if (index === 1) return 'bg-gray-400 text-gray-900'
      if (index === 2) return 'bg-amber-700 text-white'
      return 'bg-cyber-dark text-gray-300'
    }

    return { sampleLeaderboard, getRankClass }
  }
}
</script>
