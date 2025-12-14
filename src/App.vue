<template>
  <div class="app-shell">
    <NavBar />
    <main class="container main-shell">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
</script>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 0;
}

.main-shell {
  flex: 1;
  width: 100%;
}

</style>
