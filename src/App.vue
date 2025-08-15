<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import BaseButton from './components/atoms/BaseButton.vue'
import Header from './components/organisms/Header.vue'
import HorsesList from './components/organisms/HorsesList.vue'
</script>

<template>
  <Header />

  <main>
    <HorsesList
      :horses="[
        { id: 1, name: 'Seabiscuit', color: 'Red', condition: 12 },
        { id: 2, name: 'Secretariat', color: 'Blue', condition: 8 },
        { id: 3, name: 'Man o\' War', color: 'Brown', condition: 5 },
      ]"
    />
  </main>
</template>

<style scoped></style>
