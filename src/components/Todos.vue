<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
    <!-- Add Todo Form -->
    <div class="mb-6 p-4 bg-white shadow-md rounded-lg">
      <h3 class="text-lg font-semibold mb-4">Add a New Todo</h3>
      <form @submit.prevent="addTodo" class="flex flex-col space-y-4">
        <input v-model="newTodo" type="text" placeholder="Add a new task..." class="border rounded-lg p-2" required />

        <input v-model="dueDate" type="datetime-local" class="border rounded-lg p-2" required />

        <select v-model="priority" class="border rounded-lg p-2" required>
          <option value="" disabled>Select priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

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
          <li v-for="todo in incompleteTodos" :key="todo.id">
            <div :class="isOverdue(todo.due_date) ? 'bg-red-300' : 'bg-white'" class="p-4 shadow-md rounded-lg flex justify-between items-center">
              <div class="flex items-center">
                <input type="checkbox" v-model="todo.completed" @change="toggleCompleted(todo)"
                  class="form-checkbox h-6 w-6 text-indigo-600" />
                <span class="ml-4 text-lg">{{ todo.task }}</span>
                <span class="ml-4 text-sm text-gray-500">Due: {{ formatDueDate(todo.due_date) }}</span>
                <span class="ml-4 text-sm text-gray-500">Priority: {{ todo.priority }}</span>
              </div>
              <button @click="deleteTodo(todo.id)" class="text-red-500 hover:text-red-700">
                Delete
              </button>
            </div>
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
          <li v-for="todo in completedTodos" :key="todo.id">
            <div class="p-4 shadow-md rounded-lg flex justify-between items-center">
              <div class="flex items-center">
                <input type="checkbox" v-model="todo.completed" @change="toggleCompleted(todo)"
                  class="form-checkbox h-6 w-6 text-green-600" />
                <span class="ml-4 text-lg line-through text-gray-500">{{ todo.task }}</span>
                <span class="ml-4 text-sm text-gray-500">Due: {{ formatDueDate(todo.due_date) }}</span>
                <span class="ml-4 text-sm text-gray-500">Priority: {{ todo.priority }}</span>
              </div>
              <button @click="deleteTodo(todo.id)" class="text-red-500 hover:text-red-700">
                Delete
              </button>
            </div>
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
    const dueDate = ref('');
    const priority = ref('');
    const todos = ref([]);

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
        .insert([{
          task: newTodo.value,
          user_id: userId,
          completed: false,
          due_date: dueDate.value,
          priority: priority.value
        }]);

      if (error) {
        console.error('Error adding todo:', error);
      } else {
        newTodo.value = '';
        dueDate.value = '';
        priority.value = '';
        fetchTodos();
      }
    };

    const toggleCompleted = async (todo) => {
      const { data, error } = await supabase
        .from('todos')
        .update({ completed: todo.completed })
        .eq('id', todo.id);

      if (error) {
        console.error('Error updating todo:', error);
      } else {
        fetchTodos();
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
        fetchTodos();
      }
    };

    const formatDueDate = (dueDate) => {
      return new Date(dueDate).toLocaleString(); // Format to include time
    };

    const isOverdue = (dueDate) => {
      console.log('dueDate ',new Date(dueDate));
      console.log('new Date() ',new Date());
      console.log('new Date() ',new Date(dueDate) < new Date());
      
      return dueDate && new Date(dueDate) < new Date(); // Check if the due date is before the current date
    };

    onMounted(fetchTodos);

    // Priority order mapping
    const priorityOrder = {
      high: 1,
      medium: 2,
      low: 3,
    };

    // Computed property for sorted todos
    const sortedTodos = computed(() => {
      return todos.value.slice().sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    });

    // Computed properties for incomplete and completed todos
    const incompleteTodos = computed(() => {
      return sortedTodos.value.filter(todo => !todo.completed);
    });

    const completedTodos = computed(() => {
      return sortedTodos.value.filter(todo => todo.completed);
    });

    return {
      newTodo,
      dueDate,
      priority,
      todos,
      addTodo,
      toggleCompleted,
      deleteTodo,
      incompleteTodos,
      completedTodos,
      formatDueDate,
      isOverdue,
    };
  },
};
</script>

<style scoped>
/* You can add additional styles here if needed */
</style>
