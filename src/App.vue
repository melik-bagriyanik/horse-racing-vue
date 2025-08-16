<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import BaseButton from './components/atoms/BaseButton.vue'
import Header from './components/organisms/Header.vue'
import HorsesList from './components/organisms/HorsesList.vue'
import ProgramsAndResults from './components/organisms/ProgramsAndResults.vue'
import Racefield from './components/organisms/Racefield.vue'
</script>

<template>
  <Header />

  <main>
    <HorsesList />
    <Racefield />
    <ProgramsAndResults />
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: space-between;
}
</style>
