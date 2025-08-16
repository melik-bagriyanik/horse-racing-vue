<template>
  <div class="panel">
    <div class="panel-header">Horse List (1-20)</div>
    <div class="horse-list">
      <HorseItem v-for="horse in horses" :key="horse.id" :horse="horse" />
    </div>
  </div>
</template>

<script>
import HorseItem from '../molecules/HorseItem.vue'

export default {
  name: 'HorseList',
  components: {
    HorseItem,
  },
  props: {
    horses: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped>
.panel {
  width: 200px;
  padding: 20px;
}
</style>
