<template>
  <div class="condition-bar-container">
    <div
      class="condition-bar"
      :style="{ width: conditionPercentage + '%', backgroundColor: conditionColor }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'HorseConditionBar',
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
    conditionPercentage() {
      return this.horse.condition
    },
    conditionColor() {
      const condition = this.horse.condition
      if (condition >= 80) return '#10b981' // Yeşil - çok iyi
      if (condition >= 60) return '#f59e0b' // Turuncu - iyi
      if (condition >= 40) return '#f97316' // Kırmızı-turuncu - orta
      return '#ef4444' // Kırmızı - kötü
    },
  },
}
</script>

<style scoped>
.condition-bar-container {
  width: 100%;
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.condition-bar {
  height: 100%;
  border-radius: 3px;
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
  position: relative;
}

.condition-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
