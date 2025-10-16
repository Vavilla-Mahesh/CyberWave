import { createStore } from 'vuex'
import axios from 'axios'

const API_URL = '/api'

const store = createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    notification: {
      show: false,
      message: '',
      type: 'success'
    },
    campaigns: [],
    userProgress: null,
    leaderboard: []
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    },
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } else {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      }
    },
    SHOW_NOTIFICATION(state, { message, type = 'success' }) {
      state.notification = { show: true, message, type }
      setTimeout(() => {
        state.notification.show = false
      }, 5000)
    },
    HIDE_NOTIFICATION(state) {
      state.notification.show = false
    },
    SET_CAMPAIGNS(state, campaigns) {
      state.campaigns = campaigns
    },
    SET_USER_PROGRESS(state, progress) {
      state.userProgress = progress
    },
    SET_LEADERBOARD(state, leaderboard) {
      state.leaderboard = leaderboard
    },
    UPDATE_USER_POINTS(state, points) {
      if (state.user) {
        state.user.points = points
      }
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials)
        commit('SET_TOKEN', response.data.token)
        commit('SET_USER', response.data.user)
        commit('SHOW_NOTIFICATION', { message: 'Login successful!', type: 'success' })
        return response.data
      } catch (error) {
        commit('SHOW_NOTIFICATION', { 
          message: error.response?.data?.error || 'Login failed', 
          type: 'error' 
        })
        throw error
      }
    },
    
    async register({ commit }, userData) {
      try {
        const response = await axios.post(`${API_URL}/auth/register`, userData)
        commit('SET_TOKEN', response.data.token)
        commit('SET_USER', response.data.user)
        commit('SHOW_NOTIFICATION', { message: 'Registration successful!', type: 'success' })
        return response.data
      } catch (error) {
        commit('SHOW_NOTIFICATION', { 
          message: error.response?.data?.error || 'Registration failed', 
          type: 'error' 
        })
        throw error
      }
    },
    
    logout({ commit }) {
      commit('SET_TOKEN', null)
      commit('SET_USER', null)
      commit('SHOW_NOTIFICATION', { message: 'Logged out successfully', type: 'info' })
    },
    
    async fetchUserProfile({ commit, state }) {
      try {
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        commit('SET_USER', response.data.user)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    },
    
    async fetchCampaigns({ commit, state }) {
      try {
        const response = await axios.get(`${API_URL}/campaigns`, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        commit('SET_CAMPAIGNS', response.data.campaigns)
      } catch (error) {
        console.error('Failed to fetch campaigns:', error)
      }
    },
    
    async fetchUserProgress({ commit, state }) {
      try {
        const response = await axios.get(`${API_URL}/users/progress`, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        commit('SET_USER_PROGRESS', response.data)
      } catch (error) {
        console.error('Failed to fetch progress:', error)
      }
    },
    
    async fetchLeaderboard({ commit, state }) {
      try {
        const response = await axios.get(`${API_URL}/analytics/leaderboard`, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        commit('SET_LEADERBOARD', response.data.leaderboard)
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
      }
    },
    
    async submitResult({ commit, state }, resultData) {
      try {
        const response = await axios.post(`${API_URL}/results`, resultData, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        commit('UPDATE_USER_POINTS', response.data.totalPoints)
        commit('SHOW_NOTIFICATION', { 
          message: `Great job! You earned ${response.data.pointsEarned} points!`, 
          type: 'success' 
        })
        return response.data
      } catch (error) {
        commit('SHOW_NOTIFICATION', { 
          message: 'Failed to submit result', 
          type: 'error' 
        })
        throw error
      }
    }
  },
  
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.user,
    isAdmin: state => state.user?.role === 'admin',
    userPoints: state => state.user?.points || 0,
    userBadges: state => state.user?.badges || [],
    completedModules: state => state.user?.completed_modules || []
  }
})

// Initialize axios with token if it exists
if (store.state.token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.token}`
}

export default store
