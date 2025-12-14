<template>
  <header class="nav">
    <div class="container nav-inner">
      <router-link to="/" class="brand">ItzLennyFace</router-link>
      <div class="nav-actions">
        <nav class="links">
          <router-link to="/posts">文章</router-link>
          <router-link to="/about">关于</router-link>
        </nav>
        <a
          class="github-btn"
          href="https://github.com/LennyFace24"
          target="_blank"
          rel="noopener"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.94c.58.11.79-.25.79-.55 0-.27-.01-.99-.01-1.95-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.7.08-.7 1.18.08 1.8 1.21 1.8 1.21 1.04 1.79 2.72 1.27 3.39.97.11-.75.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.28 1.2-3.08-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.49 3.19-1.18 3.19-1.18.63 1.58.23 2.75.11 3.04.75.8 1.2 1.82 1.2 3.08 0 4.44-2.7 5.4-5.28 5.68.42.36.8 1.07.8 2.16 0 1.56-.01 2.82-.01 3.2 0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
            />
          </svg>
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

useTheme()
</script>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: none;
  background: var(--nav-bg);
  backdrop-filter: blur(22px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.22);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  gap: 18px;
}

.brand {
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--heading);
  text-transform: uppercase;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.github-btn {
  width: 52px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid var(--nav-border);
  background: rgba(15, 23, 42, 0.06);
  color: var(--nav-text);
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.github-btn svg {
  width: 26px;
  height: 26px;
}

.github-btn:hover,
.github-btn:focus-visible {
  background: var(--nav-active-bg);
  color: var(--nav-active-text);
  box-shadow: 0 12px 25px rgba(37, 99, 235, 0.25);
  transform: translateY(-1px);
  outline: none;
}

.github-btn:active {
  transform: translateY(0);
}

.links {
  display: flex;
  gap: 18px;
}

.links :global(a) {
  color: var(--nav-text);
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 999px;
  outline: none;
  transition: color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

.links :global(a:hover) {
  color: var(--heading);
}

.links :global(a:focus-visible) {
  outline: none;
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.4);
}

.links :global(.router-link-active) {
  background: var(--nav-active-bg);
  color: var(--nav-active-text);
  box-shadow: 0 8px 20px rgba(30, 64, 175, 0.25);
}


@media (max-width: 640px) {
  .nav-inner {
    flex-direction: column;
    height: auto;
    padding: 12px 0;
  }

  .nav-actions {
    flex-direction: column;
  }

  .links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
