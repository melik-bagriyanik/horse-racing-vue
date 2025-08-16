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
      validator: (value) =>
        ['primary', 'secondary', 'success', 'warning', 'danger'].includes(value),
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
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: none;
  letter-spacing: 0.025em;
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 120px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
  scale: 0.98;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(90deg, rgba(68, 201, 104, 1) 0%, rgba(38, 77, 41, 1) 50%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(90deg, rgb(27, 115, 50) 0%, rgb(72, 162, 79) 50%);
  color: white;
  color: white;
}

.btn-success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.btn-warning {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.btn-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  background: #e5e7eb !important;
  color: #9ca3af !important;
}

.btn:disabled::before {
  display: none;
}
</style>
