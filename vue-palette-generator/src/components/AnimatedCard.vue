<template>
  <div 
    class="animated-card" 
    :class="{ 'has-glow': glow, 'is-hoverable': hoverable }"
    :style="cardStyle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="card-glow" v-if="glow"></div>
    <div class="card-content">
      <slot></slot>
    </div>
    <div class="card-shine" v-if="shine && isHovered"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  glow: {
    type: Boolean,
    default: true
  },
  shine: {
    type: Boolean,
    default: true
  },
  hoverable: {
    type: Boolean,
    default: true
  },
  gradient: {
    type: String,
    default: 'primary'
  },
  padding: {
    type: String,
    default: '1.5rem'
  }
})

const isHovered = ref(false)

const cardStyle = computed(() => {
  const gradients = {
    primary: 'var(--gradient-primary)',
    accent: 'var(--gradient-accent)',
    success: 'linear-gradient(135deg, var(--color-success), var(--color-accent))',
    warning: 'linear-gradient(135deg, var(--color-warning), var(--color-error))'
  }
  
  return {
    '--card-gradient': gradients[props.gradient] || gradients.primary,
    '--card-padding': props.padding
  }
})
</script>

<style scoped>
.animated-card {
  position: relative;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--card-padding);
  transition: all var(--transition-normal);
  overflow: hidden;
}

.animated-card.has-glow::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: var(--card-gradient);
  border-radius: calc(var(--radius-lg) + 2px);
  z-index: -1;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.animated-card.has-glow:hover::before {
  opacity: 0.3;
}

.animated-card.is-hoverable:hover {
  transform: translateY(-5px);
  border-color: var(--color-primary);
  box-shadow: var(--neon-glow);
}

.card-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%);
  opacity: 0.1;
  pointer-events: none;
  animation: glow 3s ease-in-out infinite;
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  transform: rotate(45deg);
  animation: shine 2s ease-in-out;
}

@keyframes shine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

.animated-card:hover .card-shine {
  animation: shine 0.5s ease-in-out;
}
</style>