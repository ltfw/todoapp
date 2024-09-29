<template>
  <div class="flex flex-col items-center">
    <h2 class="text-2xl font-bold mb-4">Your Todos</h2>

    <form @submit.prevent="addTodo" class="w-full max-w-md mb-4">
      <input type="text" v-model="newTodo" placeholder="Add a new todo" class="border p-2 mb-2 w-full rounded"
        required />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
        Add Todo
      </button>
    </form>

    <ul class="space-y-2 w-full">
      <li v-for="todo in todos" :key="todo.id"
        class="flex w-100 items-center justify-between p-2 border rounded-lg shadow-sm">
        <div class="flex items-center">
          <input type="checkbox" v-model="todo.completed" @change="toggleCompleted(todo)"
            class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <span :class="{ 'line-through text-gray-500': todo.completed, 'ml-2': true }" class="text-lg">
            {{ todo.task }}
          </span>
        </div>
        <button @click="deleteTodo(todo.id)" class="text-red-500 hover:text-red-700">
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

export default {
  name: 'Todos',
  setup() {
    const newTodo = ref('');
    const todos = ref([]);

    const store = useStore();

    const fetchTodos = async () => {
      const { data, error } = await supabase.from('todos').select('*');
      if (error) {
        console.error('Error fetching todos:', error);
      } else {
        todos.value = data;
      }
    };

    const addTodo = async () => {
      const userId = store.state.userId;
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

    onMounted(fetchTodos);

    return {
      newTodo,
      todos,
      addTodo,
      toggleCompleted,
      deleteTodo,
    };
  },
};
</script>

<style scoped>
/* You can add additional styles here if needed */
</style>