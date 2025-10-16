<template>
  <div class="min-h-screen">
    <Navbar />
    <div class="container mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold mb-8">Your Analytics</h1>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div class="glass-card p-6">
          <h3 class="text-xl font-bold mb-4">Performance Overview</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-2">
                <span>Email Phishing</span>
                <span class="text-cyber-blue">75%</span>
              </div>
              <div class="w-full h-2 bg-gray-700 rounded-full">
                <div class="h-full bg-cyber-blue rounded-full" style="width: 75%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span>SMS Phishing</span>
                <span class="text-cyber-purple">0%</span>
              </div>
              <div class="w-full h-2 bg-gray-700 rounded-full">
                <div class="h-full bg-cyber-purple rounded-full" style="width: 0%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card p-6">
          <h3 class="text-xl font-bold mb-4">Certificates</h3>
          <p class="text-gray-400">Complete training modules to earn certificates</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'

export default {
  name: 'Analytics',
  components: { Navbar }
}
</script>
