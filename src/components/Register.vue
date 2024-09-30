<template>
  <div class="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h2 class="text-2xl font-bold mb-4">Register</h2>
    <form @submit.prevent="registerUser" class="w-full max-w-sm">
      <!-- Username Input -->
      <div class="mb-4">
        <label class="block text-gray-700">Username</label>
        <input type="text" v-model="username" placeholder="Username"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
      </div>
      <!-- Name Input -->
      <div class="mb-4">
        <label class="block text-gray-700">Full Name</label>
        <input type="text" v-model="name" placeholder="Full Name"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
      </div>
      <!-- Password Input -->
      <div class="mb-4">
        <label class="block text-gray-700">Password</label>
        <input type="password" v-model="password" placeholder="Password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required minlength="6" />
      </div>
      <!-- Confirm Password Input -->
      <div class="mb-4">
        <label class="block text-gray-700">Confirm Password</label>
        <input type="password" v-model="confirmPassword" placeholder="Confirm Password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required minlength="6" />
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
        Register
      </button>
    </form>
    <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    <p v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</p>
    <p class="mt-6 text-center text-gray-600">
      Already registered?
      <router-link to="/login" class="text-blue-500 hover:underline">
        Login
      </router-link>
    </p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '../supabase.js'; // Adjust path as necessary
import { useRouter } from 'vue-router';
import bcrypt from 'bcryptjs'; // Import bcrypt

export default {
  name: 'Register',
  setup() {
    const username = ref('');
    const name = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const error = ref(null);
    const successMessage = ref(null);
    const router = useRouter();

    const registerUser = async () => {
      // Check if passwords match
      if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match.';
        successMessage.value = null; // Clear any previous success message
        return;
      }

      // Check minimum length
      if (password.value.length < 6) {
        error.value = 'Password must be at least 6 characters long.';
        successMessage.value = null; // Clear any previous success message
        return;
      }

      try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password.value, 10);

        const { data, error: registrationError } = await supabase
          .from('users')
          .insert([{ username: username.value, name: name.value, password: hashedPassword }])
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
          }, 1000);
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
      confirmPassword,
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
