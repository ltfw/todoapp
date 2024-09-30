<template>
  <div class="flex flex-col items-center">
    <h2 class="text-2xl font-bold mb-4">Register</h2>
    <form @submit.prevent="registerUser" class="w-full max-w-sm">
      <!-- Username Input -->
      <input
        type="text"
        v-model="username"
        placeholder="Username"
        class="border p-2 mb-4 w-full rounded"
        required
      />
      <!-- Name Input -->
      <input
        type="text"
        v-model="name"
        placeholder="Name"
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
        Register
      </button>
    </form>
    <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    <p v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</p>
    <p class="mt-6 text-center text-gray-600">
      Already registered? 
      <router-link 
        to="/login" 
        class="text-blue-500 hover:underline"
      >
        Login
      </router-link>
    </p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '../supabase.js'; // Adjust path as necessary
import { useRouter } from 'vue-router';

export default {
  name: 'Register',
  setup() {
    const username = ref('');
    const name = ref('');
    const password = ref('');
    const error = ref(null);
    const successMessage = ref(null);
    const router = useRouter();

    const registerUser = async () => {
      try {
        const { data, error: registrationError } = await supabase
          .from('users')
          .insert([{ username: username.value, name: name.value, password: password.value }])
          .select();

        if (registrationError) {
          console.error('Error registering user:', registrationError);
          error.value = registrationError.message; // Display the error message
          successMessage.value = null; // Clear any previous success message
        } else {
          console.log('Registration successful:', data);
          error.value = null; // Clear previous error message
          successMessage.value = 'Registration successful! Redirecting to login...';
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
      } catch (err) {
        console.error('An unexpected error occurred:', err);
        error.value = 'An unexpected error occurred. Please try again.';
        successMessage.value = null; // Clear any previous success message
      }
    };

    return {
      username,
      name,
      password,
      error,
      successMessage,
      registerUser,
    };
  },
};
</script>

<style scoped>
/* You can add additional styles here if needed */
</style>
