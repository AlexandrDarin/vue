<template>
  <div class="generator-view">
    <div class="generator-header">
      <h1>🎨 Генератор палитр</h1>
      <p>Создавайте, настраивайте и сохраняйте цветовые схемы</p>
    </div>

    <div class="generator-controls">
      <!-- Левая колонка: Настройки -->
      <div class="controls-left">
        <div class="control-section">
          <h3>Настройки генерации</h3>
          
          <div class="control-group">
            <label>Количество цветов:</label>
            <div class="number-selector">
              <button 
                v-for="num in [3, 5, 7]" 
                :key="num"
                @click="colorsCount = num"
                :class="{ active: colorsCount === num }"
                class="number-btn"
              >
                {{ num }}
              </button>
            </div>
          </div>

          <div class="control-group">
            <label>Тип палитры:</label>
            <select v-model="paletteType" class="select-input">
              <option value="analogous">Аналогичная</option>
              <option value="monochromatic">Монохромная</option>
              <option value="triadic">Триада</option>
              <option value="complementary">Комплементарная</option>
              <option value="split">Разделенная</option>
              <option value="random">Случайная</option>
            </select>
          </div>

          <div class="control-group">
            <label>Настроение:</label>
            <select v-model="mood" class="select-input">
              <option value="calm">Спокойное</option>
              <option value="energetic">Энергичное</option>
              <option value="professional">Профессиональное</option>
              <option value="playful">Игривое</option>
              <option value="nature">Природное</option>
            </select>
          </div>

          <div class="control-group">
            <label>Формат отображения:</label>
            <div class="format-selector">
              <button 
                v-for="fmt in ['hex', 'rgb', 'hsl']" 
                :key="fmt"
                @click="colorFormat = fmt"
                :class="{ active: colorFormat === fmt }"
                class="format-btn"
              >
                {{ fmt.toUpperCase() }}
              </button>
            </div>
          </div>
        </div>

        <!-- Выбор базового цвета -->
        <div class="control-section">
          <h3>Базовый цвет</h3>
          <ColorPicker 
            v-model="baseColor"
            label="Выберите основной цвет:"
            @change="generateFromBaseColor"
          />
        </div>

        <!-- Сохранение -->
        <div class="control-section">
          <h3>Сохранение</h3>
          <div class="save-controls">
            <input
              v-model="paletteName"
              placeholder="Название палитры"
              class="name-input"
            />
            <button @click="savePalette" class="save-btn" :disabled="!palette.length">
              💾 Сохранить палитру
            </button>
            <button @click="clearPalette" class="clear-btn">
              🗑️ Очистить
            </button>
          </div>
        </div>
      </div>

      <!-- Правая колонка: Генерация -->
      <div class="controls-right">
        <div class="action-buttons">
          <button @click="generatePalette" class="generate-btn">
            🎲 Сгенерировать палитру
          </button>
          <button @click="generateByMood" class="mood-btn">
            🎭 По настроению
          </button>
          <button @click="generateHarmonious" class="harmony-btn">
            🎵 Гармоничная
          </button>
        </div>

        <!-- Информация о палитре -->
        <div class="palette-info-card">
          <h3>Информация о палитре</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Цветов:</span>
              <span class="info-value">{{ palette.length }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Закреплено:</span>
              <span class="info-value">{{ lockedColorsCount }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Тип:</span>
              <span class="info-value">{{ getPaletteTypeName(paletteType) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Настроение:</span>
              <span class="info-value">{{ getMoodName(mood) }}</span>
            </div>
          </div>
        </div>

        <!-- Цветовой круг -->
        <div class="color-wheel-section">
          <h3>Цветовой круг</h3>
          <div class="color-wheel">
            <div 
              v-for="color in palette" 
              :key="color.hex"
              class="wheel-color"
              :style="{ 
                backgroundColor: color.hex,
                transform: `rotate(${color.hue}deg) translate(100px)`
              }"
              :title="`${color.hue}°`"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Палитра цветов -->
    <div class="palette-section">
      <h2>Ваша палитра</h2>
      <div v-if="palette.length === 0" class="empty-palette">
        <p>Нажмите "Сгенерировать палитру" чтобы начать</p>
        <button @click="generatePalette" class="empty-generate-btn">
          🎲 Создать первую палитру
        </button>
      </div>

      <div v-else class="palette-grid">
        <ColorCard
          v-for="(color, index) in palette"
          :key="index"
          :color="color"
          :format="colorFormat"
          :show-accessibility="true"
          @update:color="updateColor(index, $event)"
          @color-lock="handleColorLock"
          @color-copy="handleColorCopy"
          @color-edit="editColor(index)"
        >
          <!-- Слот действий для ColorCard -->
          <template #actions>
            <button 
              class="action-btn delete-btn"
              @click.stop="removeColor(index)"
              title="Удалить цвет"
            >
              🗑️
            </button>
          </template>
          
          <!-- Слот по умолчанию -->
          <div v-if="color.contrast" class="contrast-info">
            Контраст: {{ color.contrast.toFixed(2) }}:1
          </div>
        </ColorCard>
      </div>
    </div>

    <!-- Превью палитры -->
    <div class="preview-section">
      <h2>Превью палитры</h2>
      <div class="preview-controls">
        <button 
          @click="previewTheme = 'light'" 
          :class="{ active: previewTheme === 'light' }"
          class="theme-btn"
        >
          🌞 Светлая тема
        </button>
        <button 
          @click="previewTheme = 'dark'" 
          :class="{ active: previewTheme === 'dark' }"
          class="theme-btn"
        >
          🌚 Темная тема
        </button>
      </div>
      
      <PalettePreview 
        :colors="palette"
        :theme="previewTheme"
        class="preview-component"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ColorCard from '../components/palette/ColorCard.vue'
import ColorPicker from '../components/palette/ColorPicker.vue'
import PalettePreview from '../components/PalettePreview.vue'

// Реактивные данные
const colorsCount = ref(5)
const paletteType = ref('analogous')
const mood = ref('calm')
const colorFormat = ref('hex')
const baseColor = ref('#42b883')
const paletteName = ref('Моя палитра')
const previewTheme = ref('light')
const palette = ref([])

// Вычисляемые свойства
const lockedColorsCount = computed(() => {
  return palette.value.filter(color => color.locked).length
})

// Методы генерации
const generatePalette = () => {
  const newPalette = []
  const baseHue = Math.floor(Math.random() * 360)
  
  // Сохраняем закрепленные цвета
  const lockedColors = palette.value.filter(c => c.locked)
  
  for (let i = 0; i < colorsCount.value; i++) {
    if (i < lockedColors.length) {
      newPalette.push({ ...lockedColors[i] })
    } else {
      let hue = baseHue
      
      // Генерация в зависимости от типа палитры
      switch(paletteType.value) {
        case 'analogous':
          hue = (baseHue + (i * 30) - 60) % 360
          break
        case 'monochromatic':
          hue = baseHue
          break
        case 'triadic':
          hue = (baseHue + (i * 120)) % 360
          break
        case 'complementary':
          hue = i % 2 === 0 ? baseHue : (baseHue + 180) % 360
          break
        case 'split':
          hue = i === 0 ? baseHue : 
                i === 1 ? (baseHue + 150) % 360 : 
                (baseHue + 210) % 360
          break
        default:
          hue = Math.floor(Math.random() * 360)
      }
      
      // Настройка насыщенности и яркости по настроению
      let saturation, lightness
      switch(mood.value) {
        case 'calm':
          saturation = 30 + Math.random() * 20
          lightness = 50 + Math.random() * 20
          break
        case 'energetic':
          saturation = 70 + Math.random() * 30
          lightness = 40 + Math.random() * 20
          break
        case 'professional':
          saturation = 20 + Math.random() * 20
          lightness = 30 + Math.random() * 40
          break
        case 'playful':
          saturation = 80 + Math.random() * 20
          lightness = 60 + Math.random() * 20
          break
        case 'nature':
          saturation = 40 + Math.random() * 30
          lightness = 40 + Math.random() * 30
          break
        default:
          saturation = 60 + Math.random() * 30
          lightness = 40 + Math.random() * 30
      }
      
      const color = {
        hue,
        saturation,
        lightness,
        hex: hslToHex(hue, saturation, lightness),
        rgb: hslToRgb(hue, saturation, lightness),
        locked: false,
        name: `Цвет ${i + 1}`
      }
      
      newPalette.push(color)
    }
  }
  
  palette.value = newPalette
  saveToStorage()
  showNotification(`Сгенерирована ${getPaletteTypeName(paletteType.value)} палитра`)
}

const generateFromBaseColor = () => {
  const hex = baseColor.value
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  
  // Конвертируем RGB в HSL
  const hsl = rgbToHsl(r, g, b)
  const baseHue = hsl[0]
  
  // Генерируем на основе базового цвета
  paletteType.value = 'analogous'
  generatePalette()
}

const generateByMood = () => {
  const moods = ['calm', 'energetic', 'professional', 'playful', 'nature']
  mood.value = moods[Math.floor(Math.random() * moods.length)]
  generatePalette()
}

const generateHarmonious = () => {
  paletteType.value = 'analogous'
  generatePalette()
}

// Вспомогательные функции
const hslToHex = (h, s, l) => {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  const toHex = x => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

const hslToRgb = (h, s, l) => {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
}

const rgbToHsl = (r, g, b) => {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    
    h /= 6
  }

  return [h * 360, s * 100, l * 100]
}

// Методы управления палитрой
const updateColor = (index, updatedColor) => {
  palette.value[index] = updatedColor
  saveToStorage()
}

const handleColorLock = (color) => {
  showNotification(color.locked ? 'Цвет закреплен' : 'Цвет разблокирован', 'info')
}

const handleColorCopy = (color, text) => {
  showNotification(`Скопировано: ${text}`, 'success')
}

const editColor = (index) => {
  const newHex = prompt('Введите новый HEX-код цвета:', palette.value[index].hex)
  if (newHex && /^#[0-9A-F]{6}$/i.test(newHex)) {
    const updatedColor = {
      ...palette.value[index],
      hex: newHex.toUpperCase(),
      // Обновляем RGB на основе нового HEX
      rgb: hexToRgb(newHex)
    }
    updateColor(index, updatedColor)
    showNotification('Цвет обновлен', 'success')
  } else if (newHex) {
    showNotification('Неверный формат HEX', 'error')
  }
}

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

const removeColor = (index) => {
  if (confirm('Удалить этот цвет из палитры?')) {
    palette.value.splice(index, 1)
    saveToStorage()
    showNotification('Цвет удален', 'info')
  }
}

const savePalette = () => {
  if (palette.value.length === 0) return
  
  const paletteData = {
    id: Date.now(),
    name: paletteName.value || `Палитра ${new Date().toLocaleDateString('ru-RU')}`,
    colors: [...palette.value],
    type: paletteType.value,
    mood: mood.value,
    createdAt: new Date().toISOString(),
    saved: true
  }
  
  // Сохраняем в библиотеку
  const library = JSON.parse(localStorage.getItem('paletteLibrary') || '{"palettes": []}')
  library.palettes.unshift(paletteData)
  localStorage.setItem('paletteLibrary', JSON.stringify(library))
  
  showNotification('Палитра сохранена в библиотеку!', 'success')
}

const clearPalette = () => {
  if (confirm('Очистить текущую палитру?')) {
    palette.value = []
    saveToStorage()
    showNotification('Палитра очищена', 'info')
  }
}

// Вспомогательные функции
const getPaletteTypeName = (type) => {
  const types = {
    analogous: 'Аналогичная',
    monochromatic: 'Монохромная',
    triadic: 'Триада',
    complementary: 'Комплементарная',
    split: 'Разделенная',
    random: 'Случайная'
  }
  return types[type] || type
}

const getMoodName = (mood) => {
  const moods = {
    calm: 'Спокойное',
    energetic: 'Энергичное',
    professional: 'Профессиональное',
    playful: 'Игривое',
    nature: 'Природное'
  }
  return moods[mood] || mood
}

const showNotification = (message, type = 'success') => {
  if (window.showNotification) {
    window.showNotification(message, type)
  } else {
    alert(message)
  }
}

// Локальное хранилище
const saveToStorage = () => {
  localStorage.setItem('currentPalette', JSON.stringify({
    colors: palette.value,
    type: paletteType.value,
    mood: mood.value,
    colorsCount: colorsCount.value,
    colorFormat: colorFormat.value
  }))
}

const loadFromStorage = () => {
  const saved = localStorage.getItem('currentPalette')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      palette.value = data.colors || []
      paletteType.value = data.type || 'analogous'
      mood.value = data.mood || 'calm'
      colorsCount.value = data.colorsCount || 5
      colorFormat.value = data.colorFormat || 'hex'
    } catch (e) {
      console.error('Ошибка загрузки:', e)
    }
  }
}

// Хуки жизненного цикла
onMounted(() => {
  loadFromStorage()
  if (palette.value.length === 0) {
    generatePalette()
  }
})

// Наблюдатели
watch([colorsCount, paletteType, mood, colorFormat], () => {
  saveToStorage()
})

watch(palette, () => {
  saveToStorage()
}, { deep: true })
</script>

<style scoped>
.generator-view {
  max-width: 1400px;
  margin: 0 auto;
}

.generator-header {
  text-align: center;
  margin-bottom: 2rem;
}

.generator-header h1 {
  font-size: 2.5rem;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.generator-header p {
  color: var(--color-text-soft);
  font-size: 1.1rem;
}

.generator-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (max-width: 1024px) {
  .generator-controls {
    grid-template-columns: 1fr;
  }
}

.control-section {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.control-section h3 {
  margin: 0 0 1rem 0;
  color: var(--color-heading);
  font-size: 1.2rem;
}

.control-group {
  margin-bottom: 1rem;
}

.control-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-text);
}

.number-selector,
.format-selector {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.number-btn,
.format-btn {
  padding: 8px 16px;
  border: 2px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.number-btn:hover,
.format-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.number-btn.active,
.format-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.select-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 14px;
}

.select-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.save-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.name-input {
  padding: 10px 12px;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 14px;
}

.save-btn,
.clear-btn,
.generate-btn,
.mood-btn,
.harmony-btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.save-btn {
  background: var(--color-success);
  color: white;
}

.save-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-btn {
  background: var(--color-error);
  color: white;
}

.clear-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.controls-right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.generate-btn {
  flex: 2;
  background: var(--color-primary);
  color: white;
}

.mood-btn {
  flex: 1;
  background: var(--color-secondary);
  color: white;
}

.harmony-btn {
  flex: 1;
  background: var(--color-accent);
  color: white;
}

.generate-btn:hover,
.mood-btn:hover,
.harmony-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.palette-info-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.info-label {
  color: var(--color-text-soft);
}

.info-value {
  font-weight: 600;
  color: var(--color-heading);
}

.color-wheel-section {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.color-wheel {
  position: relative;
  width: 220px;
  height: 220px;
  margin: 1rem auto;
  border-radius: 50%;
  background: conic-gradient(
    hsl(0, 100%, 50%),
    hsl(60, 100%, 50%),
    hsl(120, 100%, 50%),
    hsl(180, 100%, 50%),
    hsl(240, 100%, 50%),
    hsl(300, 100%, 50%),
    hsl(360, 100%, 50%)
  );
}

.wheel-color {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid white;
  transform-origin: 0 0;
}

.palette-section {
  margin-bottom: 3rem;
}

.palette-section h2 {
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

.empty-palette {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--color-background-soft);
  border: 2px dashed var(--color-border);
  border-radius: 12px;
  color: var(--color-text-soft);
}

.empty-generate-btn {
  margin-top: 1rem;
  padding: 12px 24px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.empty-generate-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.contrast-info {
  font-size: 12px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin-top: 5px;
  backdrop-filter: blur(5px);
}

.preview-section {
  margin-bottom: 3rem;
}

.preview-section h2 {
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

.preview-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.theme-btn {
  padding: 10px 20px;
  border: 2px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.theme-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.theme-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.preview-component {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.action-btn.delete-btn {
  background: rgba(239, 68, 68, 0.8);
  color: white;
}

.action-btn.delete-btn:hover {
  background: rgba(239, 68, 68, 1);
}
</style>