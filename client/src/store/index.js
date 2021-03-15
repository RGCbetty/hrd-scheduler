import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/User'
import * as Cookies from 'js-cookie'
import createPersistedstate from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawer: false,
  },
  mutations: {
    drawer: (state, data) => {
      state.drawer = data
    },
  },
  actions: {},
  modules: {
    users: user,
  },
  plugins: [
    createPersistedstate({
      key: 'xxxxxxxxxx',
      paths: ['users.info', 'users.isJA'],
      storage: {
        getItem: key => Cookies.get(key),
        setItem: (key, value) =>
          Cookies.set(key, value, { expires: 3, secure: false }),
        removeItem: key => Cookies.remove(key),
      },
    }),
  ],
})
