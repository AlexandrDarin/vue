<template>
  <button 
    class="neon-button"
    :class="{
      [`size-${size}`]: true,
      [`variant-${variant}`]: true,
      'is-loading': loading,
      'is-disabled': disabled
    }"
    :style="buttonStyle"
    @click="handleClick"
    :disabled="disabled || loading"
  >
    <div class="button-glow"></div>
    <div class="button-content">
      <span v-if="loading" class="button-loader"></span>
      <span v-else class="button-icon" v-show="icon">{{ icon }}</span>
      <span class="button-text" v-show="showText">{{ text }}</span>
      <span class="button-badge" v-if="badge">{{ badge }}</span>
    </div>
    <div class="button-sparkles" v-if="sparkles">
      <span v-for="i in 3" :key="i" class="sparkle"></span>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: 'Button'
  },
  icon: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'accent', 'success', 'warning', 'error'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  sparkles: {
    type: Boolean,
    default: true
  },
  badge: {
    type: String,
    default: ''
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const showText = computed(() => props.text && !props.loading)

const buttonStyle = computed(() => {
  const variants = {
    primary: 'var(--gradient-primary)',
    secondary: 'var(--gradient-primary)',
    accent: 'var(--gradient-accent)',
    success: 'linear-gradient(135deg, var(--color-success), var(--color-accent))',
    warning: 'linear-gradient(135deg, var(--color-warning), var(--color-error))',
    error: 'linear-gradient(135deg, var(--color-error), var(--color-warning))'
  }
  
  return {
    '--button-gradient': variants[props.variant],
    '--button-glow': `var(--color-${props.variant}-glow)`,
    width: props.fullWidth ? '100%' : 'auto'
  }
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.neon-button {
  position: relative;
  border: none;
  border-radius: var(--radius-full);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.neon-button:disabled,
.neon-button.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Размеры */
.neon-button.size-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.neon-button.size-medium {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.neon-button.size-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Варианты */
.neon-button {
  background: var(--button-gradient);
  color: white;
}

.neon-button:hover:not(:disabled):not(.is-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 0 20px var(--button-glow), 0 0 40px var(--button-glow);
}

.neon-button:active:not(:disabled):not(.is-disabled) {
  transform: translateY(0);
}

/* Свечение */
.button-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, var(--button-glow) 0%, transparent 70%);
  opacity: 0;
  transition: opacity var(--transition-normal);
  pointer-events: none;
}

.neon-button:hover:not(:disabled):not(.is-disabled) .button-glow {
  opacity: 0.3;
}

/* Контент */
.button-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.button-icon {
  font-size: 1.2em;
  transition: transform var(--transition-normal);
}

.neon-button:hover:not(:disabled):not(.is-disabled) .button-icon {
  transform: scale(1.2) rotate(10deg);
}

/* Загрузка */
.button-loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Бейдж */
.button-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.75em;
  backdrop-filter: blur(10px);
}

/* Спарклы */
.button-sparkles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.neon-button:hover:not(:disabled):not(.is-disabled) .button-sparkles {
  opacity: 1;
}

.sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: sparkle 1.5s ease-in-out infinite;
}

.sparkle:nth-child(1) {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.sparkle:nth-child(2) {
  top: 60%;
  right: 30%;
  animation-delay: 0.5s;
}

.sparkle:nth-child(3) {
  bottom: 30%;
  left: 40%;
  animation-delay: 1s;
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>