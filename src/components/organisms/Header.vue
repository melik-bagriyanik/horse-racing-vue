<template>
  <header class="navbar">
    <div class="container">
      <div class="logo-section">
        <h1 class="logo">🏇 Horse Racing</h1>
        <p class="subtitle">Professional Racing Simulator</p>
      </div>

      <div class="controls">
        <BaseButton @click="generateHorseList" class="control-btn" :disabled="isRaceActive">
          🐎 Generate Horse List
        </BaseButton>
        <BaseButton
          @click="generateProgram"
          class="control-btn"
          :disabled="isRaceActive || horses.length === 0"
        >
          📅 Generate Program
        </BaseButton>
        <BaseButton
          @click="toggleRace"
          variant="secondary"
          class="control-btn start-btn"
          :disabled="racingHorses.length === 0"
        >
          {{ isRaceActive ? '⏸️ Pause' : '▶️ Start' }}
        </BaseButton>
        <BaseButton
          @click="resetEverything"
          variant="danger"
          class="control-btn reset-btn"
        >
          🔄 Reset All
        </BaseButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import BaseButton from '../atoms/BaseButton.vue'

const store = useStore()

const horses = computed(() => store.state.horses)
const racingHorses = computed(() => store.getters.racingHorses)
const isRaceActive = computed(() => store.getters.isRaceActive)

const generateHorseList = () => {
  store.dispatch('generateHorseList')
}

const generateProgram = () => {
  store.dispatch('generateProgram')
}

const toggleRace = () => {
  if (isRaceActive.value) {
    store.dispatch('pauseRace')
  } else {
    store.dispatch('startRace')
  }
}

const resetEverything = () => {
  store.dispatch('resetRace')
}
</script>

<style scoped>
.navbar {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 1rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.logo {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1;
}

.subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

.controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.control-btn {
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.control-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.start-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
  font-weight: 700;
}

.start-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.reset-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border: none;
  color: white;
  font-weight: 700;
}

.reset-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .controls {
    order: 2;
    flex-wrap: wrap;
    justify-content: center;
  }

  .logo-section {
    order: 1;
    align-items: center;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    width: 100%;
  }

  .control-btn {
    width: 100%;
  }
}
</style>
