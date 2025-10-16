<template>
  <div class="min-h-screen">
    <Navbar />
    
    <!-- Hero Section -->
    <section class="relative particle-bg grid-background min-h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 animated-gradient opacity-20"></div>
      
      <div class="container mx-auto px-6 py-20 relative z-10">
        <div class="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 class="text-6xl md:text-7xl font-bold mb-6 animate-float">
            <span class="glow-text">CyberWave</span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-300 mb-8">
            Master Phishing Defense Through Immersive Training
          </p>
          <p class="text-lg text-gray-400 mb-12">
            Real-time threat intelligence • Multi-channel simulations • Gamified learning • Advanced analytics
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/register" class="btn-primary text-lg px-8 py-4">
              Start Training Now
            </router-link>
            <router-link to="/login" class="btn-secondary text-lg px-8 py-4">
              Admin Login
            </router-link>
          </div>
        </div>
      </div>

      <!-- Floating elements -->
      <div class="absolute top-20 left-10 w-20 h-20 bg-cyber-blue opacity-20 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-20 right-10 w-32 h-32 bg-cyber-purple opacity-20 rounded-full blur-3xl animate-float" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/4 w-24 h-24 bg-cyber-green opacity-20 rounded-full blur-3xl animate-float" style="animation-delay: 2s;"></div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-cyber-dark-light">
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center mb-16 glow-text">Platform Features</h2>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="glass-card p-6 hover:scale-105 transition-transform duration-300">
            <div class="text-cyber-blue text-4xl mb-4">📧</div>
            <h3 class="text-xl font-bold mb-2">Email Phishing</h3>
            <p class="text-gray-400">Interactive email simulations to identify suspicious elements</p>
          </div>
          
          <div class="glass-card p-6 hover:scale-105 transition-transform duration-300">
            <div class="text-cyber-purple text-4xl mb-4">📱</div>
            <h3 class="text-xl font-bold mb-2">SMS Phishing</h3>
            <p class="text-gray-400">Mobile-style SMS interface with smishing scenarios</p>
          </div>
          
          <div class="glass-card p-6 hover:scale-105 transition-transform duration-300">
            <div class="text-cyber-green text-4xl mb-4">📷</div>
            <h3 class="text-xl font-bold mb-2">QR Phishing</h3>
            <p class="text-gray-400">QR code scanning simulation with malicious examples</p>
          </div>
          
          <div class="glass-card p-6 hover:scale-105 transition-transform duration-300">
            <div class="text-cyber-pink text-4xl mb-4">👥</div>
            <h3 class="text-xl font-bold mb-2">Social Media</h3>
            <p class="text-gray-400">Fake profiles demonstrating impersonation attacks</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-20 particle-bg">
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center mb-16 glow-text">Platform Impact</h2>
        
        <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="text-center glass-card p-8">
            <div class="text-5xl font-bold text-cyber-blue mb-2">10K+</div>
            <div class="text-gray-400">Users Trained</div>
          </div>
          
          <div class="text-center glass-card p-8">
            <div class="text-5xl font-bold text-cyber-purple mb-2">95%</div>
            <div class="text-gray-400">Success Rate</div>
          </div>
          
          <div class="text-center glass-card p-8">
            <div class="text-5xl font-bold text-cyber-green mb-2">50K+</div>
            <div class="text-gray-400">Simulations Run</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-cyber-dark-light py-8 border-t border-white border-opacity-10">
      <div class="container mx-auto px-6 text-center text-gray-400">
        <p>&copy; 2024 CyberWave. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'

export default {
  name: 'Home',
  components: {
    Navbar
  }
}
</script>
