import type { Horse } from '../../types'

// Yardımcı fonksiyonlar - Karmaşık işlemleri basitleştiren fonksiyonlar
export const selectRandomHorses = (availableHorses: Horse[], count: number): Horse[] => {
  const horses = [...availableHorses] // Mevcut atların kopyasını al
  const selected: Horse[] = []

  // Belirtilen sayıda rastgele at seç (aynı turda aynı at birden fazla kez seçilmemeli)
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * horses.length)
    const horse = { ...horses[randomIndex] } // Atın kopyasını al
    horse.isRacing = true // Yarışa katılıyor olarak işaretle
    horse.position = 0 // Başlangıç pozisyonu
    selected.push(horse)
    horses.splice(randomIndex, 1) // Seçilen atı listeden çıkar (aynı turda tekrar seçilmesin)
  }

  // Atları alfabetik sıraya koy (program tablosu için)
  return selected.sort((a, b) => a.name.localeCompare(b.name))
}

export const calculateHorseSpeed = (horse: Horse): number => {
  // Atın hızını hesapla (kondisyon + rastgele faktör)
  const baseSpeed = (horse.condition / 100) * 1.5 // Kondisyona göre temel hız
  const randomFactor = 0.5 + Math.random() * 1.0 // Rastgele faktör (0.5-1.5)
  return baseSpeed * randomFactor
}
