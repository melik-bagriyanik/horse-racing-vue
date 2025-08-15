<template>
  <div class="horse-color" :style="{ backgroundColor: colorValue }"></div>
</template>

<script>
export default {
  name: 'HorseColoredBall',
  props: {
    color: {
      type: String,
      required: true,
    },
  },
  computed: {
    colorValue() {
      const colorMap = {
        Red: '#ff4444',
        Blue: '#4444ff',
        Green: '#44ff44',
        Yellow: '#ffff44',
        Purple: '#ff44ff',
        Orange: '#ff8844',
        Pink: '#ff4488',
        Brown: '#884444',
        Black: '#444444',
        White: '#ffffff',
        Gray: '#888888',
        Cyan: '#44ffff',
        Magenta: '#ff44ff',
        Lime: '#88ff44',
        Navy: '#444488',
        Teal: '#448888',
        Maroon: '#884444',
        Olive: '#888844',
        Silver: '#cccccc',
        Gold: '#ffcc44',
      }
      return colorMap[this.color] || '#666666'
    },
  },
}
</script>

<style scoped>
.horse-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
