import type { Horse, Round } from '../../types'
import { playRoundStartSound, playHorseFinishSound, startGallopSound, stopAllSounds } from '../sound'
import { HORSES_PER_ROUND, RACE_UPDATE_INTERVAL, ROUND_DELAY } from './constants'
import { selectRandomHorses, calculateHorseSpeed } from './utils'

// Actions - Yarışı başlatma, durdurma, tur geçişi gibi işlemleri yöneten fonksiyonlar
export const actions = {
  // Yarış programını oluşturur (her tur için rastgele atlar seçer)
  generateProgram({ commit, rootState }: any) {
    commit('RESET_RACE')

    for (let roundId = 1; roundId <= 6; roundId++) {
      // Her tur için tüm atlar havuzundan seçim yap
      const availableHorses = [...rootState.horses.horses]
      const selectedHorses = selectRandomHorses(availableHorses, HORSES_PER_ROUND)

      selectedHorses.forEach((horse, index) => {
        horse.lane = index + 1
      })

      commit('SET_ROUND_PROGRAM', { roundId, horses: selectedHorses })
    }

    const firstRoundHorses = rootState.race.roundPrograms[1] || []
    commit('horses/SET_RACING_HORSES', firstRoundHorses, { root: true })
    commit('SET_RACE_ACTIVE', false)
  },

  // Yarışı başlatır
  startRace({ commit, state, dispatch, rootState }: any) {
    if (rootState.horses.racingHorses.length === 0) return

    const wasPaused = state.isPaused
    commit('SET_RACE_ACTIVE', true)
    state.isPaused = false

    if (!wasPaused) {
      commit('SET_ROUND_ACTIVE', { roundId: state.currentRound, isActive: true })
    }
    
    // Gallop sesini başlat (hem yeni yarış hem de duraklatılmış yarıştan devam için)
    startGallopSound()

    dispatch('runRound', { roundId: state.currentRound, wasPaused })
  },

  // Belirtilen turu çalıştırır (yarış animasyonu ve sonuç hesaplama)
  runRound(
    { commit, state, dispatch, rootState }: any,
    params: { roundId: number; wasPaused?: boolean },
  ) {
    const { roundId, wasPaused = false } = params
    const round = state.rounds.find((r: Round) => r.id === roundId)
    if (!round) return

    // Eğer yeni tur başlıyorsa (duraklatılmıştan devam etmiyorsa) atları sıfırla
    if (!wasPaused) {
      const racingHorses = rootState.horses.racingHorses
      racingHorses.forEach((horse: Horse) => {
        horse.position = 0 // Başlangıç pozisyonu
        horse.hasFinished = false // Yarışı bitirmemiş
        horse.finishPosition = undefined // Bitiş pozisyonu yok
      })
      rootState.horses.finishedHorses = [] // Bitiren atlar listesini temizle

      // Round başlama sesi çal
      playRoundStartSound()
    }

    commit('SET_ROUND_ACTIVE', { roundId, isActive: true })

    // Yarış animasyonu için interval başlat
    state.raceInterval = setInterval(() => {
      let allFinished = true

      // Her atı hareket ettir
      rootState.horses.racingHorses.forEach((horse: Horse) => {
        if (horse.position < 100) {
          // Henüz bitiş çizgisini geçmemiş
          const speed = calculateHorseSpeed(horse) // Atın hızını hesapla
          horse.position = Math.min(100, horse.position + speed) // Pozisyonu güncelle

          // At bitiş çizgisini geçti mi?
          if (horse.position >= 100 && !horse.hasFinished) {
            horse.hasFinished = true // Yarışı bitirdi
            horse.finishPosition = rootState.horses.finishedHorses.length + 1 // Bitiş sırası
            rootState.horses.finishedHorses.push(horse) // Bitiren atlar listesine ekle

            // At bitiş sesi çal
            playHorseFinishSound()

            // Sonuçları gerçek zamanlı güncelle
            const currentResults = [...rootState.horses.finishedHorses].sort(
              (a, b) => (a.finishPosition || 0) - (b.finishPosition || 0),
            )
            commit('SET_ROUND_RESULTS', { roundId, results: currentResults })
          }

          if (horse.position < 100) {
            allFinished = false // Hala bitirmeyen at var
          }
        }
      })

      // Tüm atlar bitti mi?
      if (allFinished) {
        clearInterval(state.raceInterval!) // Interval'ı durdur
        state.raceInterval = null

        // Final sonuçları zaten finishedHorses array'inde doğru sırada
        // Ek bir sıralama yapmaya gerek yok
        commit('SET_ROUND_ACTIVE', { roundId, isActive: false })

        // Sonraki tura geç veya yarışı bitir
        if (roundId < 6) {
          setTimeout(() => {
            commit('SET_CURRENT_ROUND', roundId + 1) // Sonraki turu aktif et
            dispatch('selectHorsesForRound', roundId + 1) // Sonraki turun atlarını seç
            dispatch('runRound', { roundId: roundId + 1, wasPaused: false }) // Sonraki turu başlat
          }, ROUND_DELAY) // 2 saniye bekle
        } else {
          commit('SET_RACE_ACTIVE', false) // Tüm turlar bitti
          // Tüm sesleri durdur
          stopAllSounds()
        }
      }
    }, RACE_UPDATE_INTERVAL) // Her 100ms'de bir güncelle
  },

  // Belirtilen tur için atları seçer ve yarışa hazırlar
  selectHorsesForRound({ commit, state }: any, roundId: number) {
    const roundHorses = state.roundPrograms[roundId] || []
    roundHorses.forEach((horse: Horse) => {
      horse.position = 0
    })
    commit('horses/SET_RACING_HORSES', roundHorses, { root: true })
  },

  // Yarışı duraklatır
  pauseRace({ commit, state }: any) {
    commit('SET_RACE_ACTIVE', false)
    state.isPaused = true
    if (state.raceInterval) {
      clearInterval(state.raceInterval)
      state.raceInterval = null
    }
    // Tüm sesleri durdur
    stopAllSounds()
  },

  // Yarışı sıfırlar
  resetRace({ commit }: any) {
    commit('RESET_RACE')
    commit('horses/RESET_HORSES', null, { root: true })
    // Tüm sesleri durdur
    stopAllSounds()
  },
}
