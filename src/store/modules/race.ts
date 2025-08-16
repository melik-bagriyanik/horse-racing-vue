import type { Horse, Round } from '../types'

const state = {
  rounds: [
    { id: 1, distance: 1200, isActive: false, results: [] },
    { id: 2, distance: 1400, isActive: false, results: [] },
    { id: 3, distance: 1600, isActive: false, results: [] },
    { id: 4, distance: 1800, isActive: false, results: [] },
    { id: 5, distance: 2000, isActive: false, results: [] },
    { id: 6, distance: 2200, isActive: false, results: [] },
  ] as Round[],
  roundPrograms: {} as { [roundId: number]: Horse[] }, // Her tur için seçilen atlar
  currentRound: 1, // Şu anki aktif tur
  isRaceActive: false, // Yarış aktif mi?
  raceResults: {} as { [roundId: number]: Horse[] }, // Her turun sonuçları
  raceInterval: null as number | null, // Yarış animasyonu için interval
  isPaused: false, // Yarış duraklatıldı mı?
}

// Yarış yönetimi için mutations (state değişiklikleri)
const mutations = {
  // Yarış durumunu günceller
  SET_RACE_ACTIVE(state: any, isActive: boolean) {
    state.isRaceActive = isActive
  },

  // Aktif turu günceller
  SET_CURRENT_ROUND(state: any, round: number) {
    state.currentRound = round
  },

  // Tur sonuçlarını kaydeder
  SET_ROUND_RESULTS(state: any, { roundId, results }: { roundId: number; results: Horse[] }) {
    state.raceResults[roundId] = results
    const round = state.rounds.find((r: any) => r.id === roundId)
    if (round) {
      round.results = results
      round.winner = results[0] // İlk at kazanan
    }
  },

  // Tur durumunu günceller (aktif/pasif)
  SET_ROUND_ACTIVE(state: any, { roundId, isActive }: { roundId: number; isActive: boolean }) {
    const round = state.rounds.find((r: any) => r.id === roundId)
    if (round) {
      round.isActive = isActive
    }
  },

  // Tur programını kaydeder (hangi atlar hangi turda yarışacak)
  SET_ROUND_PROGRAM(state: any, { roundId, horses }: { roundId: number; horses: Horse[] }) {
    state.roundPrograms[roundId] = horses
  },

  // Tüm yarış verilerini sıfırlar
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
    state.rounds.forEach((round: any) => {
      round.isActive = false
      round.results = []
      round.winner = undefined
    })
  },
}

// Yarış yönetimi için actions
const actions = {
  // 6 tur için program oluşturur
  generateProgram({ commit, state, rootState }: any) {
    commit('RESET_RACE')

    // Her tur için 10 rastgele at seç
    for (let roundId = 1; roundId <= 6; roundId++) {
      const availableHorses = [...rootState.horses.horses]
      const selectedHorses: Horse[] = []

      // Bu tur için 10 at seç
      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * availableHorses.length)
        const horse = { ...availableHorses[randomIndex] }
        horse.isRacing = true
        horse.position = 0
        selectedHorses.push(horse)
        availableHorses.splice(randomIndex, 1)
      }

      // Atları alfabetik sıraya koy (program tablosu için)
      selectedHorses.sort((a, b) => a.name.localeCompare(b.name))

      // Her ata şerit numarası ver (1. pozisyon = 1. şerit)
      selectedHorses.forEach((horse, index) => {
        horse.lane = index + 1
      })

      // Bu turun programını kaydet
      commit('SET_ROUND_PROGRAM', { roundId, horses: selectedHorses })
    }

    // İlk turun atlarını aktif yarışan atlar olarak ayarla
    const firstRoundHorses = state.roundPrograms[1] || []
    commit('horses/SET_RACING_HORSES', firstRoundHorses, { root: true })
    commit('SET_RACE_ACTIVE', false) // Yarışı başlatma, sadece program hazırla
  },

  // Yarışı başlatır veya devam ettirir
  startRace({ commit, state, dispatch, rootState }: any) {
    if (rootState.horses.racingHorses.length === 0) return

    const wasPaused = state.isPaused
    commit('SET_RACE_ACTIVE', true)
    state.isPaused = false

    // Eğer duraklatılmıştan devam ediyorsa pozisyonları sıfırlama
    if (!wasPaused) {
      commit('SET_ROUND_ACTIVE', { roundId: state.currentRound, isActive: true })
    }

    // Bu turu çalıştır
    dispatch('runRound', { roundId: state.currentRound, wasPaused })
  },

  // Belirli bir turu çalıştırır (animasyon ve sonuç hesaplama)
  runRound(
    { commit, state, dispatch, rootState }: any,
    params: { roundId: number; wasPaused?: boolean },
  ) {
    const { roundId, wasPaused = false } = params
    const round = state.rounds.find((r: any) => r.id === roundId)
    if (!round) return

    // Eğer yeni tur başlıyorsa (duraklatılmıştan devam etmiyorsa) pozisyonları sıfırla
    if (!wasPaused) {
      const racingHorses = rootState.horses.racingHorses
      racingHorses.forEach((horse: any) => {
        horse.position = 0
        horse.hasFinished = false
        horse.finishPosition = undefined
      })
      rootState.horses.finishedHorses = []
    }

    commit('SET_ROUND_ACTIVE', { roundId, isActive: true })

    // Yarış animasyonu için interval başlat
    state.raceInterval = setInterval(() => {
      let allFinished = true

      // Her atı hareket ettir
      rootState.horses.racingHorses.forEach((horse: any) => {
        if (horse.position < 100) {
          // Atın hızını hesapla (kondisyon + rastgele faktör)
          const baseSpeed = (horse.condition / 100) * 1.5
          const randomFactor = 0.5 + Math.random() * 1.0
          const speed = baseSpeed * randomFactor
          horse.position = Math.min(100, horse.position + speed)

          // At bitiş çizgisini geçti mi?
          if (horse.position >= 100 && !horse.hasFinished) {
            horse.hasFinished = true
            horse.finishPosition = rootState.horses.finishedHorses.length + 1
            rootState.horses.finishedHorses.push(horse)

            // Sonuçları gerçek zamanlı güncelle
            const currentResults = [...rootState.horses.finishedHorses].sort(
              (a, b) => a.finishPosition - b.finishPosition,
            )
            commit('SET_ROUND_RESULTS', { roundId, results: currentResults })
          }

          if (horse.position < 100) {
            allFinished = false
          }
        } else {
          horse.position = 100
        }
      })

      // Tüm atlar bitti mi?
      if (allFinished) {
        clearInterval(state.raceInterval!)
        state.raceInterval = null

        // Final sonuçları hesapla
        const sortedResults = [...rootState.horses.racingHorses].sort(
          (a, b) => b.position - a.position,
        )
        const resultsCopy = sortedResults.map((horse) => ({
          id: horse.id,
          name: horse.name,
          condition: horse.condition,
          color: horse.color,
          position: horse.position,
          isRacing: horse.isRacing,
          lane: horse.lane,
        }))

        commit('SET_ROUND_RESULTS', { roundId, results: resultsCopy })
        commit('SET_ROUND_ACTIVE', { roundId, isActive: false })

        // Sonraki tura geç veya yarışı bitir
        if (roundId < 6) {
          setTimeout(() => {
            commit('SET_CURRENT_ROUND', roundId + 1)
            dispatch('selectHorsesForRound', roundId + 1)
            dispatch('runRound', { roundId: roundId + 1, wasPaused: false })
          }, 2000) // 2 saniye bekle
        } else {
          commit('SET_RACE_ACTIVE', false) // Tüm turlar bitti
        }
      }
    }, 100) // Her 100ms'de bir güncelle
  },

  // Belirli bir tur için atları seçer
  selectHorsesForRound({ commit, state }: any, roundId: number) {
    const roundHorses = state.roundPrograms[roundId] || []

    // Atların pozisyonlarını sıfırla
    roundHorses.forEach((horse: any) => {
      horse.position = 0
    })

    // Bu turun atlarını aktif yarışan atlar olarak ayarla
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
  },

  // Tüm yarışı sıfırlar
  resetRace({ commit }: any) {
    commit('RESET_RACE')
    commit('horses/RESET_HORSES', null, { root: true })
  },
}

// Yarış yönetimi için getters (hesaplanmış değerler)
const getters = {
  isRaceActive: (state: any) => state.isRaceActive, // Yarış aktif mi?
  currentRound: (state: any) => state.currentRound, // Şu anki tur
  roundResults: (state: any) => (roundId: number) => state.raceResults[roundId] || [], // Belirli turun sonuçları
  allRoundResults: (state: any) => ({ ...state.raceResults }), // Tüm tur sonuçları
  activeRound: (state: any) => state.rounds.find((r: any) => r.isActive), // Aktif tur bilgisi
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
