import type { Horse } from '../../types'
import { HORSE_NAMES, HORSE_COLORS, HORSE_COUNT, MIN_CONDITION, MAX_CONDITION } from './constants'

// Yardımcı fonksiyonlar
export const generateRandomHorse = (id: number): Horse => {
  const randomCondition = Math.floor(Math.random() * (MAX_CONDITION - MIN_CONDITION + 1)) + MIN_CONDITION
  const randomNameIndex = Math.floor(Math.random() * HORSE_NAMES.length)
  const randomColorIndex = Math.floor(Math.random() * HORSE_COLORS.length)

  return {
    id,
    name: HORSE_NAMES[randomNameIndex],
    condition: randomCondition,
    color: HORSE_COLORS[randomColorIndex],
    position: 0,
    isRacing: false,
  }
}

export const generateHorseList = (): Horse[] => {
  const horses: Horse[] = []
  const availableNames = [...HORSE_NAMES]
  const availableColors = [...HORSE_COLORS]

  for (let i = 0; i < HORSE_COUNT; i++) {
    const randomNameIndex = Math.floor(Math.random() * availableNames.length)
    const randomColorIndex = Math.floor(Math.random() * availableColors.length)
    const randomCondition = Math.floor(Math.random() * (MAX_CONDITION - MIN_CONDITION + 1)) + MIN_CONDITION

    horses.push({
      id: i + 1,
      name: availableNames[randomNameIndex],
      condition: randomCondition,
      color: availableColors[randomColorIndex],
      position: 0,
      isRacing: false,
    })

    // Kullanılan isim ve rengi listeden çıkarıyoruz
    availableNames.splice(randomNameIndex, 1)
    availableColors.splice(randomColorIndex, 1)
  }

  return horses
}
