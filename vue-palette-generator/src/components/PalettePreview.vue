<template>
  <div class="palette-preview" :class="theme">
    <div class="preview-content">
      <!-- Шапка -->
      <div class="preview-header">
        <div class="logo" :style="{ color: colors[0]?.hex || '#42b883' }">
          🎨 Palette App
        </div>
        <nav class="preview-nav">
          <a href="#" :style="{ color: colors[1]?.hex || '#666' }">Home</a>
          <a href="#" :style="{ color: colors[1]?.hex || '#666' }">About</a>
          <a href="#" :style="{ color: colors[1]?.hex || '#666' }">Contact</a>
        </nav>
      </div>

      <!-- Герой секция -->
      <div class="preview-hero">
        <h1 :style="{ color: colors[0]?.hex || '#333' }">
          Welcome to Our App
        </h1>
        <p :style="{ color: colors[1]?.hex || '#666' }">
          This is a preview of how your palette looks in a real interface
        </p>
        <button 
          class="hero-btn"
          :style="{ 
            backgroundColor: colors[2]?.hex || '#42b883',
            color: getContrastColor(colors[2]?.hex || '#42b883')
          }"
        >
          Get Started
        </button>
      </div>

      <!-- Карточки -->
      <div class="preview-cards">
        <div 
          v-for="(color, index) in colors.slice(0, 3)" 
          :key="index"
          class="preview-card"
          :style="{ 
            backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f9f9f9',
            borderColor: color.hex
          }"
        >
          <div 
            class="card-icon"
            :style="{ backgroundColor: color.hex }"
          ></div>
          <h3 :style="{ color: color.hex }">
            Feature {{ index + 1 }}
          </h3>
          <p :style="{ color: colors[1]?.hex || '#666' }">
            This feature uses your color palette to create a cohesive design.
          </p>
        </div>
      </div>

      <!-- Статистика -->
      <div class="preview-stats">
        <div 
          v-for="(color, index) in colors.slice(3, 6)" 
          :key="index"
          class="stat-item"
          :style="{ borderLeftColor: color.hex }"
        >
          <div class="stat-value" :style="{ color: color.hex }">
            {{ (index + 1) * 100 }}
          </div>
          <div class="stat-label" :style="{ color: colors[1]?.hex || '#666' }">
            Statistic {{ index + 1 }}
          </div>
        </div>
      </div>

      <!-- Футер -->
      <div class="preview-footer">
        <p :style="{ color: colors[1]?.hex || '#666' }">
          © 2024 Palette Generator Preview
        </p>
        <div class="footer-links">
          <a href="#" :style="{ color: colors[3]?.hex || '#42b883' }">Privacy</a>
          <a href="#" :style="{ color: colors[3]?.hex || '#42b883' }">Terms</a>
          <a href="#" :style="{ color: colors[3]?.hex || '#42b883' }">Contact</a>
        </div>
      </div>
    </div>

    <!-- Информация о контрасте -->
    <div v-if="colors.length >= 2" class="contrast-info">
      <h4>Контрастность цветов:</h4>
      <div class="contrast-grid">
        <div 
          v-for="(bgColor, bgIndex) in colors.slice(0, 3)" 
          :key="'bg' + bgIndex"
          class="contrast-row"
        >
          <div 
            v-for="(textColor, textIndex) in colors.slice(0, 3)" 
            :key="'text' + textIndex"
            class="contrast-cell"
            :style="{ 
              backgroundColor: bgColor.hex,
              color: textColor.hex
            }"
            @click="showContrastDetails(bgColor, textColor)"
          >
            <span class="contrast-text">Aa</span>
            <span class="contrast-ratio">
              {{ getContrastRatio(bgColor.hex, textColor.hex) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  colors: {
    type: Array,
    default: () => []
  },
  theme: {
    type: String,
    default: 'light',
    validator: (value) => ['light', 'dark'].includes(value)
  }
})

// Вычисляемые свойства
const hasColors = computed(() => props.colors.length > 0)

// Методы
const getContrastColor = (hex) => {
  if (!hex || hex.length !== 7) return '#ffffff'
  
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

const getContrastRatio = (color1, color2) => {
  if (!color1 || !color2) return 'N/A'
  
  const getLuminance = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    
    const [rs, gs, bs] = [r, g, b].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    )
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }
  
  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  const ratio = ((lighter + 0.05) / (darker + 0.05)).toFixed(2)
  
  if (ratio >= 7) return `${ratio} (AAA)`
  if (ratio >= 4.5) return `${ratio} (AA)`
  if (ratio >= 3) return `${ratio} (A)`
  return `${ratio} (Fail)`
}

const showContrastDetails = (bgColor, textColor) => {
  const ratio = getContrastRatio(bgColor.hex, textColor.hex)
  alert(`Контрастность:\n\nФон: ${bgColor.hex}\nТекст: ${textColor.hex}\n\nСоотношение: ${ratio}`)
}

// Если нет цветов, используем дефолтные
const defaultColors = [
  { hex: '#42b883', rgb: 'rgb(66, 184, 131)' },
  { hex: '#35495e', rgb: 'rgb(53, 73, 94)' },
  { hex: '#ff6b6b', rgb: 'rgb(255, 107, 107)' },
  { hex: '#4ecdc4', rgb: 'rgb(78, 205, 196)' },
  { hex: '#ffd166', rgb: 'rgb(255, 209, 102)' }
]

const displayColors = computed(() => {
  return props.colors.length > 0 ? props.colors : defaultColors
})
</script>

<style scoped>
.palette-preview {
  border-radius: 12px;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.palette-preview.light {
  background-color: #ffffff;
}

.palette-preview.dark {
  background-color: #1a1a1a;
}

.preview-content {
  padding: 2rem;
}

/* Шапка */
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid;
}

.palette-preview.light .preview-header {
  border-color: #eee;
}

.palette-preview.dark .preview-header {
  border-color: #333;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.preview-nav {
  display: flex;
  gap: 1.5rem;
}

.preview-nav a {
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.preview-nav a:hover {
  opacity: 0.7;
}

/* Герой секция */
.preview-hero {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  border-radius: 8px;
}

.palette-preview.light .preview-hero {
  background-color: #f9f9f9;
}

.palette-preview.dark .preview-hero {
  background-color: #2a2a2a;
}

.preview-hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.preview-hero p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.hero-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* Карточки */
.preview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.preview-card {
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid;
  transition: transform 0.3s ease;
}

.preview-card:hover {
  transform: translateY(-5px);
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.preview-card h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.preview-card p {
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Статистика */
.preview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-item {
  padding: 1rem;
  border-left: 4px solid;
  background-color: var(--color-background-soft);
  border-radius: 4px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Футер */
.preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid;
}

.palette-preview.light .preview-footer {
  border-color: #eee;
}

.palette-preview.dark .preview-footer {
  border-color: #333;
}

.footer-links {
  display: flex;
  gap: 1rem;
}

.footer-links a {
  text-decoration: none;
  font-size: 0.9rem;
  transition: opacity 0.3s ease;
}

.footer-links a:hover {
  opacity: 0.7;
}

/* Информация о контрасте */
.contrast-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
}

.contrast-info h4 {
  margin: 0 0 1rem 0;
  color: var(--color-heading);
}

.contrast-grid {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.contrast-row {
  display: flex;
  gap: 5px;
}

.contrast-cell {
  flex: 1;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.contrast-cell:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.contrast-text {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 2px;
}

.contrast-ratio {
  font-size: 10px;
  opacity: 0.8;
  font-family: 'Monaco', 'Menlo', monospace;
}

@media (max-width: 768px) {
  .preview-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .preview-hero h1 {
    font-size: 2rem;
  }
  
  .preview-cards {
    grid-template-columns: 1fr;
  }
  
  .preview-footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .contrast-row {
    flex-direction: column;
  }
  
  .contrast-cell {
    aspect-ratio: 3/1;
  }
}
</style>