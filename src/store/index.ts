import { createStore } from 'vuex'

export interface Horse {
  id: number
  name: string
  condition: number
  color: string
  position: number
  isRacing: boolean
  lane?: number
}

export interface Round {
  id: number
  distance: number
  isActive: boolean
  winner?: Horse
  results: Horse[]
}

export interface State {
  horses: Horse[]
  racingHorses: Horse[]
  rounds: Round[]
  currentRound: number
  isRaceActive: boolean
  raceResults: { [roundId: number]: Horse[] }
}

export default createStore({
  state: (): State => ({
    horses: [
      { id: 1, name: 'Ada Lovelace', condition: 80, color: 'Red', position: 0, isRacing: false },
      { id: 2, name: 'Grace Hopper', condition: 45, color: 'Blue', position: 0, isRacing: false },
      { id: 3, name: 'Margaret Hamilton', condition: 60, color: 'Yellow', position: 0, isRacing: false },
      { id: 4, name: 'Joan Clarke', condition: 95, color: 'Green', position: 0, isRacing: false },
      { id: 5, name: 'Katherine Johnson', condition: 70, color: 'Purple', position: 0, isRacing: false },
      { id: 6, name: 'Dorothy Vaughan', condition: 55, color: 'Orange', position: 0, isRacing: false },
      { id: 7, name: 'Mary Jackson', condition: 85, color: 'Pink', position: 0, isRacing: false },
      { id: 8, name: 'Annie Easley', condition: 65, color: 'Brown', position: 0, isRacing: false },
      { id: 9, name: 'Frances Spence', condition: 75, color: 'Black', position: 0, isRacing: false },
      { id: 10, name: 'Betty Holberton', condition: 90, color: 'White', position: 0, isRacing: false },
      { id: 11, name: 'Jean Bartik', condition: 50, color: 'Gray', position: 0, isRacing: false },
      { id: 12, name: 'Marlyn Meltzer', condition: 40, color: 'Cyan', position: 0, isRacing: false },
      { id: 13, name: 'Ruth Teitelbaum', condition: 35, color: 'Magenta', position: 0, isRacing: false },
      { id: 14, name: 'Kay McNulty', condition: 88, color: 'Lime', position: 0, isRacing: false },
      { id: 15, name: 'Betty Snyder', condition: 72, color: 'Navy', position: 0, isRacing: false },
      { id: 16, name: 'Hedy Lamarr', condition: 68, color: 'Teal', position: 0, isRacing: false },
      { id: 17, name: 'Radia Perlman', condition: 82, color: 'Maroon', position: 0, isRacing: false },
      { id: 18, name: 'Barbara Liskov', condition: 78, color: 'Olive', position: 0, isRacing: false },
      { id: 19, name: 'Shafi Goldwasser', condition: 92, color: 'Silver', position: 0, isRacing: false },
      { id: 20, name: 'Donna Dubinsky', condition: 58, color: 'Gold', position: 0, isRacing: false },
    ],
    racingHorses: [],
    rounds: [
      { id: 1, distance: 1200, isActive: false, results: [] },
      { id: 2, distance: 1400, isActive: false, results: [] },
      { id: 3, distance: 1600, isActive: false, results: [] },
      { id: 4, distance: 1800, isActive: false, results: [] },
      { id: 5, distance: 2000, isActive: false, results: [] },
      { id: 6, distance: 2200, isActive: false, results: [] },
    ],
    currentRound: 1,
    isRaceActive: false,
    raceResults: {},
  }),

  mutations: {
    SET_RACING_HORSES(state, horses: Horse[]) {
      state.racingHorses = horses
    },
    
    SET_RACE_ACTIVE(state, isActive: boolean) {
      state.isRaceActive = isActive
    },
    
    SET_CURRENT_ROUND(state, round: number) {
      state.currentRound = round
    },
    
    UPDATE_HORSE_POSITION(state, { horseId, position }: { horseId: number, position: number }) {
      const horse = state.racingHorses.find(h => h.id === horseId)
      if (horse) {
        horse.position = position
      }
    },
    
    SET_ROUND_RESULTS(state, { roundId, results }: { roundId: number, results: Horse[] }) {
      state.raceResults[roundId] = results
      const round = state.rounds.find(r => r.id === roundId)
      if (round) {
        round.results = results
        round.winner = results[0]
      }
    },
    
    SET_ROUND_ACTIVE(state, { roundId, isActive }: { roundId: number, isActive: boolean }) {
      const round = state.rounds.find(r => r.id === roundId)
      if (round) {
        round.isActive = isActive
      }
    },
    
    RESET_RACE(state) {
      state.racingHorses = []
      state.isRaceActive = false
      state.currentRound = 1
      state.raceResults = {}
      state.rounds.forEach(round => {
        round.isActive = false
        round.results = []
        round.winner = undefined
      })
      state.horses.forEach(horse => {
        horse.isRacing = false
        horse.position = 0
        horse.lane = undefined
      })
    },
  },

  actions: {
    generateProgram({ commit, state }) {
      // Reset previous race
      commit('RESET_RACE')
      
      // Select 10 random horses
      const availableHorses = [...state.horses]
      const selectedHorses: Horse[] = []
      
      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * availableHorses.length)
        const horse = { ...availableHorses[randomIndex] }
        horse.isRacing = true
        horse.lane = i + 1
        horse.position = Math.random() * 20 // Random starting position
        selectedHorses.push(horse)
        availableHorses.splice(randomIndex, 1)
      }
      
      commit('SET_RACING_HORSES', selectedHorses)
      commit('SET_RACE_ACTIVE', true)
      commit('SET_ROUND_ACTIVE', { roundId: 1, isActive: true })
    },
    
    startRace({ commit, state, dispatch }) {
      if (state.racingHorses.length === 0) return
      
      commit('SET_RACE_ACTIVE', true)
      dispatch('runRound', state.currentRound)
    },
    
    runRound({ commit, state, dispatch }, roundId: number) {
      const round = state.rounds.find(r => r.id === roundId)
      if (!round) return
      
      commit('SET_ROUND_ACTIVE', { roundId, isActive: true })
      
      // Simulate race progress
      const raceInterval = setInterval(() => {
        let allFinished = true
        
        state.racingHorses.forEach(horse => {
          if (horse.position < 100) {
            // Move horse based on condition and random factor
            const speed = (horse.condition / 100) * (0.5 + Math.random() * 0.5)
            horse.position = Math.min(100, horse.position + speed)
            
            if (horse.position < 100) {
              allFinished = false
            }
          }
        })
        
        // Check if all horses finished
        if (allFinished) {
          clearInterval(raceInterval)
          
          // Sort horses by position (winner first)
          const sortedResults = [...state.racingHorses].sort((a, b) => b.position - a.position)
          commit('SET_ROUND_RESULTS', { roundId, results: sortedResults })
          commit('SET_ROUND_ACTIVE', { roundId, isActive: false })
          
          // Move to next round or end race
          if (roundId < 6) {
            setTimeout(() => {
              commit('SET_CURRENT_ROUND', roundId + 1)
              dispatch('runRound', roundId + 1)
            }, 2000)
          } else {
            commit('SET_RACE_ACTIVE', false)
          }
        }
      }, 100)
    },
    
    pauseRace({ commit }) {
      commit('SET_RACE_ACTIVE', false)
    },
    
    resetRace({ commit }) {
      commit('RESET_RACE')
    },
  },

  getters: {
    availableHorses: (state) => state.horses.filter(horse => !horse.isRacing),
    racingHorses: (state) => state.racingHorses,
    isRaceActive: (state) => state.isRaceActive,
    currentRound: (state) => state.currentRound,
    roundResults: (state) => (roundId: number) => state.raceResults[roundId] || [],
    allRoundResults: (state) => state.raceResults,
    activeRound: (state) => state.rounds.find(r => r.isActive),
  },
})
