<template>
  <div class="horse-item" :style="{ borderLeftColor: colorValue }">
    <div class="horse-info">
      <span class="horse-name">{{ horse.name }}</span>
      <span class="horse-condition">{{ horse.condition }}</span>
    </div>
    <HorseConditionBar :horse="horse"></HorseConditionBar>
  </div>
</template>

<script>
import HorseConditionBar from '../atoms/HorseConditionBar.vue'

export default {
  name: 'HorseItem',
  components: {
    HorseConditionBar,
  },
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
  flex-direction: column;
  padding: 12px;
  border-left: 4px solid transparent;
  margin-bottom: 8px;
  transition: border-color 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.horse-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.horse-name {
  font-weight: 600;
  color: #374151;
  flex: 1;
}

.horse-condition {
  font-weight: 700;
  color: #6b7280;
  margin-left: 12px;
  min-width: 30px;
  text-align: right;
}
</style>
