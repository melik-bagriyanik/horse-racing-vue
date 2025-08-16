<template>
  <div class="racefield">
    <div class="racefield-header">
      <h2>Race Field</h2>
      <div class="race-info">
        <span class="race-number">Round #{{ currentRound }}</span>
        <span class="race-distance">{{ currentRoundDistance }}m</span>
      </div>
    </div>

    <div class="race-lanes">
      <div
        v-for="(lane, index) in displayLanes"
        :key="index"
        class="race-lane"
        :class="{ active: lane.isActive }"
      >
        <div class="lane-number">{{ index + 1 }}</div>
        <div class="lane-content">
          <div v-if="lane.horse" class="horse-in-lane" :style="{ left: lane.horse.position + '%' }">
            <span class="horse-emoji">🐎</span>
            <span class="horse-name">{{ lane.horse.name }}</span>
          </div>
        </div>
        <div class="finish-line"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps({
  raceNumber: {
    type: Number,
    default: 1,
  },
  distance: {
    type: Number,
    default: 1200,
  },
})

const racingHorses = computed(() => store.getters.racingHorses)
const currentRound = computed(() => store.getters.currentRound)
const isRaceActive = computed(() => store.getters.isRaceActive)

const currentRoundDistance = computed(() => {
  const round = store.state.rounds.find((r) => r.id === currentRound.value)
  return round ? round.distance : 1200
})

const displayLanes = computed(() => {
  const lanes = []
  for (let i = 1; i <= 10; i++) {
    const horse = racingHorses.value.find((h) => h.lane === i)
    lanes.push({
      isActive: isRaceActive.value,
      horse: horse || null,
    })
  }
  return lanes
})
</script>

<style scoped>
.racefield {
  background: linear-gradient(135deg, #2c5530 0%, #1a3d1e 100%);
  border-radius: 12px;
  padding: 20px;

  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  flex: 1;
  height: 100%;
}

.racefield-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.racefield-header h2 {
  color: #fff;
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.race-info {
  display: flex;
  gap: 20px;
}

.race-number,
.race-distance {
  color: #fff;
  font-weight: 600;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 14px;
}

.race-lanes {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 90%;
}

.race-lane {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  position: relative;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.race-lane:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.race-lane.active {
  background: rgba(76, 175, 80, 0.1);
  border-color: rgba(76, 175, 80, 0.3);
}

.lane-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  margin-right: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.lane-content {
  flex: 1;
  position: relative;
  height: 40px;
  background: linear-gradient(90deg, #3d5a3d 0%, #2d4a2d 50%, #1d3a1d 100%);
  border-radius: 6px;
  overflow: hidden;
}

.horse-in-lane {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: left 0.5s ease;
  z-index: 2;
}

.horse-emoji {
  font-size: 24px;
  margin-right: 8px;
}

.horse-in-lane .horse-name {
  color: white;
  font-weight: 600;
  font-size: 12px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
}

.finish-line {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: repeating-linear-gradient(45deg, #fff, #fff 4px, transparent 4px, transparent 8px);
  z-index: 1;
}

/* Responsive design */

@media (max-width: 768px) {
  .racefield {
    padding: 15px;
  }

  .racefield-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .race-info {
    gap: 10px;
  }

  .lane-number {
    width: 32px;
    height: 32px;
    font-size: 14px;
    margin-right: 10px;
  }

  .horse-in-lane .horse-name {
    font-size: 10px;
  }
}
</style>
