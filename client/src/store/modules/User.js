// import axios from 'axios'
export default {
  namespaced: true,

  state: () => ({
    status: false,
    token: localStorage.getItem('token') || '',
    info: {},
    isJA: false,
  }),
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    // userInfo: state=> state.user
  },
  //DISPATCH
  actions: {
    async loginJA({ commit }, load) {
      try {
        commit('auth_request')
        let res = await load.axios.post(
          `${process.env.VUE_APP_URL}/auth/loginJA`,
          load.user,
        )
        console.log(res)
        const payload = res.data
        localStorage.setItem('token', payload.accessToken)
        load.axios.defaults.headers.common['x-access-token'] =
          payload.accessToken
        commit('auth_success', payload)
      } catch (err) {
        commit('auth_error')
        localStorage.removeItem('token')
        alert(err)
      }
    },
    async login({ commit }, load) {
      try {
        commit('auth_request')
        let res = await load.axios.post(
          // http://10.169.141.101:6080/api/login?empCode=38610
          `${process.env.VUE_APP_URL}/auth/login?empCode=${load.user.name}`,
          load.user,
        )
        const payload = res.data
        localStorage.setItem('token', payload.accessToken)
        load.axios.defaults.headers.common['x-access-token'] =
          payload.accessToken

        commit('auth_success', payload)
      } catch (err) {
        commit('auth_error')
        localStorage.removeItem('token')
        alert(err)
      }
    },
    logout({ commit }, axios) {
      commit('logout')
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['x-access-token']
    },
    async validateSession({ commit }, axios) {
      try {
        let res = await axios.get(`${process.env.VUE_APP_URL}/auth/validate`, {
          headers: {
            'x-access-token': `${localStorage.setItem('token')}`,
          },
        })
        return res
      } catch (err) {
        commit('auth_error')
      }
    },
  },
  //COMMIT
  mutations: {
    auth_request(state) {
      state.status = false
    },
    auth_success: (state, payload) => {
      state.status = true
      state.token = payload.accessToken
      // state.user = Object.assign({}, state.user, payload.user)
      state.info = { ...state.info, ...payload.user }
    },
    auth_error(state) {
      state.status = false
    },
    logout(state) {
      state.status = ''
      state.token = ''
    },
    status: (state, data) => {
      state.isJA = data
    },
  },
}
