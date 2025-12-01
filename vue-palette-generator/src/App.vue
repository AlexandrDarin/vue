<template>
  <div id="app" class="app">
    <!-- Анимированный фон -->
    <div class="background-effects">
      <div class="gradient-bg"></div>
      <div class="particles">
        <div v-for="i in 20" :key="i" class="particle" :style="particleStyle(i)"></div>
      </div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Шапка с неоновыми эффектами -->
    <header class="app-header glass slide-down">
      <div class="container">
        <div class="header-content">
          <!-- Логотип с анимацией -->
          <router-link to="/" class="logo-link">
            <div class="logo-wrapper">
              <div class="logo-icon">
                <div class="logo-glow"></div>
                <div class="logo-core">🎨</div>
              </div>
              <div class="logo-text">
                <h1 class="logo-title neon-text">Vue<span class="gradient-text">Palette</span></h1>
                <p class="logo-subtitle">Color Magic Generator</p>
              </div>
            </div>
          </router-link>

          <!-- Главная навигация -->
          <nav class="main-nav">
            <router-link 
              v-for="link in navLinks" 
              :key="link.path"
              :to="link.path"
              class="nav-link"
              :class="{ 'active': $route.path === link.path }"
            >
              <span class="nav-icon">{{ link.icon }}</span>
              <span class="nav-text">{{ link.text }}</span>
              <span class="nav-glow"></span>
            </router-link>
          </nav>

          <!-- Правый блок -->
          <div class="header-right">
            <!-- Переключатель темы с неоновым эффектом -->
            <button 
              @click="toggleTheme" 
              class="theme-toggle glow-on-hover"
              :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            >
              <div class="toggle-track">
                <div class="toggle-thumb" :class="{ 'dark': isDark }">
                  <span class="toggle-icon">{{ isDark ? '🌙' : '☀️' }}</span>
                </div>
              </div>
              <div class="toggle-glow"></div>
            </button>

            <!-- Кнопка генерации -->
            <router-link to="/generator" class="generate-btn pulse">
              <span class="btn-glow"></span>
              <span class="btn-icon">✨</span>
              <span class="btn-text">Generate</span>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Основной контент -->
    <main class="main-content">
      <div class="container">
        <router-view v-slot="{ Component }">
          <transition 
            name="page-transition" 
            mode="out-in"
            @before-enter="beforeEnter"
            @after-enter="afterEnter"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Футер -->
    <footer class="app-footer glass slide-up">
      <div class="container">
        <div class="footer-content">
          <div class="footer-left">
            <div class="footer-logo">
              <span class="logo-emoji">🎨</span>
              <span class="footer-title">VuePalette</span>
            </div>
            <p class="footer-tagline">Create. Explore. Inspire.</p>
          </div>

          <div class="footer-links">
            <a href="#" class="footer-link">Documentation</a>
            <a href="#" class="footer-link">GitHub</a>
            <a href="#" class="footer-link">Support</a>
            <a href="#" class="footer-link">Contact</a>
          </div>

          <div class="footer-right">
            <p class="footer-credits">
              Made with <span class="heart">💜</span> using Vue 3
            </p>
            <p class="footer-copyright">
              © {{ currentYear }} VuePalette Generator • Practice 27-28
            </p>
          </div>
        </div>
      </div>
    </footer>

    <!-- Плавающие элементы -->
    <div class="floating-elements">
      <div v-for="i in 3" :key="i" class="floating-orb" :style="orbStyle(i)"></div>
    </div>

    <!-- Уведомления -->
    <transition name="notification-slide">
      <div v-if="notification.show" class="notification" :class="notification.type">
        <div class="notification-content">
          <span class="notification-icon">{{ notificationIcon }}</span>
          <span class="notification-message">{{ notification.message }}</span>
          <button @click="notification.show = false" class="notification-close">✕</button>
        </div>
        <div class="notification-progress" :style="{ animationDuration: '3s' }"></div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Состояние темы
const isDark = ref(false)

// Навигационные ссылки
const navLinks = [
  { path: '/', icon: '🏠', text: 'Home' },
  { path: '/generator', icon: '🎨', text: 'Generator' },
  { path: '/library', icon: '📚', text: 'Library' },
  { path: '/export', icon: '📤', text: 'Export' }
]

// Уведомления
const notification = ref({
  show: false,
  message: '',
  type: 'info'
})

// Текущий год для футера
const currentYear = ref(new Date().getFullYear())

// Иконка уведомления
const notificationIcon = computed(() => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: '💡'
  }
  return icons[notification.value.type] || '💡'
})

// Стили для частиц фона
const particleStyle = (index) => {
  const size = Math.random() * 100 + 50
  const duration = Math.random() * 20 + 10
  const delay = Math.random() * 5
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    background: `radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%)`
  }
}

// Стили для плавающих сфер
const orbStyle = (index) => {
  const size = index * 40 + 60
  const duration = index * 2 + 5
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    background: `radial-gradient(circle, var(--color-${index === 1 ? 'primary' : index === 2 ? 'secondary' : 'accent'}-glow) 0%, transparent 70%)`,
    filter: `blur(${index * 10}px)`
  }
}

// Переключение темы
const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  
  showNotification(
    `Switched to ${isDark.value ? 'Dark' : 'Light'} Mode`,
    'info'
  )
}

// Показать уведомление
const showNotification = (message, type = 'info') => {
  notification.value = {
    show: true,
    message,
    type
  }
  
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// Анимации переходов страниц
const beforeEnter = (el) => {
  el.style.opacity = '0'
  el.style.transform = 'translateY(20px)'
}

const afterEnter = (el) => {
  el.style.transition = 'all 0.5s ease'
  el.style.opacity = '1'
  el.style.transform = 'translateY(0)'
}

// Инициализация при загрузке
onMounted(() => {
  // Загрузка темы
  const savedTheme = localStorage.getItem('theme') || 'light'
  isDark.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
  
  // Глобальная функция для уведомлений
  window.showNotification = showNotification
  
  // Добавляем классы для анимаций при загрузке
  document.body.classList.add('loaded')
  
  // Слушаем изменения маршрута для анимаций
  watch(() => route.path, () => {
    // Можно добавить дополнительные эффекты при смене страницы
  })
})

// Экспортируем функцию уведомлений
defineExpose({ showNotification })
</script>

<style scoped>
/* Основные стили */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

/* Анимированный фон */
.background-effects {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
}

.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-bg);
  opacity: 0.3;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s ease-in-out infinite;
  filter: blur(40px);
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(circle at center, black, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at center, black, transparent 80%);
}

/* Шапка */
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: slideDown 0.5s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

/* Логотип */
.logo-link {
  text-decoration: none;
  color: inherit;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  position: relative;
  width: 50px;
  height: 50px;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  filter: blur(15px);
  opacity: 0.7;
  animation: glow 3s ease-in-out infinite;
}

.logo-core {
  position: relative;
  width: 50px;
  height: 50px;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 1;
  transition: transform var(--transition-bounce);
}

.logo-wrapper:hover .logo-core {
  transform: scale(1.1) rotate(15deg);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 1.8rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1;
}

.gradient-text {
  background: linear-gradient(45deg, var(--color-accent), var(--color-success));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-subtitle {
  font-size: 0.8rem;
  color: var(--color-text-soft);
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* Навигация */
.main-nav {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: var(--color-text-soft);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity var(--transition-normal);
  z-index: -1;
}

.nav-link:hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--neon-glow);
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-link.active {
  color: white;
  background: var(--gradient-primary);
  box-shadow: var(--neon-glow);
}

.nav-link.active:hover {
  box-shadow: var(--neon-glow-strong);
}

.nav-icon {
  font-size: 1.2rem;
  transition: transform var(--transition-normal);
}

.nav-link:hover .nav-icon {
  transform: scale(1.2) rotate(10deg);
}

.nav-text {
  font-weight: 600;
  font-size: 0.9rem;
}

.nav-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%);
  opacity: 0;
  transition: opacity var(--transition-normal);
  z-index: -1;
}

.nav-link:hover .nav-glow {
  opacity: 0.3;
}

/* Правая часть шапки */
.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Переключатель темы */
.theme-toggle {
  position: relative;
  width: 60px;
  height: 30px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.toggle-track {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--color-bg-mute);
  border-radius: var(--radius-full);
  overflow: hidden;
  border: 2px solid var(--color-border);
  transition: all var(--transition-normal);
}

.theme-toggle:hover .toggle-track {
  border-color: var(--color-primary);
  box-shadow: var(--neon-glow);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-bounce);
  z-index: 1;
}

.toggle-thumb.dark {
  transform: translateX(30px);
}

.toggle-icon {
  font-size: 12px;
  transition: transform var(--transition-bounce);
}

.toggle-thumb:hover .toggle-icon {
  transform: rotate(180deg);
}

.toggle-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 40px;
  background: radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%);
  opacity: 0;
  transition: opacity var(--transition-normal);
  pointer-events: none;
}

.theme-toggle:hover .toggle-glow {
  opacity: 0.5;
}

/* Кнопка генерации */
.generate-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  overflow: hidden;
  transition: all var(--transition-normal);
  animation: pulse 2s infinite;
}

.generate-btn:hover {
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
  background: radial-gradient(circle, white 0%, transparent 70%);
  opacity: 0.2;
  animation: glow 2s ease-in-out infinite;
}

.btn-icon {
  font-size: 1.2rem;
  animation: float 3s ease-in-out infinite;
}

/* Основной контент */
.main-content {
  flex: 1;
  padding: 3rem 0;
  position: relative;
  z-index: 1;
}

/* Анимации переходов страниц */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.5s ease;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Футер */
.app-footer {
  margin-top: auto;
  padding: 2rem 0;
  border-top: 1px solid var(--color-border);
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-emoji {
  font-size: 1.5rem;
}

.footer-title {
  font-size: 1.2rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-tagline {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  color: var(--color-text-soft);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all var(--transition-normal);
  position: relative;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gradient-primary);
  transition: width var(--transition-normal);
}

.footer-link:hover {
  color: var(--color-text);
}

.footer-link:hover::after {
  width: 100%;
}

.footer-right {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: right;
}

.footer-credits {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  margin: 0;
}

.heart {
  color: var(--color-error);
  animation: pulse 1.5s infinite;
}

.footer-copyright {
  font-size: 0.8rem;
  color: var(--color-text-mute);
  margin: 0;
}

/* Плавающие элементы */
.floating-elements {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  animation: float 15s ease-in-out infinite;
  opacity: 0.1;
}

.floating-orb:nth-child(1) {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.floating-orb:nth-child(2) {
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.floating-orb:nth-child(3) {
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

/* Уведомления */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  z-index: 1000;
  max-width: 350px;
}

.notification.success {
  border-left: 4px solid var(--color-success);
}

.notification.error {
  border-left: 4px solid var(--color-error);
}

.notification.warning {
  border-left: 4px solid var(--color-warning);
}

.notification.info {
  border-left: 4px solid var(--color-info);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
}

.notification-icon {
  font-size: 1.2rem;
}

.notification-message {
  flex: 1;
  font-size: 0.9rem;
}

.notification-close {
  background: none;
  border: none;
  color: var(--color-text-soft);
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  transition: color var(--transition-fast);
}

.notification-close:hover {
  color: var(--color-error);
}

.notification-progress {
  height: 3px;
  background: var(--gradient-primary);
  animation: progress 3s linear forwards;
}

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}

.notification-slide-enter-active,
.notification-slide-leave-active {
  transition: all 0.3s ease;
}

.notification-slide-enter-from,
.notification-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .header-content {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .main-nav {
    order: 3;
    width: 100%;
    margin-top: 1rem;
    justify-content: center;
  }
  
  .header-right {
    order: 2;
  }
}

@media (max-width: 768px) {
  .logo-title {
    font-size: 1.5rem;
  }
  
  .nav-text {
    display: none;
  }
  
  .nav-link {
    padding: 0.75rem;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .footer-right {
    text-align: center;
  }
  
  .footer-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .generate-btn .btn-text {
    display: none;
  }
  
  .generate-btn {
    padding: 0.75rem;
  }
}
</style>