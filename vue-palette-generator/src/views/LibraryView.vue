<template>
  <div class="library-view">
    <!-- Анимированный фон библиотеки -->
    <div class="library-background">
      <div class="background-pattern"></div>
      <div class="floating-colors">
        <div v-for="i in 12" :key="i" class="floating-color" :style="floatingStyle(i)"></div>
      </div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Заголовок с анимацией -->
    <div class="library-header slide-in-down">
      <div class="header-content">
        <h1 class="library-title">
          <span class="gradient-text">Моя библиотека</span>
          <span class="subtitle">Все ваши палитры в одном месте</span>
        </h1>
        
        <div class="header-stats">
          <div class="stat-badge">
            <span class="stat-icon">📚</span>
            <span class="stat-value">{{ totalPalettes }}</span>
            <span class="stat-label">Палитр</span>
          </div>
          <div class="stat-badge">
            <span class="stat-icon">🎨</span>
            <span class="stat-value">{{ totalColors }}</span>
            <span class="stat-label">Цветов</span>
          </div>
          <div class="stat-badge">
            <span class="stat-icon">⭐</span>
            <span class="stat-value">{{ favoritesCount }}</span>
            <span class="stat-label">Избранных</span>
          </div>
        </div>
      </div>

      <!-- Быстрые фильтры -->
      <div class="quick-filters">
        <div class="filter-tabs">
          <button 
            v-for="filter in filters" 
            :key="filter.id"
            @click="setActiveFilter(filter.id)"
            :class="{ active: activeFilter === filter.id }"
            class="filter-tab"
          >
            <span class="tab-icon">{{ filter.icon }}</span>
            <span class="tab-text">{{ filter.name }}</span>
            <span class="tab-count">{{ filter.count }}</span>
            <span class="tab-glow"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Основной контент с стеклянным морфизмом -->
    <div class="library-content">
      <!-- Боковая панель фильтров -->
      <div class="sidebar glass">
        <div class="sidebar-section search-section">
          <h3 class="sidebar-title">
            <span class="title-icon">🔍</span>
            Поиск и фильтры
          </h3>
          
          <div class="search-container">
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input 
                v-model="searchQuery" 
                @input="debouncedSearch"
                placeholder="Поиск палитр..."
                class="search-input"
              />
              <button 
                v-if="searchQuery" 
                @click="clearSearch"
                class="clear-search"
              >
                ×
              </button>
            </div>
            
            <div class="search-filters">
              <select v-model="sortBy" class="filter-select">
                <option value="recent">По дате</option>
                <option value="popular">По популярности</option>
                <option value="name">По названию</option>
                <option value="colors">По цветам</option>
              </select>
              
              <select v-model="tagsFilter" class="filter-select">
                <option value="">Все теги</option>
                <option v-for="tag in availableTags" :key="tag">{{ tag }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Быстрые действия -->
        <div class="sidebar-section quick-actions">
          <h3 class="sidebar-title">
            <span class="title-icon">⚡</span>
            Быстрые действия
          </h3>
          
          <button @click="createNewPalette" class="sidebar-btn primary">
            <span class="btn-icon">+</span>
            <span class="btn-text">Новая палитра</span>
            <span class="btn-sparkle"></span>
          </button>
          
          <button @click="importPalette" class="sidebar-btn secondary">
            <span class="btn-icon">📥</span>
            <span class="btn-text">Импорт</span>
          </button>
          
          <button @click="organizeCollections" class="sidebar-btn secondary">
            <span class="btn-icon">📁</span>
            <span class="btn-text">Организовать</span>
          </button>
        </div>

        <!-- Теги -->
        <div class="sidebar-section tags-section">
          <h3 class="sidebar-title">
            <span class="title-icon">🏷️</span>
            Популярные теги
          </h3>
          
          <div class="tags-cloud">
            <span 
              v-for="tag in popularTags" 
              :key="tag.name"
              @click="toggleTag(tag.name)"
              class="tag"
              :class="{ active: selectedTags.includes(tag.name) }"
              :style="{ '--tag-size': tag.size }"
            >
              {{ tag.name }}
              <span class="tag-count">{{ tag.count }}</span>
            </span>
          </div>
        </div>

        <!-- Статистика -->
        <div class="sidebar-section stats-section">
          <h3 class="sidebar-title">
            <span class="title-icon">📊</span>
            Статистика
          </h3>
          
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ stats.thisWeek }}</div>
              <div class="stat-label">На этой неделе</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.largest }}</div>
              <div class="stat-label">Самая большая</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.recent }}</div>
              <div class="stat-label">Недавно обновлено</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Основная сетка палитр -->
      <div class="main-content">
        <!-- Сетка палитр с виртуальным скроллом -->
        <div class="palettes-grid-container" ref="gridContainer">
          <div 
            v-if="filteredPalettes.length === 0" 
            class="empty-state"
          >
            <div class="empty-illustration">
              <div class="illustration">
                <div class="color-dot"></div>
                <div class="color-dot"></div>
                <div class="color-dot"></div>
                <div class="color-line"></div>
              </div>
            </div>
            <h3>Палитр не найдено</h3>
            <p>Создайте первую палитру или измените фильтры поиска</p>
            <button @click="createNewPalette" class="empty-action">
              <span class="btn-icon">🎨</span>
              <span>Создать палитру</span>
            </button>
          </div>

          <div v-else class="palettes-grid">
            <div 
              v-for="palette in visiblePalettes" 
              :key="palette.id"
              class="palette-card"
              @mouseenter="hoverPalette = palette.id"
              @mouseleave="hoverPalette = null"
              :class="{ 
                'favorite': palette.favorite,
                'hovered': hoverPalette === palette.id 
              }"
            >
              <!-- Карточка палитры -->
              <div class="card-glow"></div>
              
              <!-- Верхняя часть с цветами -->
              <div class="card-colors">
                <div 
                  v-for="(color, index) in palette.colors" 
                  :key="color.hex"
                  class="color-swatch"
                  :style="{ 
                    backgroundColor: color.hex,
                    flex: color.locked ? 1.2 : 1
                  }"
                  :class="{ 'locked': color.locked }"
                >
                  <div class="color-info">
                    <span class="color-hex">{{ color.hex }}</span>
                    <span class="color-name" v-if="color.name">{{ color.name }}</span>
                  </div>
                  <div class="color-actions" v-if="hoverPalette === palette.id">
                    <button 
                      @click.stop="toggleLock(color)"
                      class="color-action"
                      :title="color.locked ? 'Разблокировать' : 'Заблокировать'"
                    >
                      {{ color.locked ? '🔒' : '🔓' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Информация о палитре -->
              <div class="card-info">
                <div class="info-header">
                  <h4 class="palette-name">{{ palette.name }}</h4>
                  <div class="palette-meta">
                    <span class="meta-item">
                      <span class="meta-icon">🎨</span>
                      {{ palette.colors.length }}
                    </span>
                    <span class="meta-item">
                      <span class="meta-icon">📅</span>
                      {{ formatDate(palette.createdAt) }}
                    </span>
                  </div>
                </div>

                <div class="info-tags">
                  <span class="tag" v-if="palette.type">
                    {{ paletteTypeName(palette.type) }}
                  </span>
                  <span class="tag" v-if="palette.mood">
                    {{ moodName(palette.mood) }}
                  </span>
                  <span 
                    v-for="tag in palette.tags.slice(0, 2)" 
                    :key="tag"
                    class="tag"
                  >
                    {{ tag }}
                  </span>
                  <span 
                    v-if="palette.tags.length > 2" 
                    class="tag more"
                  >
                    +{{ palette.tags.length - 2 }}
                  </span>
                </div>

                <p class="palette-description" v-if="palette.description">
                  {{ truncate(palette.description, 80) }}
                </p>

                <!-- Действия -->
                <div class="card-actions">
                  <button 
                    @click="toggleFavorite(palette.id)"
                    class="action-btn favorite"
                    :class="{ 'active': palette.favorite }"
                    :title="palette.favorite ? 'Убрать из избранного' : 'В избранное'"
                  >
                    <span class="action-icon">{{ palette.favorite ? '⭐' : '☆' }}</span>
                  </button>
                  
                  <button 
                    @click="editPalette(palette)"
                    class="action-btn edit"
                    title="Редактировать"
                  >
                    <span class="action-icon">✏️</span>
                  </button>
                  
                  <button 
                    @click="duplicatePalette(palette)"
                    class="action-btn duplicate"
                    title="Дублировать"
                  >
                    <span class="action-icon">📋</span>
                  </button>
                  
                  <button 
                    @click="exportPalette(palette)"
                    class="action-btn export"
                    title="Экспорт"
                  >
                    <span class="action-icon">📤</span>
                  </button>
                  
                  <button 
                    @click="deletePalette(palette.id)"
                    class="action-btn delete"
                    title="Удалить"
                  >
                    <span class="action-icon">🗑️</span>
                  </button>
                  
                  <router-link 
                    :to="`/generator?load=${palette.id}`"
                    class="action-btn load"
                    title="Загрузить"
                  >
                    <span class="action-icon">🚀</span>
                  </router-link>
                </div>
              </div>

              <!-- Анимация при наведении -->
              <div class="card-hover-effect"></div>
              
              <!-- Бейдж избранного -->
              <div class="favorite-badge" v-if="palette.favorite">
                <span class="badge-icon">⭐</span>
                <span class="badge-text">Избранное</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Пагинация с анимацией -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="page-btn prev"
          >
            <span class="btn-icon">←</span>
            <span class="btn-text">Назад</span>
          </button>
          
          <div class="page-numbers">
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="goToPage(page)"
              :class="{ 
                active: page === currentPage,
                'dots': page === '...'
              }"
              class="page-number"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="page-btn next"
          >
            <span class="btn-text">Вперед</span>
            <span class="btn-icon">→</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Плавающая кнопка создания -->
    <button 
      @click="createNewPalette"
      class="floating-create-btn pulse"
      title="Создать новую палитру"
    >
      <span class="btn-glow"></span>
      <span class="btn-icon">+</span>
      <span class="btn-text">Создать</span>
    </button>

    <!-- Модалка создания палитры -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal-content slide-in-up">
        <div class="modal-header">
          <h3>Создать новую палитру</h3>
          <button @click="showCreateModal = false" class="modal-close">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Название палитры</label>
            <input 
              v-model="newPalette.name" 
              placeholder="Введите название..."
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>Тип палитры</label>
            <div class="type-options">
              <button 
                v-for="type in paletteTypes" 
                :key="type.id"
                @click="newPalette.type = type.id"
                :class="{ active: newPalette.type === type.id }"
                class="type-option"
              >
                <span class="option-icon">{{ type.icon }}</span>
                <span class="option-text">{{ type.name }}</span>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>Теги</label>
            <div class="tags-input">
              <div class="selected-tags">
                <span 
                  v-for="tag in newPalette.tags" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                  <button @click="removeTag(tag)" class="tag-remove">×</button>
                </span>
              </div>
              <input 
                v-model="tagInput" 
                @keyup.enter="addTag"
                placeholder="Добавить тег..."
                class="tag-input"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label>Описание (необязательно)</label>
            <textarea 
              v-model="newPalette.description" 
              placeholder="Опишите вашу палитру..."
              class="form-textarea"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showCreateModal = false" class="btn cancel">
            Отмена
          </button>
          <button @click="createPalette" class="btn create">
            <span class="btn-icon">🎨</span>
            Создать палитру
          </button>
        </div>
      </div>
    </div>

    <!-- Контекстное меню -->
    <div 
      v-if="contextMenu.show" 
      class="context-menu"
      :style="contextMenu.style"
    >
      <button @click="handleContextAction('edit')" class="context-item">
        <span class="item-icon">✏️</span>
        <span class="item-text">Редактировать</span>
      </button>
      <button @click="handleContextAction('duplicate')" class="context-item">
        <span class="item-icon">📋</span>
        <span class="item-text">Дублировать</span>
      </button>
      <button @click="handleContextAction('favorite')" class="context-item">
        <span class="item-icon">⭐</span>
        <span class="item-text">
          {{ contextMenu.palette?.favorite ? 'Убрать из избранного' : 'В избранное' }}
        </span>
      </button>
      <div class="context-divider"></div>
      <button @click="handleContextAction('export')" class="context-item">
        <span class="item-icon">📤</span>
        <span class="item-text">Экспорт</span>
      </button>
      <button @click="handleContextAction('delete')" class="context-item danger">
        <span class="item-icon">🗑️</span>
        <span class="item-text">Удалить</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Реактивные данные
const searchQuery = ref('')
const activeFilter = ref('all')
const sortBy = ref('recent')
const tagsFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const hoverPalette = ref(null)
const showCreateModal = ref(false)
const tagInput = ref('')

// Контекстное меню
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  palette: null
})

// Данные палитр
const palettes = ref([])
const selectedTags = ref([])

// Фильтры
const filters = ref([
  { id: 'all', name: 'Все', icon: '📚', count: 42 },
  { id: 'favorites', name: 'Избранное', icon: '⭐', count: 8 },
  { id: 'recent', name: 'Недавние', icon: '🕐', count: 12 },
  { id: 'analogous', name: 'Аналогичные', icon: '🎨', count: 6 },
  { id: 'monochromatic', name: 'Монохромные', icon: '⚫', count: 4 },
  { id: 'triadic', name: 'Триады', icon: '🔺', count: 3 }
])

// Теги
const popularTags = ref([
  { name: 'весна', size: 1.2, count: 12 },
  { name: 'лето', size: 1.4, count: 18 },
  { name: 'осень', size: 1.1, count: 9 },
  { name: 'зима', size: 0.9, count: 7 },
  { name: 'пастель', size: 1.3, count: 15 },
  { name: 'яркие', size: 1.5, count: 22 },
  { name: 'спокойные', size: 1.0, count: 8 },
  { name: 'профессиональные', size: 1.2, count: 11 },
  { name: 'тренды', size: 1.6, count: 25 }
])

// Статистика
const stats = ref({
  thisWeek: 5,
  largest: 9,
  recent: '2 часа назад'
})

// Новая палитра
const newPalette = ref({
  name: '',
  type: 'analogous',
  tags: [],
  description: ''
})

// Типы палитр
const paletteTypes = ref([
  { id: 'analogous', name: 'Аналогичная', icon: '🎨' },
  { id: 'monochromatic', name: 'Монохромная', icon: '⚫' },
  { id: 'triadic', name: 'Триада', icon: '🔺' },
  { id: 'complementary', name: 'Комплементарная', icon: '🔄' },
  { id: 'split', name: 'Разделенная', icon: '✂️' }
])

// Вычисляемые свойства
const totalPalettes = computed(() => palettes.value.length)
const totalColors = computed(() => {
  return palettes.value.reduce((sum, palette) => sum + palette.colors.length, 0)
})
const favoritesCount = computed(() => {
  return palettes.value.filter(p => p.favorite).length
})

const filteredPalettes = computed(() => {
  let filtered = [...palettes.value]
  
  // Фильтрация по активному фильтру
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(p => p.type === activeFilter.value || 
                                   (activeFilter.value === 'favorites' && p.favorite) ||
                                   (activeFilter.value === 'recent' && isRecent(p.createdAt)))
  }
  
  // Поиск
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // Фильтрация по тегам
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(p => 
      selectedTags.value.every(tag => p.tags?.includes(tag))
    )
  }
  
  // Сортировка
  filtered.sort((a, b) => {
    switch(sortBy.value) {
      case 'popular':
        return (b.likes || 0) - (a.likes || 0)
      case 'name':
        return a.name.localeCompare(b.name)
      case 'colors':
        return b.colors.length - a.colors.length
      case 'recent':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })
  
  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredPalettes.value.length / itemsPerPage.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage.value <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages.value)
    } else if (currentPage.value >= totalPages.value - 2) {
      pages.push(1, '...', totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value)
    } else {
      pages.push(1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', totalPages.value)
    }
  }
  
  return pages
})

const visiblePalettes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPalettes.value.slice(start, end)
})

// Методы
const floatingStyle = (index) => {
  const size = Math.random() * 100 + 50
  const duration = Math.random() * 15 + 10
  const delay = Math.random() * 3
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    background: `radial-gradient(circle, ${getRandomColor()} 0%, transparent 70%)`,
    filter: `blur(${size / 15}px)`
  }
}

const getRandomColor = () => {
  const colors = [
    'rgba(99, 102, 241, 0.1)',
    'rgba(139, 92, 246, 0.1)',
    'rgba(236, 72, 153, 0.1)',
    'rgba(16, 185, 129, 0.1)',
    'rgba(245, 158, 11, 0.1)'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const setActiveFilter = (filterId) => {
  activeFilter.value = filterId
  currentPage.value = 1
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
}, 300)

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
  currentPage.value = 1
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  if (diff < 86400000) { // менее суток
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  } else if (diff < 604800000) { // менее недели
    return date.toLocaleDateString('ru-RU', { weekday: 'short' })
  } else {
    return date.toLocaleDateString('ru-RU')
  }
}

const paletteTypeName = (type) => {
  const types = {
    analogous: 'Аналогичная',
    monochromatic: 'Монохромная',
    triadic: 'Триада',
    complementary: 'Комплементарная',
    split: 'Разделенная'
  }
  return types[type] || type
}

const moodName = (mood) => {
  const moods = {
    calm: 'Спокойное',
    energetic: 'Энергичное',
    professional: 'Профессиональное',
    playful: 'Игривое'
  }
  return moods[mood] || mood
}

const truncate = (text, length) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const toggleFavorite = (paletteId) => {
  const palette = palettes.value.find(p => p.id === paletteId)
  if (palette) {
    palette.favorite = !palette.favorite
  }
}

const toggleLock = (color) => {
  color.locked = !color.locked
}

const editPalette = (palette) => {
  router.push(`/generator?edit=${palette.id}`)
}

const duplicatePalette = (palette) => {
  const duplicate = {
    ...palette,
    id: Date.now(),
    name: `${palette.name} (копия)`,
    createdAt: new Date().toISOString()
  }
  palettes.value.unshift(duplicate)
}

const exportPalette = (palette) => {
  router.push(`/export?palette=${palette.id}`)
}

const deletePalette = (paletteId) => {
  if (confirm('Удалить эту палитру?')) {
    palettes.value = palettes.value.filter(p => p.id !== paletteId)
  }
}

const createNewPalette = () => {
  showCreateModal.value = true
}

const addTag = () => {
  if (tagInput.value.trim() && !newPalette.value.tags.includes(tagInput.value.trim())) {
    newPalette.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (tag) => {
  newPalette.value.tags = newPalette.value.tags.filter(t => t !== tag)
}

const createPalette = () => {
  if (!newPalette.value.name.trim()) return
  
  const palette = {
    id: Date.now(),
    ...newPalette.value,
    colors: [],
    createdAt: new Date().toISOString(),
    favorite: false,
    tags: [...newPalette.value.tags]
  }
  
  palettes.value.unshift(palette)
  showCreateModal.value = false
  
  // Сброс формы
  newPalette.value = {
    name: '',
    type: 'analogous',
    tags: [],
    description: ''
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  if (page !== '...') {
    currentPage.value = page
  }
}

const importPalette = () => {
  // Импорт палитры
}

const organizeCollections = () => {
  // Организация коллекций
}

// Контекстное меню
const showContextMenu = (event, palette) => {
  event.preventDefault()
  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    palette
  }
}

const handleContextAction = (action) => {
  if (!contextMenu.value.palette) return
  
  switch(action) {
    case 'edit':
      editPalette(contextMenu.value.palette)
      break
    case 'duplicate':
      duplicatePalette(contextMenu.value.palette)
      break
    case 'favorite':
      toggleFavorite(contextMenu.value.palette.id)
      break
    case 'export':
      exportPalette(contextMenu.value.palette)
      break
    case 'delete':
      deletePalette(contextMenu.value.palette.id)
      break
  }
  
  contextMenu.value.show = false
}

// Закрытие контекстного меню
const handleClickOutside = (event) => {
  if (contextMenu.value.show && !event.target.closest('.context-menu')) {
    contextMenu.value.show = false
  }
}

// Загрузка данных
onMounted(() => {
  // Загрузка палитр из localStorage или API
  const saved = localStorage.getItem('userPalettes')
  if (saved) {
    palettes.value = JSON.parse(saved)
  }
  
  // Обработчик клика вне контекстного меню
  document.addEventListener('click', handleClickOutside)
  
  // Анимация при скролле
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated')
      }
    })
  }, { threshold: 0.1 })
  
  document.querySelectorAll('.palette-card').forEach(card => {
    observer.observe(card)
  })
})

// Сохранение при изменении
watch(palettes, (newPalettes) => {
  localStorage.setItem('userPalettes', JSON.stringify(newPalettes))
}, { deep: true })
</script>

<style scoped>
.library-view {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Фон библиотеки */
.library-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at center, black, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at center, black, transparent 80%);
}

/* Заголовок */
.library-header {
  padding: 3rem 2rem 2rem;
  position: relative;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
  }
}

.library-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 0.5rem;
}

.subtitle {
  display: block;
  font-size: 1.1rem;
  color: var(--color-text-soft);
  font-weight: 400;
}

.header-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  min-width: 100px;
}

.stat-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-text-soft);
}

/* Быстрые фильтры */
.quick-filters {
  overflow-x: auto;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
}

.filter-tab {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  color: var(--color-text-soft);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  white-space: nowrap;
}

.filter-tab:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text);
}

.filter-tab.active {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--neon-glow);
}

.tab-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%);
  opacity: 0;
  transition: opacity var(--transition-normal);
  pointer-events: none;
  border-radius: var(--radius-full);
}

.filter-tab.active .tab-glow {
  opacity: 0.3;
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
}

/* Основной контент */
.library-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  padding: 0 2rem 3rem;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .library-content {
    grid-template-columns: 1fr;
  }
}

/* Сайдбар */
.sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.sidebar-section {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-section:last-child {
  border-bottom: none;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.title-icon {
  font-size: 1.2rem;
}

/* Поиск */
.search-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-soft);
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  color: var(--color-text);
  font-size: 0.9rem;
  transition: all var(--transition-normal);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-glow);
}

.clear-search {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-soft);
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
}

.clear-search:hover {
  color: var(--color-error);
}

.search-filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 0.9rem;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Кнопки сайдбара */
.sidebar-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  color: var(--color-text);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.sidebar-btn:last-child {
  margin-bottom: 0;
}

.sidebar-btn.primary {
  background: var(--gradient-primary);
  color: white;
  border: none;
}

.sidebar-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--neon-glow);
}

.sidebar-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.btn-sparkle {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.sidebar-btn:hover .btn-sparkle {
  opacity: 1;
}

/* Облако тегов */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  color: var(--color-text-soft);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: calc(0.8rem * var(--tag-size, 1));
}

.tag:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text);
  transform: translateY(-2px);
}

.tag.active {
  background: var(--gradient-primary);
  color: white;
  border-color: var(--color-primary);
  box-shadow: 0 0 10px var(--color-primary-glow);
}

.tag-count {
  background: rgba(0, 0, 0, 0.2);
  padding: 1px 6px;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 600;
}

/* Статистика */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text-soft);
}

/* Основная сетка палитр */
.main-content {
  min-height: 100vh;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-xl);
  border: 2px dashed rgba(255, 255, 255, 0.1);
}

.empty-illustration {
  margin-bottom: 2rem;
}

.illustration {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
}

.color-dot {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}

.color-dot:nth-child(1) {
  background: var(--color-primary);
  top: 20px;
  left: 20px;
  animation-delay: 0s;
}

.color-dot:nth-child(2) {
  background: var(--color-secondary);
  top: 20px;
  right: 20px;
  animation-delay: 0.5s;
}

.color-dot:nth-child(3) {
  background: var(--color-accent);
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1s;
}

.color-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
  transform: translate(-50%, -50%) rotate(45deg);
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.empty-state p {
  color: var(--color-text-soft);
  margin-bottom: 2rem;
}

.empty-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.empty-action:hover {
  transform: translateY(-2px);
  box-shadow: var(--neon-glow);
}

/* Сетка палитр */
.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .palettes-grid {
    grid-template-columns: 1fr;
  }
}

.palette-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--transition-normal);
  animation: cardAppear 0.5s ease;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.palette-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-primary);
  box-shadow: var(--neon-glow);
  background: rgba(255, 255, 255, 0.05);
}

.palette-card.hovered {
  z-index: 10;
}

.card-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%);
  opacity: 0;
  transition: opacity var(--transition-normal);
  pointer-events: none;
}

.palette-card:hover .card-glow {
  opacity: 0.1;
}

/* Цвета в карточке */
.card-colors {
  display: flex;
  height: 100px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.color-swatch {
  position: relative;
  flex: 1;
  transition: flex var(--transition-normal);
  overflow: hidden;
}

.color-swatch:hover {
  flex: 1.2;
}

.color-swatch.locked::before {
  content: '🔒';
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.8rem;
  opacity: 0.7;
}

.color-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  opacity: 0;
  transform: translateY(5px);
  transition: all var(--transition-normal);
  pointer-events: none;
}

.color-swatch:hover .color-info {
  opacity: 1;
  transform: translateY(0);
}

.color-actions {
  position: absolute;
  top: 5px;
  right: 5px;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.color-swatch:hover .color-actions {
  opacity: 1;
}

.color-action {
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: var(--radius-sm);
  padding: 2px 4px;
  cursor: pointer;
  color: white;
  font-size: 0.8rem;
  line-height: 1;
}

.color-action:hover {
  background: rgba(0, 0, 0, 0.7);
}

/* Информация о палитре */
.card-info {
  padding: 1.5rem;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.palette-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  flex: 1;
}

.palette-meta {
  display: flex;
  gap: 0.75rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--color-text-soft);
}

.meta-icon {
  font-size: 0.9rem;
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.palette-description {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

/* Действия */
.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--color-text-soft);
  cursor: pointer;
  transition: all var(--transition-normal);
  text-decoration: none;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text);
  transform: translateY(-2px);
}

.action-btn.favorite.active {
  background: rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.3);
  color: #f59e0b;
}

.action-btn.edit:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.3);
  color: var(--color-primary);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--color-error);
}

.action-btn.export:hover {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.3);
  color: var(--color-success);
}

.action-btn.load:hover {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.3);
  color: var(--color-secondary);
}

/* Бейдж избранного */
.favorite-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(245, 158, 11, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 600;
  z-index: 2;
}

.badge-icon {
  font-size: 0.8rem;
}

/* Эффект при наведении */
.card-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  transform: translateX(-100%);
  opacity: 0;
  transition: all 0.5s ease;
  pointer-events: none;
}

.palette-card:hover .card-hover-effect {
  transform: translateX(100%);
  opacity: 1;
}

/* Пагинация */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  color: var(--color-text);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.page-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.page-number:hover:not(.dots):not(.active) {
  background: rgba(255, 255, 255, 0.1);
}

.page-number.active {
  background: var(--gradient-primary);
  color: white;
  border-color: var(--color-primary);
  box-shadow: 0 0 10px var(--color-primary-glow);
}

.page-number.dots {
  background: transparent;
  border: none;
  cursor: default;
}

/* Плавающая кнопка создания */
.floating-create-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--neon-glow);
  z-index: 100;
  transition: all var(--transition-normal);
}

.floating-create-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--neon-glow-strong);
}

.btn-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity var(--transition-normal);
  border-radius: inherit;
  pointer-events: none;
}

.floating-create-btn:hover .btn-glow {
  opacity: 1;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-text);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text-soft);
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.modal-close:hover {
  color: var(--color-error);
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-text);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text);
  font-size: 1rem;
  transition: all var(--transition-normal);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-glow);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.type-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.type-option {
  flex: 1;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.type-option:hover {
  border-color: var(--color-primary);
}

.type-option.active {
  background: var(--gradient-primary);
  color: white;
  border-color: var(--color-primary);
  box-shadow: 0 0 10px var(--color-primary-glow);
}

.option-icon {
  font-size: 1.5rem;
}

.tags-input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 0.5rem;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag-input {
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 1rem;
}

.tag-input:focus {
  outline: none;
}

.tag-remove {
  margin-left: 0.5rem;
  background: none;
  border: none;
  color: var(--color-text-soft);
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  padding: 0 2px;
}

.tag-remove:hover {
  color: var(--color-error);
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.modal-footer .btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn.cancel {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text);
}

.btn.cancel:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn.create {
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn.create:hover {
  transform: translateY(-2px);
  box-shadow: var(--neon-glow);
}

/* Контекстное меню */
.context-menu {
  position: fixed;
  background: var(--color-bg-soft);
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  z-index: 1000;
  min-width: 200px;
  overflow: hidden;
}

.context-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-normal);
  text-align: left;
}

.context-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.context-item.danger {
  color: var(--color-error);
}

.context-item.danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

.item-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.context-divider {
  height: 1px;
  background: var(--color-border);
  margin: 0.25rem 0;
}

/* Анимации */
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in-down {
  animation: slideInDown 0.5s ease;
}

.slide-in-up {
  animation: slideInUp 0.5s ease;
}

/* Адаптивность */
@media (max-width: 768px) {
  .library-header {
    padding: 2rem 1rem;
  }
  
  .library-content {
    padding: 0 1rem 2rem;
  }
  
  .filter-tabs {
    padding: 0.25rem;
  }
  
  .filter-tab {
    padding: 0.5rem 1rem;
  }
  
  .floating-create-btn {
    bottom: 1rem;
    right: 1rem;
  }
}
</style>