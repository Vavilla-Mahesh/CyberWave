<template>
  <div class="min-h-screen">
    <Navbar />
    
    <div class="container mx-auto px-6 py-12">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <router-link to="/dashboard" class="text-cyber-blue hover:text-cyber-purple transition-colors">
            ← Back to Dashboard
          </router-link>
          <h1 class="text-4xl font-bold mt-4 mb-2">Email Phishing Training</h1>
          <p class="text-gray-400">Learn to identify suspicious emails and phishing attempts</p>
        </div>

        <div v-if="!started" class="glass-card p-8 text-center">
          <div class="text-6xl mb-4">📧</div>
          <h2 class="text-2xl font-bold mb-4">Ready to Start?</h2>
          <p class="text-gray-400 mb-6">You'll be shown various email examples. Identify which ones are phishing attempts.</p>
          <button @click="startTraining" class="btn-primary px-8 py-4">Begin Training</button>
        </div>

        <div v-else-if="!completed" class="glass-card p-8">
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-400">Progress</span>
              <span class="text-cyber-blue font-semibold">{{ currentQuestion + 1 }}/{{ questions.length }}</span>
            </div>
            <div class="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple transition-all duration-300"
                :style="{ width: ((currentQuestion + 1) / questions.length * 100) + '%' }"
              ></div>
            </div>
          </div>

          <div class="bg-cyber-dark-light p-6 rounded-lg mb-6">
            <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
              <div class="flex items-center space-x-3">
                <div class="text-2xl">📧</div>
                <div>
                  <div class="font-semibold">{{ questions[currentQuestion].from }}</div>
                  <div class="text-sm text-gray-400">{{ questions[currentQuestion].email }}</div>
                </div>
              </div>
              <div class="text-xs text-gray-500">{{ questions[currentQuestion].date }}</div>
            </div>
            
            <div class="mb-4">
              <div class="font-semibold text-lg mb-2">{{ questions[currentQuestion].subject }}</div>
              <div class="text-gray-300 whitespace-pre-line">{{ questions[currentQuestion].body }}</div>
            </div>

            <div v-if="questions[currentQuestion].link" class="bg-cyber-dark p-3 rounded border border-gray-700">
              <a :href="questions[currentQuestion].link" class="text-cyber-blue hover:underline" @click.prevent>
                {{ questions[currentQuestion].link }}
              </a>
            </div>
          </div>

          <div class="space-y-4">
            <p class="text-lg font-semibold mb-4">Is this email legitimate or a phishing attempt?</p>
            <button 
              @click="submitAnswer('legitimate')" 
              class="w-full btn-secondary py-4 text-left px-6 hover:bg-cyber-green hover:text-white hover:border-cyber-green"
            >
              ✓ Legitimate Email
            </button>
            <button 
              @click="submitAnswer('phishing')" 
              class="w-full btn-secondary py-4 text-left px-6 hover:bg-cyber-pink hover:text-white hover:border-cyber-pink"
            >
              ✕ Phishing Attempt
            </button>
          </div>
        </div>

        <div v-else class="glass-card p-8 text-center">
          <div class="text-6xl mb-4">{{ score >= 80 ? '🎉' : '💪' }}</div>
          <h2 class="text-3xl font-bold mb-4">Training Complete!</h2>
          <div class="text-5xl font-bold text-cyber-blue mb-6">{{ score }}%</div>
          <p class="text-gray-400 mb-8">
            {{ score >= 80 ? 'Excellent work! You\'ve mastered email phishing detection.' : 'Good effort! Keep practicing to improve your skills.' }}
          </p>
          <div class="flex gap-4 justify-center">
            <router-link to="/dashboard" class="btn-secondary">Back to Dashboard</router-link>
            <button @click="restartTraining" class="btn-primary">Try Again</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import Navbar from '../../components/Navbar.vue'

export default {
  name: 'EmailTraining',
  components: {
    Navbar
  },
  setup() {
    const store = useStore()
    const started = ref(false)
    const completed = ref(false)
    const currentQuestion = ref(0)
    const answers = ref([])
    const startTime = ref(null)

    const questions = ref([
      {
        id: 1,
        from: 'Security Team',
        email: 'security@company-verify.com',
        date: 'Today, 10:30 AM',
        subject: 'URGENT: Verify Your Account',
        body: 'Your account has been compromised. Click the link below to verify your identity immediately.\n\nFailure to verify within 24 hours will result in account suspension.',
        link: 'http://company-verify.com/secure-login',
        correct: 'phishing',
        reason: 'Urgent language, suspicious domain, and threatening consequences are red flags.'
      },
      {
        id: 2,
        from: 'IT Department',
        email: 'it@yourcompany.com',
        date: 'Today, 2:15 PM',
        subject: 'Scheduled Maintenance Notice',
        body: 'This is to inform you that we will be performing scheduled system maintenance on Saturday from 2 AM to 6 AM.\n\nDuring this time, some services may be unavailable. Please plan accordingly.',
        link: null,
        correct: 'legitimate',
        reason: 'Internal email with reasonable request and no suspicious elements.'
      },
      {
        id: 3,
        from: 'Amazon Support',
        email: 'support@amazon-secure.net',
        date: 'Today, 4:45 PM',
        subject: 'Your order has been cancelled',
        body: 'We detected unusual activity on your account. Your recent order has been cancelled for security reasons.\n\nClick here to review and reactivate your order.',
        link: 'http://amazon-secure.net/order/review',
        correct: 'phishing',
        reason: 'Fake Amazon domain and pressure tactics to get you to click.'
      }
    ])

    const score = computed(() => {
      if (answers.value.length === 0) return 0
      const correct = answers.value.filter(a => a.correct).length
      return Math.round((correct / answers.value.length) * 100)
    })

    const startTraining = () => {
      started.value = true
      startTime.value = Date.now()
    }

    const submitAnswer = (answer) => {
      const question = questions.value[currentQuestion.value]
      const isCorrect = answer === question.correct
      
      answers.value.push({
        questionId: question.id,
        userAnswer: answer,
        correct: isCorrect
      })

      if (currentQuestion.value < questions.value.length - 1) {
        setTimeout(() => {
          currentQuestion.value++
        }, 300)
      } else {
        completeTraining()
      }
    }

    const completeTraining = async () => {
      completed.value = true
      const timeSpent = Math.round((Date.now() - startTime.value) / 1000)
      
      // Submit result to backend
      try {
        await store.dispatch('submitResult', {
          campaign_id: 1, // Demo campaign ID
          score: score.value,
          time_spent: timeSpent,
          clicked_elements: answers.value,
          is_completed: true
        })
      } catch (error) {
        console.error('Failed to submit result:', error)
      }
    }

    const restartTraining = () => {
      started.value = false
      completed.value = false
      currentQuestion.value = 0
      answers.value = []
      startTime.value = null
    }

    return {
      started,
      completed,
      currentQuestion,
      questions,
      score,
      startTraining,
      submitAnswer,
      restartTraining
    }
  }
}
</script>
