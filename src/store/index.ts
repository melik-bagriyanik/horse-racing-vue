import { createStore, Store } from 'vuex'
import type { State } from './types'
import horses from './modules/horses/index'
import race from './modules/race/index'

const store: Store<State> = createStore({
  modules: {
    horses, // At yönetimi (oluşturma, listeleme, sıfırlama)
    race, // Yarış yönetimi (program oluşturma, yarış çalıştırma, sonuçlar)
  },

  // Global getters - component'lerin kolay erişimi için
  getters: {
    horses: (state) => state.horses.horses, // Tüm atlar
    racingHorses: (state) => state.horses.racingHorses, // Yarışan atlar
    isRaceActive: (state) => state.race.isRaceActive, // Yarış aktif mi?
    currentRound: (state) => state.race.currentRound, // Şu anki tur
    roundResults: (state) => (roundId: number) => state.race.raceResults[roundId] || [], // Tur sonuçları
    allRoundResults: (state) => ({ ...state.race.raceResults }), // Tüm sonuçlar
    activeRound: (state) => state.race.rounds.find((r: any) => r.isActive), // Aktif tur bilgisi
    availableHorses: (state) => state.horses.horses.filter((horse: any) => !horse.isRacing), // Yarışmayan atlar
  },
})

export default store
