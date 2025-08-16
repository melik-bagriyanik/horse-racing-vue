<template>
  <header class="navbar">
    <div class="container">
      <h1 class="logo">Horse Racing</h1>
      <nav class="nav-links">
        <a href="#">Home</a>
        <a href="#">Programs</a>
        <a href="#">Results</a>
      </nav>
      <nav>
        <BaseButton 
          @click="generateHorseList" 
          style="margin-right: 0.5rem"
          :disabled="isRaceActive"
        >
          Generate Horse List
        </BaseButton>
        <BaseButton 
          @click="generateProgram" 
          style="margin-right: 0.5rem"
          :disabled="isRaceActive || horses.length === 0"
        >
          Generate Program
        </BaseButton>
        <BaseButton 
          @click="toggleRace" 
          variant="secondary"
          :disabled="racingHorses.length === 0"
        >
          {{ isRaceActive ? 'Pause' : 'Start' }}
        </BaseButton>
      </nav>
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
</script>

<style scoped>
.navbar {
  width: 100%;
  background-color: #f9fafb;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4f46e5;
}

.nav-links a {
  margin-right: 1rem;
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #4f46e5;
}
</style>
