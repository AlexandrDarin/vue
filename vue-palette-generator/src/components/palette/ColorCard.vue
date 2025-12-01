<template>
  <div 
    class="color-card" 
    :class="{ 'is-locked': color.locked, 'is-copied': isCopied }"
    :style="{ backgroundColor: color.hex }"
    @click="handleClick"
    @contextmenu.prevent="handleRightClick"
  >
    <div class="color-overlay" :style="{ color: textColor }">
      <div class="color-info">
        <div class="color-value">
          {{ format === 'hex' ? color.hex : color.rgb }}
        </div>
        <div class="color-name" v-if="color.name">
          {{ color.name }}
        </div>
      </div>
      
      <div class="color-actions">
        <button 
          v-if="color.locked" 
          class="action-btn lock-btn"
          :title="'Разблокировать: ' + (color.name || 'Цвет')"
          @click.stop="toggleLock"
        >
          🔒
        </button>
        <button 
          v-else 
          class="action-btn lock-btn"
          :title="'Заблокировать: ' + (color.name || 'Цвет')"
          @click.stop="toggleLock"
        >
          🔓
        </button>
        
        <button 
          class="action-btn edit-btn"
          :title="'Редактировать: ' + (color.name || 'Цвет')"
          @click.stop="handleEdit"
        >
          ✏️
        </button>
        
        <!-- Слот для дополнительных действий -->
        <slot name="actions"></slot>
      </div>
    </div>
    
    <!-- Слот по умолчанию -->
    <slot>
      <div v-if="isCopied" class="copy-notification">
        ✓ Скопировано!
      </div>
    </slot>
    
    <!-- Индикатор доступности -->
    <div v-if="showAccessibility" class="accessibility-badge" :class="accessibilityClass">
      {{ accessibilityText }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  color: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.hex && value.rgb
    }
  },
  format: {
    type: String,
    default: 'hex',
    validator: (value) => ['hex', 'rgb', 'hsl'].includes(value)
  },
  showAccessibility: {
    type: Boolean,
    default: false
  },
  contrastColor: {
    type: String,
    default: '#ffffff'
  }
})

const emit = defineEmits([
  'color-click',
  'color-lock',
  'color-edit',
  'color-copy',
  'update:color'
])

const isCopied = ref(false)
const isHovered = ref(false)

// Вычисляемые свойства
const textColor = computed(() => {
  // Выбираем контрастный цвет текста
  const hex = props.color.hex
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
})

const contrastRatio = computed(() => {
  const getLuminance = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    
    const [rs, gs, bs] = [r, g, b].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    )
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }
  
  const l1 = getLuminance(props.color.hex)
  const l2 = getLuminance(props.contrastColor)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
})

const accessibilityClass = computed(() => {
  const ratio = contrastRatio.value
  if (ratio >= 7) return 'aaa'
  if (ratio >= 4.5) return 'aa'
  if (ratio >= 3) return 'a'
  return 'fail'
})

const accessibilityText = computed(() => {
  const ratio = contrastRatio.value
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'A'
  return 'FAIL'
})

// Методы
const handleClick = async () => {
  const text = props.format === 'hex' ? props.color.hex : props.color.rgb
  try {
    await navigator.clipboard.writeText(text)
    isCopied.value = true
    emit('color-copy', props.color, text)
    
    // Сбрасываем состояние через 2 секунды
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Не удалось скопировать:', err)
  }
}

const handleRightClick = (event) => {
  event.preventDefault()
  toggleLock()
}

const toggleLock = () => {
  const updatedColor = { ...props.color, locked: !props.color.locked }
  emit('update:color', updatedColor)
  emit('color-lock', updatedColor)
}

const handleEdit = () => {
  emit('color-edit', props.color)
}

// Экспортируем контрастность для использования в родительском компоненте
defineExpose({ contrastRatio })
</script>

<style scoped>
.color-card {
  position: relative;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 3px solid transparent;
}

.color-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.color-card.is-locked {
  border-color: var(--color-primary);
}

.color-card.is-copied {
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.color-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  backdrop-filter: blur(5px);
}

.color-info {
  margin-bottom: 10px;
}

.color-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  word-break: break-all;
}

.color-name {
  font-size: 12px;
  opacity: 0.9;
}

.color-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.copy-notification {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  animation: fadeInOut 2s ease;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; transform: translateY(-10px); }
  10%, 90% { opacity: 1; transform: translateY(0); }
}

.accessibility-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
}

.accessibility-badge.aaa {
  background-color: #10b981;
}

.accessibility-badge.aa {
  background-color: #3b82f6;
}

.accessibility-badge.a {
  background-color: #f59e0b;
}

.accessibility-badge.fail {
  background-color: #ef4444;
}
</style>