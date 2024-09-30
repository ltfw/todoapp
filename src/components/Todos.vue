<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 ">
    <!-- Add Todo Form -->
    <div class="mb-6 p-4 bg-white shadow-md rounded-lg">
      <h3 class="text-lg font-semibold mb-4">Add a New Todo</h3>
      <form @submit.prevent="addTodo" class="flex space-x-4">
        <input v-model="newTodo" type="text" placeholder="Add a new task..." class="flex-grow border rounded-lg p-2"
          required />
        <button type="submit" class="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600">
          Add
        </button>
      </form>
    </div>

    <!-- Incomplete Tasks Section -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-4">Incomplete Tasks</h3>
      <ul class="space-y-4">
        <template v-if="incompleteTodos.length">
          <li v-for="todo in incompleteTodos" :key="todo.id"
            class="p-4 bg-white shadow-md rounded-lg flex justify-between items-center">
            <div class="flex items-center">
              <input type="checkbox" v-model="todo.completed" @change="toggleCompleted(todo)"
                class="form-checkbox h-6 w-6 text-indigo-600" />
              <span class="ml-4 text-lg">{{ todo.task }}</span>
            </div>
            <button @click="deleteTodo(todo.id)" class="text-red-500 hover:text-red-700">
              Delete
            </button>
          </li>
        </template>
        <template v-else>
          <li class="p-4 bg-white shadow-md rounded-lg text-center text-gray-500">
            There are no incomplete tasks.
          </li>
        </template>
      </ul>
    </div>

    <!-- Completed Tasks Section -->
    <div>
      <h3 class="text-lg font-semibold mb-4">Completed Tasks</h3>
      <ul class="space-y-4">
        <template v-if="completedTodos.length"> 
          <li v-for="todo in completedTodos" :key="todo.id"
            class="p-4 bg-gray-100 shadow-md rounded-lg flex justify-between items-center">
            <div class="flex items-center">
              <input type="checkbox" v-model="todo.completed" @change="toggleCompleted(todo)"
                class="form-checkbox h-6 w-6 text-green-600" />
              <span class="ml-4 text-lg line-through text-gray-500">{{ todo.task }}</span>
            </div>
            <button @click="deleteTodo(todo.id)" class="text-red-500 hover:text-red-700">
              Delete
            </button>
          </li>
        </template>
        <template v-else>
          <li class="p-4 bg-white shadow-md rounded-lg text-center text-gray-500">
            There are no complete tasks.
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
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

    // Computed properties for incomplete and completed todos
    const incompleteTodos = computed(() => {
      return todos.value.filter(todo => !todo.completed);
    });

    const completedTodos = computed(() => {
      return todos.value.filter(todo => todo.completed);
    });

    return {
      newTodo,
      userName,
      todos,
      addTodo,
      toggleCompleted,
      deleteTodo,
      logout,
      incompleteTodos,
      completedTodos,
    };
  },
};
</script>

<style scoped>
/* You can add additional styles here if needed */
</style>