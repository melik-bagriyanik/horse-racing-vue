<template>
  <div class="horse-item" :style="{ borderLeftColor: colorValue }">
    <span class="horse-name">{{ horse.name }}</span>
    <span class="horse-condition">{{ horse.condition }}</span>
  </div>
</template>

<script>
export default {
  name: 'HorseItem',
  props: {
    horse: {
      type: Object,
      required: true,
    },
  },
  computed: {
    colorValue() {
      return this.horse.color.toLowerCase()
    },
  },
}
</script>

<style scoped>
.horse-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-left: 4px solid transparent;
  margin-bottom: 8px;
  transition: border-color 0.3s ease;
}
</style>
