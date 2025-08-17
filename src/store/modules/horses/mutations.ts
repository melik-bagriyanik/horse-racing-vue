import type { Horse } from '../../types'
import { generateHorseList } from './utils'

// At yönetimi için mutations (state değişiklikleri)
export const mutations = {
  GENERATE_HORSES(state: any) {
    state.horses = generateHorseList()
  },

  // Yarışan atları günceller
  SET_RACING_HORSES(state: any, horses: Horse[]) {
    state.racingHorses = horses
  },

  // Tüm atları sıfırlar (reset işlemi için)
  RESET_HORSES(state: any) {
    state.racingHorses = []
    state.finishedHorses = []
    state.horses.forEach((horse: any) => {
      horse.isRacing = false
      horse.position = 0
      horse.lane = undefined
      horse.hasFinished = false
      horse.finishPosition = undefined
    })
  },
}
