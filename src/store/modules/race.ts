import type { Horse, Round } from '../types'

// Constants
const ROUNDS_CONFIG = [
  { id: 1, distance: 1200 },
  { id: 2, distance: 1400 },
  { id: 3, distance: 1600 },
  { id: 4, distance: 1800 },
  { id: 5, distance: 2000 },
  { id: 6, distance: 2200 },
] as const

const HORSES_PER_ROUND = 10
const RACE_UPDATE_INTERVAL = 100 // ms
const ROUND_DELAY = 2000 // ms

// State
const state = {
  rounds: ROUNDS_CONFIG.map(config => ({
    ...config,
    isActive: false,
    results: [] as Horse[],
    winner: undefined as Horse | undefined
  })) as Round[],
  roundPrograms: {} as { [roundId: number]: Horse[] },
  currentRound: 1,
  isRaceActive: false,
  raceResults: {} as { [roundId: number]: Horse[] },
  raceInterval: null as number | null,
  isPaused: false,
}

// Mutations
const mutations = {
  SET_RACE_ACTIVE(state: any, isActive: boolean) {
    state.isRaceActive = isActive
  },

  SET_CURRENT_ROUND(state: any, round: number) {
    state.currentRound = round
  },

  SET_ROUND_RESULTS(state: any, { roundId, results }: { roundId: number; results: Horse[] }) {
    state.raceResults[roundId] = results
    const round = state.rounds.find((r: Round) => r.id === roundId)
    if (round) {
      round.results = results
      round.winner = results[0]
    }
  },

  SET_ROUND_ACTIVE(state: any, { roundId, isActive }: { roundId: number; isActive: boolean }) {
    const round = state.rounds.find((r: Round) => r.id === roundId)
    if (round) {
      round.isActive = isActive
    }
  },

  SET_ROUND_PROGRAM(state: any, { roundId, horses }: { roundId: number; horses: Horse[] }) {
    state.roundPrograms[roundId] = horses
  },

  RESET_RACE(state: any) {
    if (state.raceInterval) {
      clearInterval(state.raceInterval)
      state.raceInterval = null
    }

    state.isRaceActive = false
    state.isPaused = false
    state.currentRound = 1
    state.raceResults = {}
    state.roundPrograms = {}
    
    state.rounds.forEach((round: Round) => {
      round.isActive = false
      round.results = []
      round.winner = undefined
    })
  },
}

// Helper functions
const selectRandomHorses = (availableHorses: Horse[], count: number): Horse[] => {
  const horses = [...availableHorses]
  const selected: Horse[] = []
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * horses.length)
    const horse = { ...horses[randomIndex] }
    horse.isRacing = true
    horse.position = 0
    selected.push(horse)
    horses.splice(randomIndex, 1)
  }
  
  return selected.sort((a, b) => a.name.localeCompare(b.name))
}

const calculateHorseSpeed = (horse: Horse): number => {
  const baseSpeed = (horse.condition / 100) * 1.5
  const randomFactor = 0.5 + Math.random() * 1.0
  return baseSpeed * randomFactor
}

// Actions
const actions = {
  generateProgram({ commit, rootState }: any) {
    commit('RESET_RACE')

    for (let roundId = 1; roundId <= 6; roundId++) {
      const availableHorses = [...rootState.horses.horses]
      const selectedHorses = selectRandomHorses(availableHorses, HORSES_PER_ROUND)
      
      selectedHorses.forEach((horse, index) => {
        horse.lane = index + 1
      })

      commit('SET_ROUND_PROGRAM', { roundId, horses: selectedHorses })
    }

    const firstRoundHorses = state.roundPrograms[1] || []
    commit('horses/SET_RACING_HORSES', firstRoundHorses, { root: true })
    commit('SET_RACE_ACTIVE', false)
  },

  startRace({ commit, state, dispatch, rootState }: any) {
    if (rootState.horses.racingHorses.length === 0) return

    const wasPaused = state.isPaused
    commit('SET_RACE_ACTIVE', true)
    state.isPaused = false

    if (!wasPaused) {
      commit('SET_ROUND_ACTIVE', { roundId: state.currentRound, isActive: true })
    }

    dispatch('runRound', { roundId: state.currentRound, wasPaused })
  },

  runRound({ commit, state, dispatch, rootState }: any, params: { roundId: number; wasPaused?: boolean }) {
    const { roundId, wasPaused = false } = params
    const round = state.rounds.find((r: Round) => r.id === roundId)
    if (!round) return

    if (!wasPaused) {
      const racingHorses = rootState.horses.racingHorses
      racingHorses.forEach((horse: Horse) => {
        horse.position = 0
        horse.hasFinished = false
        horse.finishPosition = undefined
      })
      rootState.horses.finishedHorses = []
    }

    commit('SET_ROUND_ACTIVE', { roundId, isActive: true })

    state.raceInterval = setInterval(() => {
      let allFinished = true

      rootState.horses.racingHorses.forEach((horse: Horse) => {
        if (horse.position < 100) {
          const speed = calculateHorseSpeed(horse)
          horse.position = Math.min(100, horse.position + speed)

          if (horse.position >= 100 && !horse.hasFinished) {
            horse.hasFinished = true
            horse.finishPosition = rootState.horses.finishedHorses.length + 1
            rootState.horses.finishedHorses.push(horse)

            const currentResults = [...rootState.horses.finishedHorses].sort(
              (a, b) => (a.finishPosition || 0) - (b.finishPosition || 0)
            )
            commit('SET_ROUND_RESULTS', { roundId, results: currentResults })
          }

          if (horse.position < 100) {
            allFinished = false
          }
        }
      })

      if (allFinished) {
        clearInterval(state.raceInterval!)
        state.raceInterval = null

        const sortedResults = [...rootState.horses.racingHorses].sort(
          (a, b) => b.position - a.position
        )
        const resultsCopy = sortedResults.map((horse) => ({
          id: horse.id,
          name: horse.name,
          condition: horse.condition,
          color: horse.color,
          position: horse.position,
          isRacing: horse.isRacing,
          lane: horse.lane,
        }))

        commit('SET_ROUND_RESULTS', { roundId, results: resultsCopy })
        commit('SET_ROUND_ACTIVE', { roundId, isActive: false })

        if (roundId < 6) {
          setTimeout(() => {
            commit('SET_CURRENT_ROUND', roundId + 1)
            dispatch('selectHorsesForRound', roundId + 1)
            dispatch('runRound', { roundId: roundId + 1, wasPaused: false })
          }, ROUND_DELAY)
        } else {
          commit('SET_RACE_ACTIVE', false)
        }
      }
    }, RACE_UPDATE_INTERVAL)
  },

  selectHorsesForRound({ commit, state }: any, roundId: number) {
    const roundHorses = state.roundPrograms[roundId] || []
    roundHorses.forEach((horse: Horse) => {
      horse.position = 0
    })
    commit('horses/SET_RACING_HORSES', roundHorses, { root: true })
  },

  pauseRace({ commit, state }: any) {
    commit('SET_RACE_ACTIVE', false)
    state.isPaused = true
    if (state.raceInterval) {
      clearInterval(state.raceInterval)
      state.raceInterval = null
    }
  },

  resetRace({ commit }: any) {
    commit('RESET_RACE')
    commit('horses/RESET_HORSES', null, { root: true })
  },
}

// Getters
const getters = {
  isRaceActive: (state: any) => state.isRaceActive,
  currentRound: (state: any) => state.currentRound,
  roundResults: (state: any) => (roundId: number) => state.raceResults[roundId] || [],
  allRoundResults: (state: any) => ({ ...state.raceResults }),
  activeRound: (state: any) => state.rounds.find((r: Round) => r.isActive),
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
