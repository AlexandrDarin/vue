<template>
  <div class="color-picker">
    <label v-if="label" class="picker-label">{{ label }}</label>
    
    <div class="picker-container">
      <div 
        class="color-preview" 
        :style="{ backgroundColor: modelValue }"
        @click="showPicker = !showPicker"
      ></div>
      
      <div class="picker-inputs">
        <input
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          class="color-input"
          type="text"
          placeholder="#FFFFFF"
          @focus="showPicker = true"
        />
        
        <button 
          v-if="modelValue" 
          @click="$emit('update:modelValue', '')"
          class="clear-btn"
          title="Очистить"
        >
          ×
        </button>
      </div>
    </div>
    
    <div v-if="showPicker" class="color-picker-modal">
      <div class="picker-header">
        <h4>Выберите цвет</h4>
        <button @click="showPicker = false" class="close-btn">×</button>
      </div>
      
      <div class="picker-body">
        <!-- Простой пикер цветов -->
        <div class="color-grid">
          <div 
            v-for="preset in colorPresets" 
            :key="preset"
            class="preset-color"
            :style="{ backgroundColor: preset }"
            @click="selectColor(preset)"
          ></div>
        </div>
        
        <!-- Пользовательский ввод -->
        <div class="custom-color">
          <input
            v-model="customColor"
            type="color"
            class="color-input-native"
            @input="selectColor(customColor)"
          />
          <span>Или выберите свой</span>
        </div>
        
        <!-- Предпросмотр -->
        <div class="color-preview-large" :style="{ backgroundColor: previewColor }">
          <div class="preview-text" :style="{ color: getContrastColor(previewColor) }">
            {{ previewColor }}
          </div>
        </div>
      </div>
      
      <div class="picker-footer">
        <button @click="selectRandomColor" class="random-btn">
          🎲 Случайный цвет
        </button>
        <button @click="applyColor" class="apply-btn">
          Применить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '#42b883'
  },
  label: {
    type: String,
    default: ''
  },
  presets: {
    type: Array,
    default: () => [
      '#42b883', '#35495e', '#ff6b6b', '#4ecdc4', '#ffd166',
      '#118ab2', '#06d6a0', '#ef476f', '#ff9a76', '#7b68ee',
      '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51', '#264653'
    ]
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const showPicker = ref(false)
const customColor = ref(props.modelValue)
const previewColor = ref(props.modelValue)

const colorPresets = computed(() => props.presets)

const getContrastColor = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

const selectColor = (color) => {
  previewColor.value = color
  customColor.value = color
}

const selectRandomColor = () => {
  const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  selectColor(randomColor)
}

const applyColor = () => {
  emit('update:modelValue', previewColor.value)
  emit('change', previewColor.value)
  showPicker.value = false
}

watch(() => props.modelValue, (newVal) => {
  previewColor.value = newVal
  customColor.value = newVal
})

// Следим за нажатием Escape для закрытия пикера
const handleKeydown = (e) => {
  if (e.key === 'Escape' && showPicker.value) {
    showPicker.value = false
  }
}

window.addEventListener('keydown', handleKeydown)
</script>

<style scoped>
.color-picker {
  position: relative;
}

.picker-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--color-heading);
}

.picker-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid var(--color-border);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-preview:hover {
  transform: scale(1.1);
}

.picker-inputs {
  flex: 1;
  position: relative;
}

.color-input {
  width: 100%;
  padding: 8px 35px 8px 12px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  background-color: var(--color-background);
  color: var(--color-text);
}

.clear-btn {
  position: absolute;
  right: 8px;
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

/* Модальное окно пикера */
.color-picker-modal {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 20px;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.picker-header h4 {
  margin: 0;
  color: var(--color-heading);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--color-text-soft);
  line-height: 1;
}

.close-btn:hover {
  color: var(--color-error);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.preset-color {
  aspect-ratio: 1;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 2px solid transparent;
}

.preset-color:hover {
  transform: scale(1.1);
  border-color: var(--color-primary);
}

.custom-color {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.color-input-native {
  width: 50px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
}

.custom-color span {
  font-size: 14px;
  color: var(--color-text-soft);
}

.color-preview-large {
  height: 60px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-border);
}

.preview-text {
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: bold;
  font-size: 14px;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  backdrop-filter: blur(5px);
}

.picker-footer {
  display: flex;
  gap: 10px;
}

.random-btn,
.apply-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.random-btn {
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

.random-btn:hover {
  background-color: var(--color-background-mute);
}

.apply-btn {
  background-color: var(--color-primary);
  color: white;
}

.apply-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
</style>