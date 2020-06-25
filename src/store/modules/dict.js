import { getTripImportTemp } from '@/api/pub/combo'

const combo = {
  state: {
    tripImportTemp: [],
  },

  mutations: {
    SET_TRIP_IMPORT_TEMP: (state, temp) => {
      state.tripImportTemp = temp
    },
  },

  actions: {
    GetTripImportTemp({ commit }) {
      return new Promise((resolve, reject) => {
        getTripImportTemp().then(response => {
          commit('SET_TRIP_IMPORT_TEMP', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default combo
