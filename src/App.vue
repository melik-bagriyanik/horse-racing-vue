<script setup lang="ts">
import Header from './components/organisms/Header.vue'
import HorsesList from './components/organisms/HorsesList.vue'
import ProgramsAndResults from './components/organisms/ProgramsAndResults.vue'
import Racefield from './components/organisms/Racefield.vue'
</script>

<template>
  <div class="app">
    <Header />

    <main class="main-content">
      <div class="content-grid">
        <section class="horses-section">
          <HorsesList />
        </section>

        <section class="race-section">
          <Racefield />
        </section>

        <section class="programs-section">
          <ProgramsAndResults />
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.main-content {
  padding: 1rem 2rem;

  margin: 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 3fr 2.2fr;
  gap: 1rem;
  height: calc(100vh - 120px);
}

.horses-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0px 0px 18px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow-y: auto;
}

.race-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.programs-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
  }

  .horses-section {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .race-section {
    grid-column: 1 / 3;
    grid-row: 2 / 3;
  }

  .programs-section {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: 1rem;
    height: auto;
  }

  .horses-section,
  .race-section,
  .programs-section {
    grid-column: 1 / 2;
  }

  .horses-section {
    grid-row: 1 / 2;
    overflow-y: auto;
  }

  .race-section {
    grid-row: 2 / 3;
  }

  .programs-section {
    grid-row: 3 / 4;
  }
}
</style>
