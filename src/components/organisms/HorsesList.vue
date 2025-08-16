<template>
  <div class="panel">
    <div class="panel-header">Horse List (1-20)</div>
    <div class="horse-list">
      <HorseItem v-for="horse in horses" :key="horse.id" :horse="horse" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import HorseItem from '../molecules/HorseItem.vue'

const store = useStore()

const horses = computed(() => store.state.horses.horses)
</script>

<style scoped>
.panel {
  width: 200px;
  padding: 20px;
  overflow-y: auto;
}
</style>
