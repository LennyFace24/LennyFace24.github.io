<template>
  <router-link :to="`/posts/${post.slug}`" class="card" aria-label="查看文章">
    <div class="card-body">
      <h3 class="title">{{ post.title }}</h3>
      <p class="meta">{{ post.date }} · {{ post.tags.join(', ') }}</p>
      <p class="excerpt">{{ post.excerpt }}</p>
    </div>
  </router-link>
</template>

<script setup lang="ts">
interface Post {
  slug: string
  title: string
  excerpt: string
  content?: string
  date: string
  tags: string[]
}

defineProps<{ post: Post }>()
</script>

<style scoped>
.card {
  position: relative;
  padding: 24px;
  border-radius: 22px;
  border: 1px solid var(--card-border);
  background: var(--card-bg);
  color: var(--card-text);
  overflow: hidden;
  backdrop-filter: blur(18px);
  box-shadow: var(--card-shadow);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  display: block;
  cursor: pointer;
  outline: none;
}

.card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(125, 211, 252, 0.35), transparent 55%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.card:hover,
.card:focus-visible {
  transform: translateY(-9px) scale(1.015);
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: 0 42px 80px rgba(15, 23, 42, 0.38);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(148, 163, 184, 0.04));
}

.card:hover::after,
.card:focus-visible::after {
  opacity: 1;
}

.card:active {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 26px 48px rgba(15, 23, 42, 0.34);
}

.title {
  font-weight: 700;
  font-size: 20px;
  display: inline-block;
  color: var(--card-text);
  margin-bottom: 12px;
}

.meta {
  color: var(--card-meta);
  font-size: 14px;
  letter-spacing: 0.04em;
}

.excerpt {
  margin-top: 12px;
  color: var(--muted);
}

@media (prefers-reduced-motion: reduce) {
  .card,
  .card::after {
    transition: none;
  }
}
</style>
