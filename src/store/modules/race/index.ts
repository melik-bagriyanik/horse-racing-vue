import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

// Race modülünü export et - Vuex store'a dahil edilecek
export default {
  namespaced: true, // Modül ad alanı kullan (race/action şeklinde çağrılır)
  state, // State tanımları
  mutations, // State değişiklikleri
  actions, // Karmaşık işlemler
  getters, // Hesaplanmış değerler
}
