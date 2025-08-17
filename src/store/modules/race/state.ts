import type { Horse, Round } from '../../types'
import { ROUNDS_CONFIG } from './constants'

// State - Yarış modülünün durum bilgileri
export const state = {
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
