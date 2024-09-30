<template>
  <div class="flex flex-col items-center">
    <h2 class="text-2xl font-bold mb-4">Login</h2>
    <form @submit.prevent="loginUser" class="w-full max-w-sm">
      <!-- Username Input -->
      <input
        type="text"
        v-model="username"
        placeholder="Username"
        class="border p-2 mb-4 w-full rounded"
        required
      />
      <!-- Password Input -->
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        class="border p-2 mb-4 w-full rounded"
        required
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Login
      </button>
    </form>
    <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    <p v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</p>
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
    console.log('store ',store);

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

          await store.dispatch('login', data.id);
          
          // Redirect to Todos page after 3 seconds
          setTimeout(() => {
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
