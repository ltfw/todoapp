import { createStore } from 'vuex';

const store = createStore({
  state: {
    userId: localStorage.getItem('userId') || null,
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId;
      localStorage.setItem('userId', userId);
    },
    clearUserId(state) {
      state.userId = null;
      localStorage.removeItem('userId'); // Clear userId from localStorage
    },
  },
  actions: {
    login({ commit }, userId) {
      commit('setUserId', userId);
    },
    logout({ commit }) {
      commit('clearUserId');
    },
  },
});

export default store;
