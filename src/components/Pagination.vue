<template>
  <div class="pagination" v-if="pages > 1">
    <button :disabled="current===1" @click="go(current-1)">上一页</button>
    <span>{{ current }} / {{ pages }}</span>
    <button :disabled="current===pages" @click="go(current+1)">下一页</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ current: number; pages: number }>()
const emit = defineEmits<{ (e: 'change', page: number): void }>()

function go(page: number) {
  if (page >= 1 && page <= props.pages) emit('change', page)
}
</script>

<style scoped>
.pagination { display: flex; align-items: center; gap: 12px; }
button { padding: 6px 10px; }
</style>
