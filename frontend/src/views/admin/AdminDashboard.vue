<template>
  <div class="min-h-screen">
    <Navbar />
    <div class="container mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div class="grid md:grid-cols-4 gap-6 mb-12">
        <div class="glass-card p-6">
          <h3 class="text-gray-400 mb-2">Total Users</h3>
          <div class="text-3xl font-bold text-cyber-blue">0</div>
        </div>
        <div class="glass-card p-6">
          <h3 class="text-gray-400 mb-2">Total Campaigns</h3>
          <div class="text-3xl font-bold text-cyber-purple">0</div>
        </div>
        <div class="glass-card p-6">
          <h3 class="text-gray-400 mb-2">Completed Results</h3>
          <div class="text-3xl font-bold text-cyber-green">0</div>
        </div>
        <div class="glass-card p-6">
          <h3 class="text-gray-400 mb-2">Avg Score</h3>
          <div class="text-3xl font-bold text-cyber-pink">0%</div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="glass-card p-6">
          <h2 class="text-2xl font-bold mb-4">Quick Actions</h2>
          <div class="space-y-3">
            <router-link to="/admin/campaigns" class="block btn-primary text-center">
              Manage Campaigns
            </router-link>
            <router-link to="/admin/users" class="block btn-secondary text-center">
              Manage Users
            </router-link>
            <router-link to="/admin/reports" class="block btn-secondary text-center">
              View Reports
            </router-link>
          </div>
        </div>

        <div class="glass-card p-6">
          <h2 class="text-2xl font-bold mb-4">Recent Activity</h2>
          <p class="text-gray-400">No recent activity</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../../components/Navbar.vue'

export default {
  name: 'AdminDashboard',
  components: { Navbar }
}
</script>
