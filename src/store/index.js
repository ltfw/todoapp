import { createStore } from 'vuex';

const store = createStore({
  state: {
    userId: localStorage.getItem('userId') || null,
    userName: localStorage.getItem('userName') || null,
  },
  mutations: {
    setUser(state, { userId, userName }) {
      state.userId = userId;
      state.userName = userName;
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', userName);
    },
    clearUser(state) {
      state.userId = null;
      state.userName = null;
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
    },
  },
  actions: {
    login({ commit }, { userId, userName }) {
      commit('setUser', { userId, userName });
    },
    logout({ commit }) {
      commit('clearUser');
    },
  },
});

export default store;
