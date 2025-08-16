import type { Horse } from '../types'

// At yönetimi için state
const state = {
  horses: [] as Horse[], // Tüm atların listesi
  racingHorses: [] as Horse[], // Şu anda yarışan atlar
  finishedHorses: [] as Horse[], // Yarışı bitiren atlar
}

// At yönetimi için mutations (state değişiklikleri)
const mutations = {
  GENERATE_HORSES(state: any) {
    const horseNames = [
      'Secretariat',
      'Seabiscuit',
      "Man o' War",
      'Red Rum',
      'Black Caviar',
      'Frankel',
      'American Pharoah',
      'War Admiral',
      'Affirmed',
      'Citation',
      'Whirlaway',
      'Gallant Fox',
      'Arkle',
      'Phar Lap',
      'Desert Orchid',
      'Northern Dancer',
      'Ribot',
      'Sir Barton',
      'Sunday Silence',
      'Alysheba',
      'Kelso',
      'Spectacular Bid',
      'Nijinsky',
      'Big Brown',
      'Smarty Jones',
      'Justify',
      'Zenyatta',
      'Rachel Alexandra',
      'Silver Charm',
      'Thunder Gulch',
    ]

    // At renkleri listesi
    const colors = [
      'Red',
      'Blue',
      'Yellow',
      'Green',
      'Purple',
      'Orange',
      'Pink',
      'Brown',
      'Black',
      'White',
      'Gray',
      'Cyan',
      'Magenta',
      'Lime',
      'Navy',
      'Teal',
      'Maroon',
      'Olive',
      'Silver',
      'Gold',
    ]

    const horseCount = 20
    state.horses = []

    // 20 adet random at oluştur
    for (let i = 0; i < horseCount; i++) {
      const randomCondition = Math.floor(Math.random() * 61) + 40 // 40-100 arası kondisyon
      const randomNameIndex = Math.floor(Math.random() * horseNames.length)
      const randomColorIndex = Math.floor(Math.random() * colors.length)

      state.horses.push({
        id: i + 1,
        name: horseNames[randomNameIndex],
        condition: randomCondition,
        color: colors[randomColorIndex],
        position: 0,
        isRacing: false,
      })

      // Kullanılan isim ve rengi listeden çıkarıyoruz
      horseNames.splice(randomNameIndex, 1)
      colors.splice(randomColorIndex, 1)
    }
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

// At yönetimi için actions (asenkron işlemler)
const actions = {
  // At listesini oluştur
  generateHorseList({ commit }: any) {
    commit('GENERATE_HORSES')
  },
}

// At yönetimi için getters (hesaplanmış değerler)
const getters = {
  horses: (state: any) => state.horses, // Tüm atlar
  racingHorses: (state: any) => state.racingHorses, // Yarışan atlar
  availableHorses: (state: any) => state.horses.filter((horse: any) => !horse.isRacing), // Yarışmayan atlar
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
