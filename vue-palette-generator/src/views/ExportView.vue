<template>
  <div class="export-view">
    <div class="export-header">
      <h1>📤 Экспорт палитр</h1>
      <p>Экспортируйте цвета в популярные форматы</p>
    </div>

    <div class="export-container">
      <!-- Выбор палитры -->
      <div class="palette-selector">
        <h3>Выберите палитру для экспорта</h3>
        <select v-model="selectedPaletteId" class="palette-select">
          <option value="">Выберите палитру...</option>
          <option 
            v-for="palette in availablePalettes" 
            :key="palette.id"
            :value="palette.id"
          >
            {{ palette.name }} ({{ palette.colors.length }} цветов)
          </option>
        </select>
        
        <div v-if="selectedPalette" class="selected-palette-preview">
          <div class="preview-title">
            <h4>{{ selectedPalette.name }}</h4>
            <span class="palette-type">{{ getPaletteTypeName(selectedPalette.type) }}</span>
          </div>
          
          <div class="preview-colors">
            <div 
              v-for="color in selectedPalette.colors" 
              :key="color.hex"
              class="preview-color"
              :style="{ backgroundColor: color.hex }"
              :title="color.hex"
            ></div>
          </div>
        </div>
      </div>

      <!-- Форматы экспорта -->
      <div class="export-formats">
        <h3>Форматы экспорта</h3>
        <div class="format-tabs">
          <button 
            v-for="format in exportFormats" 
            :key="format.id"
            @click="selectedFormat = format.id"
            :class="{ active: selectedFormat === format.id }"
            class="format-tab"
          >
            {{ format.name }}
          </button>
        </div>
        
        <!-- Превью экспорта -->
        <div class="export-preview">
          <div class="preview-header">
            <h4>Превью экспорта</h4>
            <button @click="copyToClipboard" class="copy-btn" :disabled="!selectedPalette">
              📋 Копировать
            </button>
          </div>
          
          <pre class="code-preview" v-if="selectedPalette">{{ exportCode }}</pre>
          <div v-else class="no-palette">
            <p>Выберите палитру для просмотра кода экспорта</p>
          </div>
        </div>
        
        <!-- Дополнительные опции -->
        <div class="export-options">
          <h4>Настройки экспорта</h4>
          
          <div class="options-grid">
            <div class="option-group">
              <label>
                <input type="checkbox" v-model="includeComments" />
                Включать комментарии
              </label>
            </div>
            
            <div class="option-group">
              <label>
                <input type="checkbox" v-model="useCamelCase" />
                Использовать camelCase
              </label>
            </div>
            
            <div class="option-group">
              <label>
                <input type="checkbox" v-model="addPrefix" />
                Добавить префикс
              </label>
              <input 
                v-if="addPrefix" 
                v-model="prefix" 
                class="prefix-input" 
                placeholder="palette-"
              />
            </div>
          </div>
        </div>
        
        <!-- Кнопки действий -->
        <div class="export-actions">
          <button @click="downloadFile" class="download-btn" :disabled="!selectedPalette">
            💾 Скачать файл
          </button>
          <button @click="shareExport" class="share-btn" :disabled="!selectedPalette">
            📤 Поделиться
          </button>
          <button @click="saveAsTemplate" class="template-btn" :disabled="!selectedPalette">
            📝 Сохранить как шаблон
          </button>
        </div>
      </div>
    </div>

    <!-- Примеры использования -->
    <div class="usage-examples">
      <h3>Примеры использования</h3>
      
      <div class="examples-grid">
        <div class="example-card">
          <div class="example-header">
            <span class="example-icon">🎨</span>
            <h4>CSS Custom Properties</h4>
          </div>
          <p>Используйте переменные в CSS для быстрого изменения темы</p>
          <code class="example-code">
:root {
  --color-primary: #42b883;
  --color-secondary: #35495e;
}
          </code>
        </div>
        
        <div class="example-card">
          <div class="example-header">
            <span class="example-icon">⚛️</span>
            <h4>React / Vue Components</h4>
          </div>
          <p>Импортируйте цвета в компоненты вашего приложения</p>
          <code class="example-code">
// colors.js
export const COLORS = {
  primary: '#42b883',
  secondary: '#35495e'
}
          </code>
        </div>
        
        <div class="example-card">
          <div class="example-header">
            <span class="example-icon">🎯</span>
            <h4>Tailwind Config</h4>
          </div>
          <p>Добавьте цвета в конфигурацию Tailwind CSS</p>
          <code class="example-code">
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#42b883'
        }
      }
    }
  }
}
          </code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Реактивные данные
const selectedPaletteId = ref('')
const selectedFormat = ref('css')
const includeComments = ref(true)
const useCamelCase = ref(false)
const addPrefix = ref(false)
const prefix = ref('palette-')

// Доступные палитры
const availablePalettes = ref([])

// Форматы экспорта
const exportFormats = [
  { id: 'css', name: 'CSS Variables', extension: '.css' },
  { id: 'scss', name: 'SCSS Variables', extension: '.scss' },
  { id: 'less', name: 'LESS Variables', extension: '.less' },
  { id: 'js', name: 'JavaScript Object', extension: '.js' },
  { id: 'json', name: 'JSON', extension: '.json' },
  { id: 'tailwind', name: 'Tailwind Config', extension: '.js' },
  { id: 'flutter', name: 'Flutter Colors', extension: '.dart' },
  { id: 'android', name: 'Android Colors', extension: '.xml' }
]

// Загрузка палитр
const loadPalettes = () => {
  const saved = localStorage.getItem('paletteLibrary')
  if (saved) {
    try {
      const library = JSON.parse(saved)
      availablePalettes.value = library.palettes || []
      
      // Проверяем query параметр
      const paletteId = route.query.palette
      if (paletteId) {
        selectedPaletteId.value = parseInt(paletteId)
      }
    } catch (e) {
      console.error('Ошибка загрузки палитр:', e)
    }
  }
}

// Выбранная палитра
const selectedPalette = computed(() => {
  return availablePalettes.value.find(p => p.id === selectedPaletteId.value)
})

// Код экспорта
const exportCode = computed(() => {
  if (!selectedPalette.value) return ''
  
  const palette = selectedPalette.value
  const colors = palette.colors
  const formatName = selectedFormat.value
  
  // Генерация имен переменных
  const getVarName = (index) => {
    const baseName = `color-${index + 1}`
    if (useCamelCase.value) {
      return baseName.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
    }
    return baseName
  }
  
  // Генерация кода в зависимости от формата
  let code = ''
  
  if (includeComments.value) {
    code += `/*\n`
    code += ` * ${palette.name}\n`
    code += ` * Type: ${getPaletteTypeName(palette.type)}\n`
    code += ` * Mood: ${getMoodName(palette.mood)}\n`
    code += ` * Generated: ${new Date().toLocaleDateString('ru-RU')}\n`
    code += ` */\n\n`
  }
  
  switch(formatName) {
    case 'css':
      code += ':root {\n'
      colors.forEach((color, index) => {
        const varName = addPrefix.value ? `${prefix.value}${getVarName(index)}` : getVarName(index)
        code += `  --${varName}: ${color.hex};\n`
      })
      code += '}\n'
      break
      
    case 'scss':
      colors.forEach((color, index) => {
        const varName = addPrefix.value ? `${prefix.value}${getVarName(index)}` : `$${getVarName(index)}`
        code += `${varName}: ${color.hex};\n`
      })
      break
      
    case 'less':
      colors.forEach((color, index) => {
        const varName = addPrefix.value ? `${prefix.value}${getVarName(index)}` : `@${getVarName(index)}`
        code += `${varName}: ${color.hex};\n`
      })
      break
      
    case 'js':
      code += 'export const colors = {\n'
      colors.forEach((color, index) => {
        const varName = getVarName(index)
        code += `  ${varName}: '${color.hex}',\n`
      })
      code += '}\n'
      break
      
    case 'json':
      const jsonObj = {
        name: palette.name,
        type: palette.type,
        mood: palette.mood,
        colors: colors.reduce((obj, color, index) => {
          obj[getVarName(index)] = color.hex
          return obj
        }, {})
      }
      code += JSON.stringify(jsonObj, null, 2)
      break
      
    case 'tailwind':
      code += 'module.exports = {\n'
      code += '  theme: {\n'
      code += '    extend: {\n'
      code += '      colors: {\n'
      colors.forEach((color, index) => {
        const varName = getVarName(index)
        code += `        ${varName}: '${color.hex}',\n`
      })
      code += '      }\n'
      code += '    }\n'
      code += '  }\n'
      code += '}\n'
      break
      
    case 'flutter':
      code += 'import \'package:flutter/material.dart\';\n\n'
      code += 'class AppColors {\n'
      colors.forEach((color, index) => {
        const varName = getVarName(index)
        const colorName = varName.replace(/(?:^|-)([a-z])/g, (g) => g[1].toUpperCase())
        code += `  static const Color ${colorName} = Color(0xFF${color.hex.slice(1)});\n`
      })
      code += '}\n'
      break
      
    case 'android':
      code += '<?xml version="1.0" encoding="utf-8"?>\n'
      code += '<resources>\n'
      colors.forEach((color, index) => {
        const varName = getVarName(index)
        code += `  <color name="${varName}">${color.hex}</color>\n`
      })
      code += '</resources>\n'
      break
  }
  
  return code
})

// Методы
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(exportCode.value)
    showNotification('Код скопирован в буфер обмена!', 'success')
  } catch (err) {
    console.error('Не удалось скопировать:', err)
    showNotification('Не удалось скопировать код', 'error')
  }
}

const downloadFile = () => {
  if (!selectedPalette.value) return
  
  const format = exportFormats.find(f => f.id === selectedFormat.value)
  const filename = `${selectedPalette.value.name.replace(/\s+/g, '-').toLowerCase()}${format.extension}`
  
  const blob = new Blob([exportCode.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  showNotification(`Файл ${filename} скачан`, 'success')
}

const shareExport = async () => {
  if (!selectedPalette.value) return
  
  const shareData = {
    title: `Палитра: ${selectedPalette.value.name}`,
    text: `Палитра цветов "${selectedPalette.value.name}" с ${selectedPalette.value.colors.length} цветами`,
    url: window.location.href
  }
  
  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(exportCode.value)
      showNotification('Код скопирован в буфер обмена!', 'success')
    }
  } catch (err) {
    console.error('Ошибка при попытке поделиться:', err)
  }
}

const saveAsTemplate = () => {
  if (!selectedPalette.value) return
  
  const templates = JSON.parse(localStorage.getItem('exportTemplates') || '[]')
  
  const template = {
    id: Date.now(),
    name: `${selectedPalette.value.name} (${exportFormats.find(f => f.id === selectedFormat.value).name})`,
    format: selectedFormat.value,
    paletteId: selectedPalette.value.id,
    options: {
      includeComments: includeComments.value,
      useCamelCase: useCamelCase.value,
      addPrefix: addPrefix.value,
      prefix: prefix.value
    },
    createdAt: new Date().toISOString()
  }
  
  templates.unshift(template)
  localStorage.setItem('exportTemplates', JSON.stringify(templates))
  
  showNotification('Шаблон экспорта сохранен!', 'success')
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
  }
}

onMounted(() => {
  loadPalettes()
})
</script>

<style scoped>
.export-view {
  max-width: 1200px;
  margin: 0 auto;
}

.export-header {
  text-align: center;
  margin-bottom: 2rem;
}

.export-header h1 {
  font-size: 2.5rem;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.export-header p {
  color: var(--color-text-soft);
  font-size: 1.1rem;
}

.export-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (max-width: 1024px) {
  .export-container {
    grid-template-columns: 1fr;
  }
}

.palette-selector {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
}

.palette-selector h3 {
  margin: 0 0 1rem 0;
  color: var(--color-heading);
  font-size: 1.2rem;
}

.palette-select {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 14px;
  margin-bottom: 1.5rem;
}

.selected-palette-preview {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
}

.preview-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.preview-title h4 {
  margin: 0;
  color: var(--color-heading);
  font-size: 1.1rem;
}

.palette-type {
  font-size: 12px;
  padding: 4px 8px;
  background: var(--color-primary);
  color: white;
  border-radius: 4px;
  font-weight: 600;
}

.preview-colors {
  display: flex;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.preview-color {
  flex: 1;
}

.export-formats {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
}

.export-formats h3 {
  margin: 0 0 1rem 0;
  color: var(--color-heading);
  font-size: 1.2rem;
}

.format-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.format-tab {
  padding: 8px 16px;
  border: 2px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.format-tab:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.format-tab.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.export-preview {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.preview-header h4 {
  margin: 0;
  color: var(--color-heading);
}

.copy-btn {
  padding: 6px 12px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

.copy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.code-preview {
  margin: 0;
  padding: 1rem;
  background: #1a1a1a;
  color: #f8f8f2;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.5;
  overflow-x: auto;
}

.no-palette {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-soft);
}

.export-options {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.export-options h4 {
  margin: 0 0 1rem 0;
  color: var(--color-heading);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--color-text);
}

.prefix-input {
  padding: 6px 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 14px;
  margin-top: 0.5rem;
}

.export-actions {
  display: flex;
  gap: 1rem;
}

.download-btn,
.share-btn,
.template-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.download-btn {
  background: var(--color-success);
  color: white;
}

.share-btn {
  background: var(--color-info);
  color: white;
}

.template-btn {
  background: var(--color-secondary);
  color: white;
}

.download-btn:hover:not(:disabled),
.share-btn:hover:not(:disabled),
.template-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

.download-btn:disabled,
.share-btn:disabled,
.template-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.usage-examples {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
}

.usage-examples h3 {
  margin: 0 0 1.5rem 0;
  color: var(--color-heading);
  font-size: 1.2rem;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.example-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.example-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  border-color: var(--color-primary);
}

.example-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.example-icon {
  font-size: 2rem;
}

.example-header h4 {
  margin: 0;
  color: var(--color-heading);
  font-size: 1.1rem;
}

.example-card p {
  color: var(--color-text);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.example-code {
  display: block;
  padding: 1rem;
  background: #1a1a1a;
  color: #f8f8f2;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
}
</style>