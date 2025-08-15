<template>
  <button :class="buttonClasses" :disabled="disabled" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary'].includes(value),
    },
    //buttonun pasif olması gereken durumlarda kullanmak için
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonClasses() {
      return ['btn', `btn-${this.variant}`]
    },
  },
  emits: ['click'],
}
</script>

<style scoped>
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.btn:active {
  transform: translateY(0);
  scale: 0.95;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.btn-primary {
  background: linear-gradient(45deg, #4caf50, #45a049);
  color: white;
}

.btn-secondary {
  background: linear-gradient(45deg, #2196f3, #1976d2);
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}
</style>
