<template>
  <footer class="footer">
    <div class="container">
      <p>© {{ year }} Itzlennyface 的博客 · </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--footer-border);
  background: var(--footer-bg);
  backdrop-filter: blur(18px);
  padding: 24px 0;
}

.footer p {
  margin: 0;
  color: var(--footer-text);
  font-size: 14px;
  letter-spacing: 0.04em;
}
</style>
