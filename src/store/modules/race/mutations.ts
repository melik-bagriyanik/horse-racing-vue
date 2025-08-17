import type { Horse, Round } from '../../types'
import { stopAllSounds } from '../sound'

// Mutations - State değişikliklerini yapan fonksiyonlar
export const mutations = {
  // Yarış durumunu günceller (başlat/durdur)
  SET_RACE_ACTIVE(state: any, isActive: boolean) {
    state.isRaceActive = isActive
  },

  // Aktif turu değiştirir
  SET_CURRENT_ROUND(state: any, round: number) {
    state.currentRound = round
  },

  // Belirli bir turun sonuçlarını kaydeder
  SET_ROUND_RESULTS(state: any, { roundId, results }: { roundId: number; results: Horse[] }) {
    state.raceResults[roundId] = results
    const round = state.rounds.find((r: Round) => r.id === roundId)
    if (round) {
      round.results = results
      round.winner = results[0] // İlk at kazanan
    }
  },

  // Tur durumunu günceller (aktif/pasif)
  SET_ROUND_ACTIVE(state: any, { roundId, isActive }: { roundId: number; isActive: boolean }) {
    const round = state.rounds.find((r: Round) => r.id === roundId)
    if (round) {
      round.isActive = isActive
    }
  },

  // Tur programını kaydeder (hangi atlar hangi turda yarışacak)
  SET_ROUND_PROGRAM(state: any, { roundId, horses }: { roundId: number; horses: Horse[] }) {
    state.roundPrograms[roundId] = horses
  },

  // Tüm yarış verilerini sıfırlar (reset işlemi için)
  RESET_RACE(state: any) {
    // Aktif interval varsa temizle
    if (state.raceInterval) {
      clearInterval(state.raceInterval)
      state.raceInterval = null
    }

    // Tüm yarış verilerini sıfırla
    state.isRaceActive = false
    state.isPaused = false
    state.currentRound = 1
    state.raceResults = {}
    state.roundPrograms = {}

    // Tüm turları sıfırla
    state.rounds.forEach((round: Round) => {
      round.isActive = false
      round.results = []
      round.winner = undefined
    })

    // Tüm sesleri durdur
    stopAllSounds()
  },
}
