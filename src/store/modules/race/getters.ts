import type { Round } from '../../types'

// Getters - Yarış durumunu ve sonuçları kontrol etmek için kullanılan fonksiyonlar
export const getters = {
  isRaceActive: (state: any) => state.isRaceActive, // Yarış aktif mi? (true/false)
  currentRound: (state: any) => state.currentRound, // Şu anki aktif tur (1-6)
  roundResults: (state: any) => (roundId: number) => state.raceResults[roundId] || [], // Belirli turun sonuçları
  allRoundResults: (state: any) => ({ ...state.raceResults }), // Tüm tur sonuçları (kopya)
  activeRound: (state: any) => state.rounds.find((r: Round) => r.isActive), // Aktif tur bilgisi
}
