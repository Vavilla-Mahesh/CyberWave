<template>
  <div class="min-h-screen">
    <Navbar />
    <div class="container mx-auto px-6 py-12">
      <div class="max-w-4xl mx-auto">
        <router-link to="/dashboard" class="text-cyber-blue hover:text-cyber-purple transition-colors">
          ← Back to Dashboard
        </router-link>
        <h1 class="text-4xl font-bold mt-4 mb-2">Social Media Phishing Training</h1>
        <p class="text-gray-400 mb-8">Detect fake profiles and impersonation attacks</p>
        
        <div class="glass-card p-8 text-center">
          <div class="text-6xl mb-4">👥</div>
          <h2 class="text-2xl font-bold mb-4">Social Media Phishing Module</h2>
          <p class="text-gray-400 mb-6">This module covers social media impersonation and fake profiles.</p>
          <button class="btn-primary">Start Training</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../../components/Navbar.vue'

export default {
  name: 'SocialTraining',
  components: { Navbar }
}
</script>
