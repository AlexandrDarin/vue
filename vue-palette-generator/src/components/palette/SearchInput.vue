<template>
  <div class="search-input">
    <label v-if="label" class="search-label">{{ label }}</label>
    
    <div class="input-wrapper">
      <span class="search-icon">🔍</span>
      <input
        :value="modelValue"
        @input="handleInput"
        @keyup.enter="$emit('search', modelValue)"
        :placeholder="placeholder"
        class="search-field"
        type="text"
      />
      
      <button 
        v-if="modelValue" 
        @click="clearSearch"
        class="clear-btn"
        title="Очистить поиск"
      >
        ×
      </button>
      
      <button 
        @click="$emit('search', modelValue)"
        class="search-btn"
        :disabled="!modelValue"
      >
        Найти
      </button>
    </div>
    
    <!-- Слот для дополнительных фильтров -->
    <div class="filters">
      <slot name="filters"></slot>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Поиск...'
  },
  debounce: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits([
  'update:modelValue',
  'search',
  'reset',
  'input'
])

let timeoutId = null

const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('input', value)
  
  // Дебаунс для поиска
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    emit('search', value)
  }, props.debounce)
}

const clearSearch = () => {
  emit('update:modelValue', '')
  emit('reset')
  emit('search', '')
}

// Экспортируем метод очистки
defineExpose({ clearSearch })

// Очищаем таймер при размонтировании
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<style scoped>
.search-input {
  width: 100%;
}

.search-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--color-heading);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-soft);
}

.search-field {
  flex: 1;
  padding: 10px 40px 10px 40px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.3s ease;
}

.search-field:focus {
  outline: none;
  border-color: var(--color-primary);
}

.clear-btn {
  position: absolute;
  right: 110px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--color-text-soft);
}

.clear-btn:hover {
  color: var(--color-error);
}

.search-btn {
  padding: 10px 20px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.search-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filters {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>