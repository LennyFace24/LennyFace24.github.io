<template>
  <section class="home rise-flow">
    <HeroIntro />
    <router-link to="/posts" class="home-cta" aria-label="查看全部文章">
      <div class="cta-content">
        <h2>欢迎来到Itzlennyface的博客</h2>
        <p>记录我的技术探索、读书感悟、游戏体验</p>
      </div>
      <span class="cta-link">开始阅读 →</span>
    </router-link>
  </section>
</template>

<script setup lang="ts">
import HeroIntro from '../components/HeroIntro.vue'
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
}


.home-cta {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-radius: 32px;
  border: 1px solid var(--panel-border);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(226, 240, 255, 0.015));
  backdrop-filter: blur(30px);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.28);
  gap: 16px;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.32s ease, background 0.32s ease;
  outline: none;
}

.home-cta::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(125, 211, 252, 0.35), transparent 60%);
  opacity: 0;
  transition: opacity 0.25s ease;
  pointer-events: none;
}

.home-cta:hover,
.home-cta:focus-visible {
  transform: translateY(-6px) scale(1.012);
  box-shadow: 0 32px 60px rgba(15, 23, 42, 0.35);
  outline: none;
}

.home-cta:hover::after,
.home-cta:focus-visible::after {
  opacity: 1;
}

.home-cta:active {
  transform: translateY(-2px) scale(1.005);
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.3);
}

.cta-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.home-cta h2 {
  margin: 0 0 6px;
  color: var(--heading);
}

.home-cta p {
  margin: 0;
  color: var(--muted);
}

.cta-link {
  color: var(--primary-strong);
  font-weight: 600;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease;
}

.home-cta:hover .cta-link,
.home-cta:focus-visible .cta-link {
  transform: translateX(4px);
}

@media (max-width: 640px) {
  .home-cta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
