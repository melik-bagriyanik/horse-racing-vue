import { describe, it, expect, beforeEach } from 'vitest'
import { createStore } from 'vuex'

describe('Vuex Store Unit Testleri', () => {
  let testStore: any

  // Her testten önce mock store oluşturuluyor
  // Böylece testler birbirini etkilemez ve her zaman temiz bir state ile başlar
  beforeEach(() => {
    testStore = createStore({
      modules: {
        horses: {
          namespaced: true, // Modül ad alanı sayesinde action/getter çağrısı horses/... şeklinde oluyor
          state: {
            horses: [],
            racingHorses: [],
            finishedHorses: [],
          },
          mutations: {
            // At listesini oluşturacak mutation
            GENERATE_HORSES(state: any) {
              state.horses = [
                {
                  id: 1,
                  name: 'Secretariat',
                  condition: 95,
                  color: 'Red',
                  position: 0,
                  isRacing: false,
                },
                {
                  id: 2,
                  name: 'Seabiscuit',
                  condition: 88,
                  color: 'Blue',
                  position: 0,
                  isRacing: false,
                },
              ]
            },
            // Yarışa katılan atları state'e ekler
            SET_RACING_HORSES(state: any, horses: any) {
              state.racingHorses = horses
            },
          },
          actions: {
            // At listesini oluşturmak için mutation'ı çağırır
            generateHorseList({ commit }: any) {
              commit('GENERATE_HORSES')
            },
          },
          getters: {
            // At listesini döner
            horses: (state: any) => state.horses,
            // Yarışta olan atları döner
            racingHorses: (state: any) => state.racingHorses,
          },
        },
        race: {
          namespaced: true,
          state: {
            rounds: [{ id: 1, distance: 1200, isActive: false, results: [] }],
            currentRound: 1,
            isRaceActive: false,
            isPaused: false,
          },
          mutations: {
            // Yarışı başlat / durdur
            SET_RACE_ACTIVE(state: any, isActive: boolean) {
              state.isRaceActive = isActive
            },
            // Mevcut turu günceller
            SET_CURRENT_ROUND(state: any, round: number) {
              state.currentRound = round
            },
          },
          actions: {
            // Yarışı başlat action'u
            startRace({ commit }: any) {
              commit('SET_RACE_ACTIVE', true)
            },
          },
          getters: {
            // Yarış aktif mi getter'ı
            isRaceActive: (state: any) => state.isRaceActive,
            // Mevcut tur getter'ı
            currentRound: (state: any) => state.currentRound,
          },
        },
      },
      // Global getterlar (modül içindeki getterları kısayol ile almak için)
      getters: {
        horses: (state: any) => state.horses.horses,
        isRaceActive: (state: any) => state.race.isRaceActive,
      },
    })
  })

  // At modülü testleri
  describe('At Modülü Testleri', () => {
    it('at listesi oluşturulmalı', async () => {
      // Action'ı çağır ve state güncellensin
      await testStore.dispatch('horses/generateHorseList')
      const horses = testStore.getters['horses/horses']

      // 2 at var mı kontrol et
      expect(horses).toHaveLength(2)
      // İlk atın adı doğru mu kontrol et
      expect(horses[0].name).toBe('Secretariat')
    })

    it('at objesi doğru özelliklere sahip olmalı', async () => {
      await testStore.dispatch('horses/generateHorseList')
      const horse = testStore.getters['horses/horses'][0]

      // At objesinin gerekli property'leri var mı kontrol et
      expect(horse).toHaveProperty('id')
      expect(horse).toHaveProperty('name')
      expect(horse).toHaveProperty('condition')
      expect(horse).toHaveProperty('color')
    })

    it('at kondisyonu gerçekçi olmalı', async () => {
      await testStore.dispatch('horses/generateHorseList')
      const horse = testStore.getters['horses/horses'][0]

      // Kondisyon 40-100 arasında mı kontrol et
      expect(horse.condition).toBeGreaterThanOrEqual(40)
      expect(horse.condition).toBeLessThanOrEqual(100)
    })
  })

  // Yarış modülü testleri
  describe('Yarış Modülü Testleri', () => {
    it('yarış başlatılabilmeli', async () => {
      // Yarışı başlat action'ını çağır
      await testStore.dispatch('race/startRace')
      const isActive = testStore.getters['race/isRaceActive']

      // Yarış durumu true olmalı
      expect(isActive).toBe(true)
    })

    it('tur yapısı doğru olmalı', () => {
      const rounds = testStore.state.race.rounds

      // Turlar doğru şekilde tanımlanmış mı
      expect(rounds).toHaveLength(1)
      expect(rounds[0]).toHaveProperty('id')
      expect(rounds[0]).toHaveProperty('distance')
      expect(rounds[0]).toHaveProperty('isActive')
    })
  })

  // Global getter testleri
  describe('Global Getter Testleri', () => {
    it("atlar getter'ı çalışmalı", async () => {
      await testStore.dispatch('horses/generateHorseList')
      const horses = testStore.getters.horses

      // Global getter üzerinden de atlar alınabiliyor mu?
      expect(horses).toHaveLength(2)
    })

    it("yarış durumu getter'ı çalışmalı", async () => {
      await testStore.dispatch('race/startRace')
      const isActive = testStore.getters.isRaceActive

      // Global getter üzerinden yarış durumu alınabiliyor mu?
      expect(isActive).toBe(true)
    })
  })
})
