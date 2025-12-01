<template>
  <div class="not-found-view">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>Страница не найдена</h2>
      <p>Запрошенная страница не существует или была перемещена.</p>
      
      <div class="not-found-actions">
        <router-link to="/" class="home-btn">
          🏠 На главную
        </router-link>
        <router-link to="/generator" class="generator-btn">
          🎨 К генератору
        </router-link>
      </div>
      
      <div class="not-found-info">
        <p>Попробуйте одну из этих страниц:</p>
        <ul>
          <li><router-link to="/">Главная</router-link></li>
          <li><router-link to="/generator">Генератор палитр</router-link></li>
          <li><router-link to="/library">Библиотека</router-link></li>
          <li><router-link to="/export">Экспорт</router-link></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

console.log('Страница не найдена:', route.path)
</script>

<style scoped>
.not-found-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.not-found-content {
  max-width: 600px;
  padding: 2rem;
}

.not-found-content h1 {
  font-size: 8rem;
  color: var(--color-primary);
  margin: 0;
  line-height: 1;
  font-weight: 900;
}

.not-found-content h2 {
  font-size: 2rem;
  color: var(--color-heading);
  margin: 1rem 0;
}

.not-found-content p {
  color: var(--color-text-soft);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.not-found-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.home-btn,
.generator-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.home-btn {
  background: var(--color-primary);
  color: white;
}

.generator-btn {
  background: var(--color-secondary);
  color: white;
}

.home-btn:hover,
.generator-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.not-found-info {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: left;
}

.not-found-info p {
  margin: 0 0 1rem 0;
  font-weight: 600;
  color: var(--color-heading);
}

.not-found-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.not-found-info li {
  margin-bottom: 0.5rem;
}

.not-found-info a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.not-found-info a:hover {
  color: var(--color-secondary);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .not-found-content h1 {
    font-size: 5rem;
  }
  
  .not-found-actions {
    flex-direction: column;
  }
}
</style>