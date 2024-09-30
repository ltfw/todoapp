<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header Section -->
    <header class="bg-indigo-600 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <!-- App Title -->
        <h1 class="text-white text-3xl font-bold">To-Do App</h1>
        
        <!-- User Greeting and Logout Button -->
        <div v-if="isLoggedIn" class="flex items-center space-x-4">
          <h2 class="text-white text-lg font-semibold">Hi, {{ userName }}</h2>
          <button
            @click="logout"
            class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto py-8">
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'App',
  computed: {
    // Map Vuex state for user information
    ...mapState({
      userName: state => state.userName,
      isLoggedIn: state => !!state.userId, // Boolean flag to check if logged in
    }),
  },
  methods: {
    logout() {
      this.$store.commit('clearUser'); // Clear user state from Vuex
      this.$router.push('/login'); // Redirect to login page
    },
  },
};
</script>

<style scoped>
/* Additional global styles can go here */
</style>
