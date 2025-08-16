import { createStore } from 'vuex'

export interface Horse {
  id: number
  name: string
  condition: number
  color: string
  position: number
  isRacing: boolean
  lane?: number
  hasFinished?: boolean
  finishPosition?: number
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
  finishedHorses: Horse[] // Track horses that have finished
  rounds: Round[]
  roundPrograms: { [roundId: number]: Horse[] } // Store horses for each round
  currentRound: number
  isRaceActive: boolean
  raceResults: { [roundId: number]: Horse[] }
}

export default createStore({
  state: (): State => ({
    horses: [],
    racingHorses: [],
    finishedHorses: [], // Track horses that have finished
    rounds: [
      { id: 1, distance: 1200, isActive: false, results: [] },
      { id: 2, distance: 1400, isActive: false, results: [] },
      { id: 3, distance: 1600, isActive: false, results: [] },
      { id: 4, distance: 1800, isActive: false, results: [] },
      { id: 5, distance: 2000, isActive: false, results: [] },
      { id: 6, distance: 2200, isActive: false, results: [] },
    ],
    roundPrograms: {}, // Store horses for each round
    currentRound: 1,
    isRaceActive: false,
    raceResults: {},
  }),

  mutations: {
    GENERATE_HORSES(state) {
      const horseNames = [
        'Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton', 'Joan Clarke', 'Katherine Johnson',
        'Dorothy Vaughan', 'Mary Jackson', 'Annie Easley', 'Frances Spence', 'Betty Holberton',
        'Jean Bartik', 'Marlyn Meltzer', 'Ruth Teitelbaum', 'Kay McNulty', 'Betty Snyder',
        'Hedy Lamarr', 'Radia Perlman', 'Barbara Liskov', 'Shafi Goldwasser', 'Donna Dubinsky'
      ]
      
      const colors = [
        'Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Pink', 'Brown', 'Black', 'White',
        'Gray', 'Cyan', 'Magenta', 'Lime', 'Navy', 'Teal', 'Maroon', 'Olive', 'Silver', 'Gold'
      ]
      
      // Generate exactly 20 horses
      const horseCount = 20
      state.horses = []
      
      for (let i = 0; i < horseCount; i++) {
        const randomCondition = Math.floor(Math.random() * 61) + 40 // 40-100 arası
        const randomNameIndex = Math.floor(Math.random() * horseNames.length)
        const randomColorIndex = Math.floor(Math.random() * colors.length)
        
        state.horses.push({
          id: i + 1,
          name: horseNames[randomNameIndex],
          condition: randomCondition,
          color: colors[randomColorIndex],
          position: 0,
          isRacing: false
        })
        
        // Remove used name and color to avoid duplicates
        horseNames.splice(randomNameIndex, 1)
        colors.splice(randomColorIndex, 1)
      }
    },
    
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
      console.log(`Setting results for round ${roundId}:`, results.map((h, i) => `${i + 1}. ${h.name}: ${h.position.toFixed(2)}`))
      state.raceResults[roundId] = results
      const round = state.rounds.find(r => r.id === roundId)
      if (round) {
        round.results = results
        round.winner = results[0]
      }
      console.log(`State raceResults after setting:`, state.raceResults)
    },
    
    SET_ROUND_ACTIVE(state, { roundId, isActive }: { roundId: number, isActive: boolean }) {
      const round = state.rounds.find(r => r.id === roundId)
      if (round) {
        round.isActive = isActive
      }
    },
    
    SET_ROUND_PROGRAM(state, { roundId, horses }: { roundId: number, horses: Horse[] }) {
      state.roundPrograms[roundId] = horses
    },
    
    RESET_RACE(state) {
      state.racingHorses = []
      state.isRaceActive = false
      state.currentRound = 1
      state.raceResults = {}
      state.roundPrograms = {}
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
    generateHorseList({ commit }) {
      commit('GENERATE_HORSES')
    },
    
    generateProgram({ commit, state }) {
      // Reset previous race
      commit('RESET_RACE')
      
      // Generate programs for all 6 rounds
      for (let roundId = 1; roundId <= 6; roundId++) {
        const availableHorses = [...state.horses]
        const selectedHorses: Horse[] = []
        
        // Select 10 random horses for this round
        for (let i = 0; i < 10; i++) {
          const randomIndex = Math.floor(Math.random() * availableHorses.length)
          const horse = { ...availableHorses[randomIndex] }
          horse.isRacing = true
          horse.position = 0
          selectedHorses.push(horse)
          availableHorses.splice(randomIndex, 1)
        }
        
        // Sort horses to match program order (this will be the order shown in program table)
        selectedHorses.sort((a, b) => a.name.localeCompare(b.name))
        
        // Assign lanes based on program order (1st position = lane 1, 2nd position = lane 2, etc.)
        selectedHorses.forEach((horse, index) => {
          horse.lane = index + 1 // Position 1 = Lane 1, Position 2 = Lane 2, etc.
        })
        
        // Store the horses for this round
        commit('SET_ROUND_PROGRAM', { roundId, horses: selectedHorses })
      }
      
      // Set first round horses as current racing horses
      const firstRoundHorses = state.roundPrograms[1] || []
      commit('SET_RACING_HORSES', firstRoundHorses)
      
      // Don't set race as active - let user click Start button
      commit('SET_RACE_ACTIVE', false)
    },
    
    startRace({ commit, state, dispatch }) {
      if (state.racingHorses.length === 0) return
      
      commit('SET_RACE_ACTIVE', true)
      commit('SET_ROUND_ACTIVE', { roundId: 1, isActive: true })
      dispatch('runRound', state.currentRound)
    },
    
    runRound({ commit, state, dispatch }, roundId: number) {
      const round = state.rounds.find(r => r.id === roundId)
      if (!round) return
      
      // Reset all horses to starting position at the beginning of each round
      state.racingHorses.forEach(horse => {
        horse.position = 0
        horse.hasFinished = false
        horse.finishPosition = undefined
      })
      
      // Clear finished horses array
      state.finishedHorses = []
      
      commit('SET_ROUND_ACTIVE', { roundId, isActive: true })
      
      // Simulate race progress
      const raceInterval = setInterval(() => {
        let allFinished = true
        
        state.racingHorses.forEach(horse => {
          if (horse.position < 100) {
            // Move horse based on condition and random factor with lower speed
            const baseSpeed = (horse.condition / 100) * 1.5 // Reduced base speed
            const randomFactor = 0.5 + Math.random() * 1.0 // Random factor between 0.5-1.5
            const speed = baseSpeed * randomFactor
            horse.position = Math.min(100, horse.position + speed)
            
            // Check if horse just finished
            if (horse.position >= 100 && !horse.hasFinished) {
              horse.hasFinished = true
              horse.finishPosition = state.finishedHorses.length + 1
              state.finishedHorses.push(horse)
              
              // Update results immediately when a horse finishes
              const currentResults = [...state.finishedHorses].sort((a, b) => a.finishPosition - b.finishPosition)
              commit('SET_ROUND_RESULTS', { roundId, results: currentResults })
              
              console.log(`${horse.name} finished in position ${horse.finishPosition}`)
            }
            
            if (horse.position < 100) {
              allFinished = false
            }
          } else {
            // Horse has finished, keep at 100
            horse.position = 100
          }
        })
        
        // Debug: Log positions when all finished
        if (allFinished) {
          console.log('Round finished. Final positions:', state.racingHorses.map(h => `${h.name}: ${h.position.toFixed(2)}`))
        }
        
        // Check if all horses finished
        if (allFinished) {
          clearInterval(raceInterval)
          
          // Sort horses by position (winner first - highest position wins)
          const sortedResults = [...state.racingHorses].sort((a, b) => b.position - a.position)
          console.log('Round results:', sortedResults.map((h, i) => `${i + 1}. ${h.name}: ${h.position.toFixed(2)}`))
          
          // Create a deep copy of the results to avoid reference issues
          const resultsCopy = sortedResults.map(horse => ({
            id: horse.id,
            name: horse.name,
            condition: horse.condition,
            color: horse.color,
            position: horse.position,
            isRacing: horse.isRacing,
            lane: horse.lane
          }))
          
          console.log('Results copy to be saved:', resultsCopy.map((h, i) => `${i + 1}. ${h.name}: ${h.position.toFixed(2)}`))
          
          commit('SET_ROUND_RESULTS', { roundId, results: resultsCopy })
          commit('SET_ROUND_ACTIVE', { roundId, isActive: false })
          
          // Move to next round or end race
          if (roundId < 6) {
            setTimeout(() => {
              commit('SET_CURRENT_ROUND', roundId + 1)
              // Select new horses for next round
              dispatch('selectHorsesForRound', roundId + 1)
              dispatch('runRound', roundId + 1)
            }, 2000)
          } else {
            commit('SET_RACE_ACTIVE', false)
          }
        }
      }, 100)
    },
    
    selectHorsesForRound({ commit, state }, roundId: number) {
      // Get horses for this round from the pre-generated program
      const roundHorses = state.roundPrograms[roundId] || []
      
      // Reset positions to 0 for all horses in this round
      roundHorses.forEach(horse => {
        horse.position = 0
      })
      
      commit('SET_RACING_HORSES', roundHorses)
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
    allRoundResults: (state) => {
      console.log('allRoundResults getter called:', state.raceResults)
      // Return a copy to avoid reference issues
      return { ...state.raceResults }
    },
    activeRound: (state) => state.rounds.find(r => r.isActive),
  },
})
