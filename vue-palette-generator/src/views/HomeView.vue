<template>
  <div class="home-view">
    <!-- Герой-секция с параллаксом -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="floating-colors">
          <div v-for="i in 8" :key="i" class="floating-color" :style="floatingStyle(i)"></div>
        </div>
        <div class="hero-glow"></div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text slide-in-up">
          <h1 class="hero-title">
            <span class="gradient-text">Создавайте</span>
            <span class="neon-text"> идеальные</span>
            <br>
            <span class="animated-text">цветовые палитры</span>
          </h1>
          <p class="hero-subtitle">
            Мощный инструмент для дизайнеров, разработчиков и креаторов.
            Генерация, анализ, сохранение и экспорт палитр в одном месте.
          </p>
          
          <div class="hero-actions">
            <router-link to="/generator" class="hero-btn primary pulse">
              <span class="btn-sparkle"></span>
              <span class="btn-icon">✨</span>
              <span class="btn-text">Начать создание</span>
              <span class="btn-arrow">→</span>
            </router-link>
            
            <router-link to="/library" class="hero-btn secondary">
              <span class="btn-icon">📚</span>
              <span class="btn-text">Мои палитры</span>
            </router-link>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="palette-preview floating">
            <div class="preview-colors">
              <div 
                v-for="color in featuredColors" 
                :key="color.id"
                class="preview-color"
                :style="{ backgroundColor: color.hex }"
                @mouseenter="animateColor(color.id)"
                :class="{ 'animated': color.animated }"
              >
                <span class="color-tooltip">{{ color.name }}</span>
                <div class="color-shine"></div>
              </div>
            </div>
            <div class="preview-info">
              <span class="preview-name">Featured Palette</span>
              <span class="preview-badge">🔥 Trending</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="scroll-indicator">
        <div class="mouse">
          <div class="wheel"></div>
        </div>
        <span class="scroll-text">Листайте вниз</span>
      </div>
    </section>

    <!-- Особенности -->
    <section class="features-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="gradient-text">Возможности</span>
          <span class="section-subtitle">Все инструменты в одном месте</span>
        </h2>
      </div>
      
      <div class="features-grid">
        <div 
          v-for="feature in features" 
          :key="feature.id"
          class="feature-card"
          @mouseenter="feature.hover = true"
          @mouseleave="feature.hover = false"
          :style="featureCardStyle(feature)"
        >
          <div class="feature-glow" v-if="feature.hover"></div>
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
          
          <div class="feature-highlights">
            <span 
              v-for="highlight in feature.highlights" 
              :key="highlight"
              class="highlight"
            >
              {{ highlight }}
            </span>
          </div>
          
          <div class="feature-action">
            <router-link :to="feature.link" class="feature-link">
              <span>Попробовать</span>
              <span class="link-arrow">↗</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Быстрые действия -->
    <section class="quick-actions-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="neon-text">Быстрые действия</span>
          <span class="section-subtitle">Начните работу мгновенно</span>
        </h2>
      </div>
      
      <div class="actions-container">
        <div class="action-cards">
          <div 
            v-for="action in quickActions" 
            :key="action.id"
            class="action-card"
            @click="handleQuickAction(action)"
            :class="{ 'pulse': action.hot }"
          >
            <div class="action-glow"></div>
            <div class="action-content">
              <div class="action-icon">{{ action.icon }}</div>
              <h4 class="action-title">{{ action.title }}</h4>
              <p class="action-description">{{ action.description }}</p>
            </div>
            <div class="action-badge" v-if="action.badge">{{ action.badge }}</div>
            <div class="action-sparkles" v-if="action.sparkles">
              <span v-for="i in 3" :key="i" class="sparkle"></span>
            </div>
          </div>
        </div>
        
        <div class="quick-generator">
          <h3>⚡ Мгновенная генерация</h3>
          <div class="generator-controls">
            <div class="color-preview" ref="quickPreview"></div>
            <div class="controls">
              <button @click="quickGenerate" class="generate-btn">
                <span class="btn-icon">🎲</span>
                <span class="btn-text">Сгенерировать</span>
              </button>
              
              <div class="quick-options">
                <label>
                  <input type="radio" v-model="quickType" value="harmony"> Гармоничная
                </label>
                <label>
                  <input type="radio" v-model="quickType" value="random"> Случайная
                </label>
                <label>
                  <input type="radio" v-model="quickType" value="mood"> По настроению
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Статистика и достижения -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stats-card">
          <div class="stats-header">
            <h3>📊 Ваша статистика</h3>
            <span class="stats-badge">Today</span>
          </div>
          
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value glow">{{ userStats.palettes }}</div>
              <div class="stat-label">Палитр создано</div>
              <div class="stat-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: '75%' }"></div>
                </div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-value glow">{{ userStats.colors }}</div>
              <div class="stat-label">Цветов сгенерировано</div>
              <div class="stat-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: '90%' }"></div>
                </div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-value glow">{{ userStats.time }}</div>
              <div class="stat-label">Минут в приложении</div>
              <div class="stat-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: '60%' }"></div>
                </div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-value glow">{{ userStats.achievements }}</div>
              <div class="stat-label">Достижений</div>
              <div class="stat-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: '45%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="achievements-card">
          <div class="achievements-header">
            <h3>🏆 Последние достижения</h3>
            <router-link to="/achievements" class="view-all">Все →</router-link>
          </div>
          
          <div class="achievements-list">
            <div 
              v-for="achievement in achievements" 
              :key="achievement.id"
              class="achievement"
              :class="{ 'unlocked': achievement.unlocked }"
            >
              <div class="achievement-icon">{{ achievement.icon }}</div>
              <div class="achievement-content">
                <h4>{{ achievement.title }}</h4>
                <p>{{ achievement.description }}</p>
                <div class="achievement-progress" v-if="!achievement.unlocked">
                  <div class="progress">
                    <div 
                      class="progress-bar" 
                      :style="{ width: `${achievement.progress}%` }"
                    ></div>
                  </div>
                  <span>{{ achievement.progress }}%</span>
                </div>
              </div>
              <div class="achievement-badge" v-if="achievement.unlocked">
                <span class="badge">🔓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA секция -->
    <section class="cta-section">
      <div class="cta-background">
        <div class="cta-glow"></div>
        <div class="cta-particles"></div>
      </div>
      
      <div class="cta-content">
        <h2 class="cta-title">
          Готовы создавать
          <span class="gradient-text">шедевры</span>?
        </h2>
        <p class="cta-text">
          Присоединяйтесь к тысячам дизайнеров, которые уже используют наш инструмент
          для создания потрясающих цветовых схем.
        </p>
        
        <div class="cta-actions">
          <button @click="startTutorial" class="cta-btn tutorial">
            <span class="btn-icon">🎓</span>
            <span class="btn-text">Начать обучение</span>
          </button>
          
          <router-link to="/generator" class="cta-btn start">
            <span class="btn-sparkle"></span>
            <span class="btn-icon">🚀</span>
            <span class="btn-text">Начать бесплатно</span>
            <span class="btn-arrow">→</span>
          </router-link>
        </div>
        
        <div class="cta-stats">
          <div class="stat">
            <div class="stat-value">10K+</div>
            <div class="stat-label">Пользователей</div>
          </div>
          <div class="stat">
            <div class="stat-value">50K+</div>
            <div class="stat-label">Палитр создано</div>
          </div>
          <div class="stat">
            <div class="stat-value">99%</div>
            <div class="stat-label">Довольных клиентов</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Данные
const featuredColors = ref([
  { id: 1, hex: '#6366f1', name: 'Royal Blue', animated: false },
  { id: 2, hex: '#8b5cf6', name: 'Violet', animated: false },
  { id: 3, hex: '#ec4899', name: 'Pink', animated: false },
  { id: 4, hex: '#10b981', name: 'Emerald', animated: false },
  { id: 5, hex: '#f59e0b', name: 'Amber', animated: false }
])

const features = ref([
  {
    id: 1,
    icon: '🎨',
    title: 'Умная генерация',
    description: 'AI-алгоритмы создают гармоничные палитры на основе цветового круга',
    highlights: ['AI-powered', '6 типов гармонии', 'Режимы настроения'],
    link: '/generator',
    hover: false,
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
  },
  {
    id: 2,
    icon: '📊',
    title: 'Глубокий анализ',
    description: 'Полный анализ доступности, контраста и цветовой психологии',
    highlights: ['WCAG 2.1/3.0', 'Контрастность', 'Психология цвета'],
    link: '/generator',
    hover: false,
    gradient: 'linear-gradient(135deg, #10b981, #0ea5e9)'
  },
  {
    id: 3,
    icon: '📚',
    title: 'Умная библиотека',
    description: 'Организуйте, ищите и управляйте вашими палитрами с легкостью',
    highlights: ['Поиск по тегам', 'Избранное', 'Папки и коллекции'],
    link: '/library',
    hover: false,
    gradient: 'linear-gradient(135deg, #f59e0b, #ec4899)'
  },
  {
    id: 4,
    icon: '📤',
    title: 'Профессиональный экспорт',
    description: 'Экспорт во все популярные форматы для дизайнеров и разработчиков',
    highlights: ['CSS/SCSS/LESS', 'Figma/Sketch', 'Tailwind/MUI'],
    link: '/export',
    hover: false,
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)'
  }
])

const quickActions = ref([
  {
    id: 1,
    icon: '🎲',
    title: 'Быстрая палитра',
    description: 'Случайная палитра из 5 цветов',
    action: 'quickPalette',
    hot: true,
    sparkles: true
  },
  {
    id: 2,
    icon: '🎨',
    title: 'Из фотографии',
    description: 'Извлеките палитру из изображения',
    action: 'fromImage',
    badge: 'New'
  },
  {
    id: 3,
    icon: '📈',
    title: 'Тренды 2024',
    description: 'Палитры по последним трендам',
    action: 'trending',
    badge: 'Trending'
  },
  {
    id: 4,
    icon: '🏆',
    title: 'Ежедневный вызов',
    description: 'Решите сегодняшний челлендж',
    action: 'dailyChallenge',
    badge: 'Daily'
  }
])

const userStats = ref({
  palettes: 42,
  colors: 210,
  time: '1,234',
  achievements: 8
})

const achievements = ref([
  {
    id: 1,
    icon: '🎯',
    title: 'Первая палитра',
    description: 'Создайте вашу первую цветовую палитру',
    unlocked: true,
    progress: 100
  },
  {
    id: 2,
    icon: '🏆',
    title: 'Мастер гармонии',
    description: 'Создайте 10 гармоничных палитр',
    unlocked: true,
    progress: 100
  },
  {
    id: 3,
    icon: '🔍',
    title: 'Исследователь',
    description: 'Протестируйте все типы генерации',
    unlocked: false,
    progress: 60
  },
  {
    id: 4,
    icon: '⭐',
    title: 'Звезда сообщества',
    description: 'Получите 50 лайков за ваши палитры',
    unlocked: false,
    progress: 30
  }
])

const quickType = ref('harmony')

// Методы
const floatingStyle = (index) => {
  const size = Math.random() * 150 + 100
  const duration = Math.random() * 20 + 10
  const delay = Math.random() * 5
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    background: `radial-gradient(circle, ${getRandomColor()} 0%, transparent 70%)`,
    filter: `blur(${size / 20}px)`
  }
}

const getRandomColor = () => {
  const colors = [
    'rgba(99, 102, 241, 0.2)',
    'rgba(139, 92, 246, 0.2)',
    'rgba(236, 72, 153, 0.2)',
    'rgba(16, 185, 129, 0.2)',
    'rgba(245, 158, 11, 0.2)'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const animateColor = (id) => {
  const color = featuredColors.value.find(c => c.id === id)
  if (color) {
    color.animated = true
    setTimeout(() => {
      color.animated = false
    }, 1000)
  }
}

const featureCardStyle = (feature) => {
  return {
    '--feature-gradient': feature.gradient
  }
}

const handleQuickAction = (action) => {
  switch(action.action) {
    case 'quickPalette':
      quickGenerate()
      break
    case 'fromImage':
      // Загрузка изображения
      break
    case 'trending':
      router.push('/library?filter=trending')
      break
    case 'dailyChallenge':
      router.push('/challenges')
      break
  }
}

const quickGenerate = () => {
  // Генерация быстрой палитры
  const quickPreview = document.querySelector('.quick-generator .color-preview')
  if (quickPreview) {
    quickPreview.classList.add('generating')
    setTimeout(() => {
      quickPreview.classList.remove('generating')
      // Показать сгенерированную палитру
    }, 1000)
  }
}

const startTutorial = () => {
  router.push('/tutorial')
}

// Анимации при загрузке
onMounted(() => {
  // Запуск анимаций при скролле
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated')
      }
    })
  }, observerOptions)

  // Наблюдаем за секциями
  document.querySelectorAll('.features-section, .quick-actions-section, .stats-section, .cta-section')
    .forEach(section => observer.observe(section))
})
</script>

<style scoped>
.home-view {
  overflow-x: hidden;
}

/* Герой-секция */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.floating-colors {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.floating-color {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s ease-in-out infinite;
}

.hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  height: 80vw;
  background: radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%);
  filter: blur(100px);
  opacity: 0.3;
  animation: pulse 4s ease-in-out infinite;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  width: 100%;
  align-items: center;
}

@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

.hero-text {
  animation: slideInLeft 1s ease;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--color-text) 0%, var(--color-text-soft) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
}

.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.neon-text {
  text-shadow: 0 0 10px var(--color-primary), 0 0 20px var(--color-primary);
  color: var(--color-primary);
}

.animated-text {
  display: inline-block;
  position: relative;
  overflow: hidden;
}

.animated-text::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--gradient-primary);
  transform: translateX(-100%);
  animation: textReveal 2s ease-in-out infinite;
}

@keyframes textReveal {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--color-text-soft);
  margin-bottom: 2.5rem;
  max-width: 600px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-normal);
  overflow: hidden;
}

.hero-btn.primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--neon-glow);
}

.hero-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: var(--neon-glow-strong);
}

.hero-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-text);
}

.hero-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
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

.hero-btn:hover .btn-sparkle {
  opacity: 1;
}

.btn-icon {
  font-size: 1.2rem;
  transition: transform var(--transition-normal);
}

.hero-btn:hover .btn-icon {
  transform: scale(1.2) rotate(10deg);
}

.btn-arrow {
  transition: transform var(--transition-normal);
}

.hero-btn:hover .btn-arrow {
  transform: translateX(5px);
}

/* Превью палитры */
.hero-visual {
  animation: slideInRight 1s ease;
}

.palette-preview {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-xl);
}

.palette-preview.floating {
  animation: float 6s ease-in-out infinite;
}

.preview-colors {
  display: flex;
  height: 120px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-color {
  flex: 1;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: flex var(--transition-normal);
}

.preview-color:hover {
  flex: 1.2;
}

.preview-color.animated {
  animation: colorPulse 1s ease;
}

@keyframes colorPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.color-tooltip {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all var(--transition-normal);
  pointer-events: none;
}

.preview-color:hover .color-tooltip {
  opacity: 1;
  transform: translateY(0);
}

.color-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 70%
  );
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.preview-color:hover .color-shine {
  opacity: 1;
  animation: shine 1s ease;
}

.preview-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-name {
  font-weight: 600;
  font-size: 1.1rem;
}

.preview-badge {
  background: var(--gradient-primary);
  color: white;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
}

/* Индикатор скролла */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.7;
  animation: fadeInUp 2s ease infinite;
}

.mouse {
  width: 30px;
  height: 50px;
  border: 2px solid var(--color-border);
  border-radius: 20px;
  position: relative;
}

.wheel {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 8px;
  background: var(--color-primary);
  border-radius: 2px;
  animation: scroll 2s infinite;
}

@keyframes scroll {
  0% { transform: translate(-50%, 0); opacity: 1; }
  100% { transform: translate(-50%, 20px); opacity: 0; }
}

.scroll-text {
  font-size: 0.8rem;
  color: var(--color-text-soft);
}

/* Секция особенностей */
.features-section {
  padding: 6rem 2rem;
  position: relative;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.section-subtitle {
  display: block;
  font-size: 1.1rem;
  color: var(--color-text-soft);
  font-weight: 400;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  padding: 2rem;
  transition: all var(--transition-normal);
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--feature-gradient);
  opacity: 0;
  transition: opacity var(--transition-normal);
  z-index: -1;
}

.feature-card:hover {
  transform: translateY(-10px);
  border-color: var(--color-primary);
  box-shadow: var(--neon-glow);
}

.feature-card:hover::before {
  opacity: 0.05;
}

.feature-glow {
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

.feature-card:hover .feature-glow {
  opacity: 0.2;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  transition: transform var(--transition-normal);
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(10deg);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.feature-description {
  color: var(--color-text-soft);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.feature-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.highlight {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text);
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-normal);
}

.feature-link:hover {
  gap: 0.75rem;
}

.link-arrow {
  transition: transform var(--transition-normal);
}

.feature-link:hover .link-arrow {
  transform: translateX(5px) rotate(45deg);
}

/* Секция быстрых действий */
.quick-actions-section {
  padding: 6rem 2rem;
  background: linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.05) 100%);
}

.actions-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .actions-container {
    grid-template-columns: 1fr;
  }
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  cursor: pointer;
  transition: all var(--transition-normal);
  overflow: hidden;
}

.action-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-primary);
  box-shadow: var(--neon-glow);
  background: rgba(99, 102, 241, 0.1);
}

.action-glow {
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

.action-card:hover .action-glow {
  opacity: 0.3;
}

.action-content {
  position: relative;
  z-index: 1;
}

.action-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  transition: transform var(--transition-normal);
}

.action-card:hover .action-icon {
  transform: scale(1.2) rotate(10deg);
}

.action-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.action-description {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  margin-bottom: 1rem;
}

.action-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--gradient-primary);
  color: white;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 600;
}

.action-sparkles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.action-card:hover .action-sparkles {
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

/* Быстрый генератор */
.quick-generator {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  padding: 2rem;
}

.quick-generator h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.color-preview {
  height: 100px;
  border-radius: var(--radius-lg);
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, 
    #6366f1 0%, 
    #8b5cf6 20%, 
    #ec4899 40%, 
    #10b981 60%, 
    #f59e0b 80%, 
    #6366f1 100%
  );
  background-size: 200% 100%;
  animation: gradientShift 3s linear infinite;
  transition: all var(--transition-normal);
}

.color-preview.generating {
  animation: generating 1s ease;
}

@keyframes generating {
  0% { filter: brightness(1); }
  50% { filter: brightness(1.5); }
  100% { filter: brightness(1); }
}

.generate-btn {
  width: 100%;
  padding: 1rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all var(--transition-normal);
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--neon-glow);
}

.quick-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.quick-options label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--color-text-soft);
  font-size: 0.9rem;
}

.quick-options input[type="radio"] {
  accent-color: var(--color-primary);
}

/* Секция статистики */
.stats-section {
  padding: 6rem 2rem;
}

.stats-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
}

.stats-card,
.achievements-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  padding: 2rem;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.stats-header h3 {
  font-size: 1.5rem;
  color: var(--color-text);
}

.stats-badge {
  background: var(--gradient-primary);
  color: white;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 3rem;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.stat-value.glow {
  text-shadow: 0 0 10px var(--color-primary-glow);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  margin-bottom: 1rem;
}

.stat-progress {
  width: 100%;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transition: width 1s ease;
}

/* Достижения */
.achievements-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.achievements-header h3 {
  font-size: 1.5rem;
  color: var(--color-text);
}

.view-all {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-normal);
}

.view-all:hover {
  transform: translateX(5px);
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.achievement {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}

.achievement.unlocked {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.achievement:hover {
  transform: translateX(5px);
  background: rgba(255, 255, 255, 0.1);
}

.achievement-icon {
  font-size: 2rem;
}

.achievement-content {
  flex: 1;
}

.achievement-content h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--color-text);
}

.achievement-content p {
  font-size: 0.8rem;
  color: var(--color-text-soft);
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.achievement-progress .progress {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.achievement-progress .progress-bar {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transition: width 1s ease;
}

.achievement-progress span {
  font-size: 0.8rem;
  color: var(--color-text-soft);
}

.achievement-badge .badge {
  font-size: 1.5rem;
}

/* CTA секция */
.cta-section {
  position: relative;
  padding: 8rem 2rem;
  text-align: center;
  overflow: hidden;
}

.cta-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.cta-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vw;
  background: radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%);
  filter: blur(150px);
  opacity: 0.5;
  animation: pulse 3s ease-in-out infinite;
}

.cta-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .cta-title {
    font-size: 2.5rem;
  }
}

.cta-text {
  font-size: 1.2rem;
  color: var(--color-text-soft);
  margin-bottom: 3rem;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
}

.cta-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2.5rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-normal);
  overflow: hidden;
}

.cta-btn.tutorial {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-text);
}

.cta-btn.tutorial:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.cta-btn.start {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--neon-glow);
}

.cta-btn.start:hover {
  transform: translateY(-3px);
  box-shadow: var(--neon-glow-strong);
}

.cta-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Анимации */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  0%, 100% {
    opacity: 0.5;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-10px);
  }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

@keyframes shine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Адаптивность */
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem;
  }
  
  .features-section,
  .quick-actions-section,
  .stats-section,
  .cta-section {
    padding: 3rem 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-actions {
    flex-direction: column;
  }
  
  .cta-stats {
    gap: 2rem;
  }
}
</style>