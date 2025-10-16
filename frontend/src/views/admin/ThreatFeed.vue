<template>
  <div class="min-h-screen">
    <Navbar />
    <div class="container mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold mb-8">Threat Intelligence Feed</h1>
      
      <div class="glass-card p-6">
        <div class="mb-6">
          <h3 class="text-xl font-bold mb-2">Live Threat Feed</h3>
          <p class="text-gray-400 text-sm">Ready for integration with PhishTank, OpenPhish, URLhaus, and VirusTotal APIs</p>
        </div>
        
        <div class="space-y-4">
          <div class="bg-cyber-dark-light p-4 rounded-lg border-l-4 border-cyber-pink">
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold">Sample Threat</span>
              <span class="text-xs text-cyber-pink">CRITICAL</span>
            </div>
            <p class="text-sm text-gray-400">Configure API keys in .env to see live threat intelligence</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../../components/Navbar.vue'

export default {
  name: 'ThreatFeed',
  components: { Navbar }
}
</script>
