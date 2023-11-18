export const state = () => ({
  authUser: null,
  token: null,
  info: {},
  nav: [
    { text: 'Home', to: '/', exact: true, icon: 'mdi-home' }
  ]
})

export const mutations = {
  SET_USER (state, user) {
    state.authUser = user
  },
  SET_TOKEN (state, token) {
    state.token = token
  },
  SET_INFO (state, info) {
    state.info = info
  },
  SET_NAV (state, nav) {
    state.nav = nav
  }
}

export const actions = {
  async login (context, { username, password }) {
    try {
      const { data } = await this.$axios.$post(
        '/gettoken',
        JSON.stringify({
          user: username,
          password
        })
      )
      context.commit('SET_TOKEN', data.jwt)
      localStorage.token = data.jwt
      await context.dispatch('getUserInfo')
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Credenciales ingresadas incorrectas')
      }
      throw error
    }
  },

  logout ({ commit }) {
    commit('SET_USER', null)
  },

  async getUserInfo (context) {
    try {
      const { data } = await this.$axios.$post(
        '/users/users/getuserinfo',
        JSON.stringify({
          id: '_ME'
        }),
        {
          headers: {
            Authorization: 'Bearer ' + context.state.token,
            'Content-Type': 'application/json'
          }
        }
      )
      context.commit('SET_USER', data)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  reset_token ({ commit }) {
    commit('SET_USER', null)
  },

  async validate_token (context) {
    try {
      const { data, result } = await this.$axios.$post(
        '/validatetoken',
        null,
        {
          headers: {
            Authorization: 'Bearer ' + context.state.token,
            'Content-Type': 'application/json'
          }
        }
      )
      context.commit('SET_TOKEN', data.newtoken)
      localStorage.token = data.newtoken
      return result
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid token')
      }
      throw error
    }
  },

  resetNav ({ commit }) {
    commit('SET_NAV', [{ text: 'Home', to: '/', exact: true, icon: 'mdi-home' }])
  },

  addToNav ({ state, commit }, payload) {
    let currentNav = state.nav.slice()
    if (Array.isArray(payload)) {
      currentNav = currentNav.concat(payload)
    } else {
      currentNav.push(payload)
    }
    commit('SET_NAV', currentNav)
  },

  removeLastFromNav ({ state, commit }) {
    const currentNav = state.nav.slice(0, -1)
    commit('SET_NAV', currentNav)
  }
}
