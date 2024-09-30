<template>
  <div class="max-w-4xl mx-auto">
    <!-- Add Todo Form -->
    <div class="mb-6 p-4 bg-white shadow-md rounded-lg">
      <h3 class="text-lg font-semibold mb-4">Add a New Todo</h3>
      <form @submit.prevent="addTodo" class="flex space-x-4">
        <input
          v-model="newTodo"
          type="text"
          placeholder="Add a new task..."
          class="flex-grow border rounded-lg p-2"
        />
        <button
          type="submit"
          class="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600"
        >
          Add
        </button>
      </form>
    </div>

    <!-- Todos List -->
    <ul class="space-y-4">
      <li
        v-for="todo in todos"
        :key="todo.id"
        class="p-4 bg-white shadow-md rounded-lg flex justify-between items-center"
      >
        <div class="flex items-center">
          <input
            type="checkbox"
            v-model="todo.completed"
            @change="toggleCompleted(todo)"
            class="form-checkbox h-6 w-6 text-indigo-600"
          />
          <span :class="{'line-through text-gray-500': todo.completed}" class="ml-4 text-lg">
            {{ todo.task }}
          </span>
        </div>
        <button
          @click="deleteTodo(todo.id)"
          class="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { supabase } from '../supabase.js'; // Adjust path as necessary
import { useRouter } from 'vue-router';

export default {
  name: 'Todos',
  setup() {
    const store = useStore();
    const router = useRouter();
    const newTodo = ref('');
    const todos = ref([]);

    const userName = store.state.userName || 'User';
    const userId = store.state.userId;

    const fetchTodos = async () => {
      const { data, error } = await supabase.from('todos').select('*').eq('user_id', userId);
      if (error) {
        console.error('Error fetching todos:', error);
      } else {
        todos.value = data;
      }
    };

    const addTodo = async () => {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ task: newTodo.value, user_id: userId, completed: false }]); // Replace 'USER_ID_HERE' with actual user ID

      if (error) {
        console.error('Error adding todo:', error);
      } else {
        newTodo.value = ''; // Clear input field
        fetchTodos(); // Refresh the todos list
      }
    };

    const toggleCompleted = async (todo) => {
      console.log('Toggling:', todo); // Debugging line
      console.log('todo.id:', todo.id); // Debugging line
      console.log('!todo.completed:', todo.completed); // Debugging line
      const { data, error } = await supabase
        .from('todos')
        .update({ completed: todo.completed }) // Toggle the completed status
        .eq('id', todo.id);

      if (error) {
        console.error('Error updating todo:', error);
      } else {
        fetchTodos(); // Refresh the todos list
      }
    };

    const deleteTodo = async (id) => {
      const { data, error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting todo:', error);
      } else {
        fetchTodos(); // Refresh the todos list
      }
    };

    // Logout function
    const logout = () => {
      store.dispatch('logout'); // Clear the user data from Vuex
      router.push('/login'); // Redirect to login page
    };

    onMounted(fetchTodos);

    return {
      newTodo,
      userName,
      todos,
      addTodo,
      toggleCompleted,
      deleteTodo,
      logout,
    };
  },
};
</script>

<style scoped>
/* You can add additional styles here if needed */
</style>