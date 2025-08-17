import type { Horse } from '../../types'

// At yönetimi için state
export const state = {
  horses: [] as Horse[], // Tüm atların listesi
  racingHorses: [] as Horse[], // Şu anda yarışan atlar
  finishedHorses: [] as Horse[], // Yarışı bitiren atlar
}
