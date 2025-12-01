<template>
  <div class="palette-preview">
    <div class="preview-controls">
      <h3>Превью интерфейса</h3>
      <div class="bg-toggle">
        <button 
          @click="setBackground('light')" 
          :class="{ active: background === 'light' }"
          class="bg-btn"
        >
          🌞 Светлый
        </button>
        <button 
          @click="setBackground('dark')" 
          :class="{ active: background === 'dark' }"
          class="bg-btn"
        >
          🌚 Темный
        </button>
      </div>
    </div>

    <!-- Mockup интерфейса -->
    <div class="mockup" :class="background">
      <div class="mockup-header">
        <div class="logo" :style="{ color: colors[0]?.hex || '#42b883' }">
          🎨 VuePalette
        </div>
        <nav>
          <a href="#" :style="{ color: colors[1]?.hex || '#64748b' }">Главная</a>
          <a href="#" :style="{ color: colors[1]?.hex || '#64748b' }">Генератор</a>
          <a href="#" :style="{ color: colors[1]?.hex || '#64748b' }">Палитры</a>
        </nav>
      </div>

      <div class="mockup-content">
        <div class="card" :style="{ 
          backgroundColor: background === 'dark' ? '#334155' : '#f8fafc',
          borderColor: colors[2]?.hex || '#e2e8f0'
        }">
          <h4 :style="{ color: colors[0]?.hex || '#42b883' }">
            Пример карточки
          </h4>
          <p :style="{ color: colors[1]?.hex || '#64748b' }">
            Это демонстрация использования цветов вашей палитры в интерфейсе.
            Все элементы стилизованы с помощью текущих цветов.
          </p>
          <div class="actions">
            <button 
              class="btn-primary"
              :style="{ 
                backgroundColor: colors[3]?.hex || '#42b883',
                color: getTextColor(colors[3]?.hex || '#42b883')
              }"
            >
              Основное действие
            </button>
            <button 
              class="btn-secondary"
              :style="{ 
                borderColor: colors[4]?.hex || '#cbd5e1',
                color: colors[4]?.hex || '#64748b'
              }"
            >
              Второстепенное
            </button>
          </div>
        </div>
      </div>

      <div class="mockup-footer">
        <p :style="{ color: colors[1]?.hex || '#64748b' }">
          © 2024 Vue Palette Generator
        </p>
      </div>
    </div>

    <!-- Информация о контрасте -->
    <div class="contrast-info">
      <h3>Проверка контрастности</h3>
      <div v-if="colors.length >= 2" class="contrast-grid">
        <div 
          v-for="(bgColor, bgIndex) in colors.slice(0, 3)" 
          :key="'bg' + bgIndex"
          class="contrast-row"
        >
          <div 
            v-for="(textColor, textIndex) in colors.slice(0, 3)" 
            :key="'text' + textIndex"
            class="contrast-sample"
            :style="{ 
              backgroundColor: bgColor.hex,
              color: textColor.hex
            }"
            @click="showContrastInfo(bgColor, textColor)"
          >
            <span class="sample-text">Aa</span>
            <span class="contrast-ratio">
              {{ getContrastRatio(bgColor.hex, textColor.hex) }}:1
            </span>
          </div>
        </div>
      </div>
      <div v-else class="no-contrast">
        <p>Недостаточно цветов для проверки контраста</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const background = ref('light')
const colors = ref([])

const setBackground = (type) => {
  background.value = type
}

const getTextColor = (hex) => {
  // Простой расчет яркости
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

const getContrastRatio = (color1, color2) => {
  // Упрощенный расчет контраста
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
  
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2)
}

const showContrastInfo = (bgColor, textColor) => {
  const ratio = parseFloat(getContrastRatio(bgColor.hex, textColor.hex))
  let message = ''
  
  if (ratio >= 7) {
    message = 'Отличный контраст (AAA)'
  } else if (ratio >= 4.5) {
    message = 'Хороший контраст (AA)'
  } else if (ratio >= 3) {
    message = 'Минимальный контраст'
  } else {
    message = 'Недостаточный контраст'
  }
  
  alert(`${message}\nСоотношение: ${ratio}:1\n\nФон: ${bgColor.hex}\nТекст: ${textColor.hex}`)
}

const loadColors = () => {
  const saved = localStorage.getItem('vuePalette')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      colors.value = data.palette || []
    } catch (e) {
      console.error('Ошибка загрузки:', e)
    }
  }
}

onMounted(() => {
  loadColors()
  // Слушаем изменения в хранилище
  window.addEventListener('storage', (e) => {
    if (e.key === 'vuePalette') {
      loadColors()
    }
  })
})
</script>

<style scoped>
.palette-preview {
  max-width: 1200px;
  margin: 0 auto;
}

.preview-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: var(--color-background-soft);
  border-radius: 8px;
}

.preview-controls h3 {
  margin: 0;
  color: var(--color-heading);
}

.bg-toggle {
  display: flex;
  gap: 10px;
}

.bg-btn {
  padding: 8px 16px;
  border: 2px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bg-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.bg-btn:hover:not(.active) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.mockup {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.mockup.light {
  background: #f1f5f9;
}

.mockup.dark {
  background: #0f172a;
}

.mockup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: inherit;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.mockup-header nav {
  display: flex;
  gap: 20px;
}

.mockup-header nav a {
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.mockup-header nav a:hover {
  opacity: 0.7;
}

.mockup-content {
  padding: 30px;
}

.card {
  padding: 25px;
  border-radius: 10px;
  border: 2px solid;
  max-width: 600px;
  margin: 0 auto;
}

.card h4 {
  margin-bottom: 15px;
  font-size: 20px;
}

.card p {
  line-height: 1.6;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 15px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-primary {
  border: none;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
}

.btn-secondary:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

.mockup-footer {
  padding: 20px 30px;
  text-align: center;
  border-top: 1px solid;
}

.mockup.light .mockup-footer {
  border-color: #e2e8f0;
}

.mockup.dark .mockup-footer {
  border-color: #334155;
}

.contrast-info {
  background: var(--color-background-soft);
  border-radius: 8px;
  padding: 20px;
}

.contrast-info h3 {
  margin-bottom: 15px;
  color: var(--color-heading);
}

.contrast-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contrast-row {
  display: flex;
  gap: 10px;
}

.contrast-sample {
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

.contrast-sample:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.sample-text {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.contrast-ratio {
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', monospace;
  opacity: 0.8;
}

.no-contrast {
  text-align: center;
  padding: 30px;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .preview-controls {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .bg-toggle {
    justify-content: center;
  }
  
  .mockup-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .contrast-row {
    flex-direction: column;
  }
  
  .contrast-sample {
    aspect-ratio: 3/1;
  }
}
</style>