export interface Horse {
  id: number
  name: string
  condition: number
  color: string
  position: number // Yarış sırasındaki pozisyonu (0-100)
  isRacing: boolean // Şu anda yarışıyor mu?
  lane?: number // Yarış pistindeki şerit numarası (1-10)
  hasFinished?: boolean // Yarışı bitirdi mi?
  finishPosition?: number // Bitiş sıralamasındaki pozisyonu
}

export interface Round {
  id: number
  distance: number
  isActive: boolean // Bu tur şu anda aktif mi?
  winner?: Horse // Turun kazanan atı
  results: Horse[]
}

// Ana state yapısı mdüler Vuex için
export interface State {
  horses: {
    horses: Horse[] // Tüm atların listesi (20 at)
    racingHorses: Horse[] // Şu anda yarışan atlar (10 at)
    finishedHorses: Horse[] // Yarışı bitiren atlar
  }
  race: {
    rounds: Round[] // 6 turun bilgileri
    roundPrograms: { [roundId: number]: Horse[] } // Her tur için seçilen atlar
    currentRound: number // Şu anki aktif tur (1-6)
    isRaceActive: boolean // Yarış aktif mi?
    raceResults: { [roundId: number]: Horse[] } // Her turun sonuçları
    raceInterval?: number | null // Yarış animasyonu için interval ID
    isPaused: boolean // Yarış duraklatıldı mı?
  }
}
