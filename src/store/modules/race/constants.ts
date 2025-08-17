// Sabitler - Yarış simülasyonu için gerekli sabit değerler
export const ROUNDS_CONFIG = [
  { id: 1, distance: 1200 },
  { id: 2, distance: 1400 },
  { id: 3, distance: 1600 },
  { id: 4, distance: 1800 },
  { id: 5, distance: 2000 },
  { id: 6, distance: 2200 },
] as const

export const HORSES_PER_ROUND = 10 // Her turda yarışacak at sayısı
export const RACE_UPDATE_INTERVAL = 100 // Yarış animasyonu güncelleme sıklığı (ms)
export const ROUND_DELAY = 2000 // Turlar arası bekleme süresi (ms)
