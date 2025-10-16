<template>
  <div class="min-h-screen">
    <Navbar />
    <div class="container mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold mb-8">User Management</h1>
      
      <div class="glass-card p-6">
        <div class="mb-4">
          <input type="text" placeholder="Search users..." class="input-field" />
        </div>
        <p class="text-gray-400">No users found.</p>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../../components/Navbar.vue'

export default {
  name: 'AdminUsers',
  components: { Navbar }
}
</script>
