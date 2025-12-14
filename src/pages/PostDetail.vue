<template>
  <section class="post-detail rise-flow">
    <article v-if="post">
      <h1>{{ post.title }}</h1>
      <p class="meta">{{ post.date }} · {{ post.tags.join(', ') }}</p>
      <div class="content" v-html="post.content"></div>
    </article>
    <p v-else>文章未找到。</p>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import posts from '../data/posts'

const route = useRoute()
const slug = route.params.slug as string
const post = posts.find(p => p.slug === slug)
</script>

<style scoped>
.post-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meta {
  color: rgba(191, 219, 254, 0.9);
}

.content :global(p),
.content :global(li) {
  color: rgba(248, 250, 252, 0.98);
  line-height: 1.9;
}

.content :global(li) {
  margin-bottom: 0.4em;
}
</style>
