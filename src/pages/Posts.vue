<template>
  <section class="posts rise-flow">
    <h2>全部文章</h2>
    <div class="grid rise-flow">
      <PostCard v-for="p in paged" :key="p.slug" :post="p" />
    </div>
    <Pagination :current="page" :pages="pages" @change="page = $event" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PostCard from '../components/PostCard.vue'
import Pagination from '../components/Pagination.vue'
import posts from '../data/posts'

const page = ref(1)
const pageSize = 6
const pages = computed(() => Math.ceil(posts.length / pageSize))
const paged = computed(() => posts.slice((page.value - 1) * pageSize, page.value * pageSize))
</script>

<style scoped>
.posts { display: flex; flex-direction: column; gap: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
</style>
