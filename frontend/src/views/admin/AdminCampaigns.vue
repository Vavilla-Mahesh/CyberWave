<template>
  <div class="min-h-screen">
    <Navbar />
    <div class="container mx-auto px-6 py-12">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold">Campaign Management</h1>
        <button class="btn-primary">+ Create Campaign</button>
      </div>
      
      <div class="glass-card p-6">
        <p class="text-gray-400">No campaigns created yet. Create your first campaign to get started.</p>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../../components/Navbar.vue'

export default {
  name: 'AdminCampaigns',
  components: { Navbar }
}
</script>
