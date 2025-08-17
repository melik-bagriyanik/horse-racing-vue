// At yönetimi için actions (asenkron işlemler)
export const actions = {
  // At listesini oluştur
  generateHorseList({ commit }: any) {
    commit('GENERATE_HORSES')
  },
}
