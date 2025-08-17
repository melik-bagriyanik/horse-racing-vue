import type { Horse, Round } from '../types'
import { playRoundStartSound, playHorseFinishSound, startGallopSound, stopGallopSound } from './sound'

// Sabitler - Yarış simülasyonu için gerekli sabit değerler
const ROUNDS_CONFIG = [
  { id: 1, distance: 1200 },
  { id: 2, distance: 1400 },
  { id: 3, distance: 1600 },
  { id: 4, distance: 1800 },
  { id: 5, distance: 2000 },
  { id: 6, distance: 2200 },
] as const

const HORSES_PER_ROUND = 10 // Her turda yarışacak at sayısı
const RACE_UPDATE_INTERVAL = 100 // Yarış animasyonu güncelleme sıklığı (ms)
const ROUND_DELAY = 2000 // Turlar arası bekleme süresi (ms)

// State - Yarış modülünün durum bilgileri
const state = {
  rounds: ROUNDS_CONFIG.map((config) => ({
    ...config,
    isActive: false, // Tur aktif mi?
    results: [] as Horse[], // Tur sonuçları
    winner: undefined as Horse | undefined, // Tur kazananı
  })) as Round[],
  roundPrograms: {} as { [roundId: number]: Horse[] }, // Her tur için seçilen atlar
  currentRound: 1, // Şu anki aktif tur
  isRaceActive: false, // Yarış aktif mi?
  raceResults: {} as { [roundId: number]: Horse[] }, // Tüm tur sonuçları
  raceInterval: null as number | null, // Yarış animasyonu için interval ID
  isPaused: false, // Yarış duraklatıldı mı?
}

// Mutations - State değişikliklerini yapan fonksiyonlar
const mutations = {
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

    // Gallop sesini durdur
    stopGallopSound()
  },
}

// Yardımcı fonksiyonlar - Karmaşık işlemleri basitleştiren fonksiyonlar
const selectRandomHorses = (availableHorses: Horse[], count: number): Horse[] => {
  const horses = [...availableHorses] // Mevcut atların kopyasını al
  const selected: Horse[] = []

  // Belirtilen sayıda rastgele at seç
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * horses.length)
    const horse = { ...horses[randomIndex] } // Atın kopyasını al
    horse.isRacing = true // Yarışa katılıyor olarak işaretle
    horse.position = 0 // Başlangıç pozisyonu
    selected.push(horse)
    horses.splice(randomIndex, 1) // Seçilen atı listeden çıkar
  }

  // Atları alfabetik sıraya koy (program tablosu için)
  return selected.sort((a, b) => a.name.localeCompare(b.name))
}

const calculateHorseSpeed = (horse: Horse): number => {
  // Atın hızını hesapla (kondisyon + rastgele faktör)
  const baseSpeed = (horse.condition / 100) * 1.5 // Kondisyona göre temel hız
  const randomFactor = 0.5 + Math.random() * 1.0 // Rastgele faktör (0.5-1.5)
  return baseSpeed * randomFactor
}

// Actions - Yarışı başlatma, durdurma, tur geçişi gibi işlemleri yöneten fonksiyonlar
const actions = {
  // Yarış programını oluşturur (her tur için rastgele atlar seçer)
  generateProgram({ commit, rootState }: any) {
    commit('RESET_RACE')

    for (let roundId = 1; roundId <= 6; roundId++) {
      const availableHorses = [...rootState.horses.horses]
      const selectedHorses = selectRandomHorses(availableHorses, HORSES_PER_ROUND)

      selectedHorses.forEach((horse, index) => {
        horse.lane = index + 1
      })

      commit('SET_ROUND_PROGRAM', { roundId, horses: selectedHorses })
    }

    const firstRoundHorses = state.roundPrograms[1] || []
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
          // Gallop sesini durdur
          stopGallopSound()
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
    // Gallop sesini durdur
    stopGallopSound()
  },

  // Yarışı sıfırlar
  resetRace({ commit }: any) {
    commit('RESET_RACE')
    commit('horses/RESET_HORSES', null, { root: true })
    // Gallop sesini durdur
    stopGallopSound()
  },
}

// Getters - Yarış durumunu ve sonuçları kontrol etmek için kullanılan fonksiyonlar
const getters = {
  isRaceActive: (state: any) => state.isRaceActive, // Yarış aktif mi? (true/false)
  currentRound: (state: any) => state.currentRound, // Şu anki aktif tur (1-6)
  roundResults: (state: any) => (roundId: number) => state.raceResults[roundId] || [], // Belirli turun sonuçları
  allRoundResults: (state: any) => ({ ...state.raceResults }), // Tüm tur sonuçları (kopya)
  activeRound: (state: any) => state.rounds.find((r: Round) => r.isActive), // Aktif tur bilgisi
}

// Race modülünü export et - Vuex store'a dahil edilecek
export default {
  namespaced: true, // Modül ad alanı kullan (race/action şeklinde çağrılır)
  state, // State tanımları
  mutations, // State değişiklikleri
  actions, // Karmaşık işlemler
  getters, // Hesaplanmış değerler
}
