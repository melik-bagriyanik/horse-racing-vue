// At yönetimi için getters (hesaplanmış değerler)
export const getters = {
  horses: (state: any) => state.horses, // Tüm atlar
  racingHorses: (state: any) => state.racingHorses, // Yarışan atlar
  availableHorses: (state: any) => state.horses.filter((horse: any) => !horse.isRacing), // Yarışmayan atlar
}
