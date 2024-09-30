<template>
  <div class="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
    <form @submit.prevent="loginUser" class="w-full max-w-sm">
      <!-- Username Input -->
      <div class="mb-4">
        <label class="block text-gray-700">Username</label>
        <input v-model="username" type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your username" />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700">Password</label>
        <input v-model="password" type="password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your password" />
      </div>
      <button type="submit"
        class="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600">
        Login
      </button>
    </form>
    <!-- Link to Register -->
    <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    <p v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</p>
    <p class="mt-6 text-center text-gray-600">
      Don't have an account? 
      <router-link to="/register" class="text-indigo-500 hover:underline">Register</router-link>
    </p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase.js'; // Adjust path as necessary

export default {
  name: 'Login',
  setup() {
    const store = useStore();
    console.log('store ', store);

    const username = ref('');
    const password = ref('');
    const error = ref(null);
    const successMessage = ref(null);
    const router = useRouter();

    const loginUser = async () => {
      try {
        const { data, error: loginError } = await supabase
          .from('users')
          .select('*')
          .eq('username', username.value)
          .eq('password', password.value)
          .single(); // Use single() to get a single record

        if (loginError || !data) {
          console.error('Error logging in:', loginError);
          error.value = 'Invalid username or password.'; // Display the error message
          successMessage.value = null; // Clear any previous success message
        } else {
          console.log('Login successful:', data);
          error.value = null; // Clear previous error message
          successMessage.value = 'Login successful! Redirecting to Todos...';

          
          // Redirect to Todos page after 3 seconds
          setTimeout( async() => {
            await store.dispatch('login', { userId: data.id, userName: data.name });
            router.push('/todos'); // Adjust the path as necessary
          }, 1500);
        }
      } catch (err) {
        console.error('An unexpected error occurred:', err);
        error.value = 'An unexpected error occurred. Please try again.';
        successMessage.value = null; // Clear any previous success message
      }
    };

    return {
      username,
      password,
      error,
      successMessage,
      loginUser,
    };
  },
};
</script>

<style scoped>
/* You can add additional styles here if needed */
</style>
