export interface Horse {
  id: number
  name: string
  condition: number // Atın kondisyon puanı (40-100 arası)
  color: string
  position: number // Yarış sırasındaki pozisyonu (0-100 arası)
  isRacing: boolean // Şu anda yarışıyor mu?
  lane?: number // Yarış pistindeki şerit numarası (1-10 arası)
  hasFinished?: boolean // Yarışı bitirdi mi?
  finishPosition?: number // Bitiş sıralamasındaki pozisyonu (1-10 arası)
}

// Round interface
export interface Round {
  id: number // Tur numarası (1-6)
  distance: number
  isActive: boolean // Bu tur şu anda aktif mi?
  winner?: Horse // Turun kazanan atı
  results: Horse[] // Tur sonuçları
}

// Horses module state interface
export interface HorsesState {
  horses: Horse[] // Tüm atların listesi (20 at)
  racingHorses: Horse[] // Şu anda yarışan atlar (10 at)
  finishedHorses: Horse[] // Yarışı bitiren atlar
}

// Race module state interface
export interface RaceState {
  rounds: Round[] // 6 turun bilgileri
  roundPrograms: { [roundId: number]: Horse[] } // Her tur için seçilen atlar
  currentRound: number // Şu anki aktif tur (1-6)
  isRaceActive: boolean // Yarış aktif mi?
  raceResults: { [roundId: number]: Horse[] } // Her turun sonuçları
  raceInterval?: number | null // Yarış animasyonu için interval ID
  isPaused: boolean // Yarış duraklatıldı mı?
}

// Root state interface - Ana state yapısı
export interface State {
  horses: HorsesState // At yönetimi modülü
  race: RaceState // Yarış yönetimi modülü
}

// Vuex context types - Vuex action ve mutation'ları için tip tanımları
export interface VuexContext {
  commit: (mutation: string, payload?: any) => void // Mutation çağırmak için
  dispatch: (action: string, payload?: any) => Promise<any> // Action çağırmak için
  state: any // Mevcut modülün statei
  rootState: State // Tüm storeun statei
  getters: any // Store getterları
}
