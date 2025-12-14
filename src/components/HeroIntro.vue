<template>
  <section class="hero">
    <div class="hero-card">
      <div class="avatar-wrap" ref="avatarWrap">
        <div class="avatar-ring"></div>
        <div class="avatar-glow"></div>
        <button class="avatar-trigger" type="button" @click="spawnParticles($event)">
          <img class="avatar-img" src="/itzlennyface.jpg" alt="我的头像" />
        </button>
        <div class="avatar-particles" aria-hidden="true">
          <span
            v-for="particle in particles"
            :key="particle.id"
            class="avatar-particle"
            :style="{
              '--tx': `${particle.x}px`,
              '--ty': `${particle.y}px`,
              '--particle-duration': `${particle.duration}ms`,
              top: `${particle.originY}px`,
              left: `${particle.originX}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: particle.color,
            }"
          ></span>
        </div>
      </div>
      <div class="hero-info">
        <p class="eyebrow">Itzlennyface's blog</p>
        <h1>{{ profile.name }}</h1>
        <div class="hero-copy">
          <p class="title">{{ profile.title }}</p>
          <p class="bio">{{ profile.bio }}</p>
        </div>
        <div class="chips">
          <span v-for="chip in focusAreas" :key="chip">{{ chip }}</span>
        </div>
        <div class="meta-row">
          <span>{{ profile.location }}</span>
          <span class="dot"></span>
          <span>{{ profile.availability }}</span>
        </div>
        <div class="actions">
          <router-link to="/posts" class="action primary">查看文章</router-link>
          <a v-for="social in socials" :key="social.label" :href="social.url" target="_blank" rel="noopener" class="action ghost">
            {{ social.label }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
interface SocialLink {
  label: string
  url: string
}

interface Pillar {
  label: string
  desc: string
}

interface Particle {
  id: number
  x: number
  y: number
  duration: number
  color: string
  originX: number
  originY: number
  size: number
}

const profile = {
  name: 'Itzlennyface',
  title: '',
  bio: '行百里者半九十',
  location: 'YSU student',
  availability: ''
}

const focusAreas = ['Java', 'Rust', 'OS']

const socials: SocialLink[] = [
  { label: 'GitHub', url: 'https://github.com/LennyFace24' },
  { label: '邮件', url: 'mailto:2984729884@qq.com' }
]

const initials = profile.name.charAt(0)

const avatarWrap = ref<HTMLElement | null>(null)
const particles = ref<Particle[]>([])
let particleSeed = 0
const particleColors = ['#c084fc', '#60a5fa', '#34d399', '#f472b6', '#fcd34d']

function spawnParticles(event: MouseEvent) {
  const rect = avatarWrap.value?.getBoundingClientRect()
  if (!rect) return

  const originX = event.clientX - rect.left
  const originY = event.clientY - rect.top
  const burst = 16
  for (let i = 0; i < burst; i++) {
    const id = particleSeed++
    const angle = Math.random() * Math.PI * 2
    const radius = 80 + Math.random() * 80
    const duration = 1100 + Math.random() * 600
    const size = 36 + Math.random() * 16
    particles.value.push({
      id,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      duration,
      color: particleColors[id % particleColors.length],
      originX,
      originY,
      size,
    })
    setTimeout(() => {
      particles.value = particles.value.filter(p => p.id !== id)
    }, duration)
  }
}
</script>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.hero-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 32px;
  padding: 32px;
  border-radius: 32px;
  border: 1px solid var(--panel-border);
  background: linear-gradient(135deg, var(--hero-grad-start), var(--hero-grad-end));
  backdrop-filter: blur(30px);
  box-shadow: var(--surface-shadow);
}

.avatar-wrap {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid var(--avatar-ring);
  opacity: 0.7;
}

.avatar-glow {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(125, 211, 252, 0.4), transparent 55%);
  filter: blur(30px);
  opacity: 0.5;
}

.avatar {
  position: relative;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: linear-gradient(160deg, var(--avatar-grad-start), var(--avatar-grad-end));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
  color: var(--text-strong);
  letter-spacing: 0.05em;
}

.avatar-trigger {
  position: relative;
  border: none;
  background: transparent;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  isolation: isolate;
  transition: transform 0.3s ease;
}

.avatar-trigger:hover .avatar-img,
.avatar-trigger:focus-visible .avatar-img {
  animation: jelly 0.8s ease;
}

.avatar-trigger:active .avatar-img {
  transform: scale(0.92);
}

.avatar-img {
  position: relative;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.35);
  z-index: 1;
  transition: transform 0.3s ease;
}

.avatar-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: visible;
}

.avatar-particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  opacity: 0;
  animation: particle-pop var(--particle-duration) ease-out forwards;
}

@keyframes jelly {
  0% { transform: scale(1); }
  30% { transform: scale(1.08, 0.92); }
  60% { transform: scale(0.95, 1.05); }
  100% { transform: scale(1); }
}

@keyframes particle-pop {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.4);
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
  }
}

.hero-info {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.hero-info h1 {
  margin: 0;
  font-family: 'Space Grotesk', 'Noto Sans SC', 'Inter', system-ui, sans-serif;
  font-size: clamp(32px, 4vw, 42px);
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.05;
  color: var(--heading);
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.eyebrow {
  color: var(--primary);
  letter-spacing: 0.2em;
  font-size: 12px;
  text-transform: uppercase;
}

.hero-copy .title {
  color: var(--muted);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
}

.hero-copy .bio {
  color: var(--muted);
  line-height: 1.35;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chips span {
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--chip-bg);
  border: 1px solid var(--chip-border);
  font-size: 13px;
  color: var(--nav-text);
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--muted);
  font-size: 14px;
}

.meta-row .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--surface-border);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.action {
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.04em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action.primary {
  background: linear-gradient(140deg, var(--primary), var(--primary-strong));
  color: #f8fafc;
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.3);
}

.action.ghost {
  border: 1px solid var(--surface-border);
  color: var(--nav-text);
}

.action:hover {
  transform: translateY(-2px);
}

.hero-panel {
  padding: 24px 28px;
  border-radius: 24px;
  border: 1px solid var(--panel-border);
  background: var(--hero-panel-bg);
  backdrop-filter: blur(20px);
}

.panel-title {
  margin: 0 0 16px;
  color: var(--heading);
  letter-spacing: 0.08em;
}

.panel-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.panel-list li {
  padding: 12px 0;
  border-bottom: 1px solid var(--panel-divider);
}

.panel-list li:last-child {
  border-bottom: none;
}

.label {
  margin: 0;
  color: var(--panel-label);
  font-weight: 600;
}

.desc {
  margin: 4px 0 0;
  color: var(--panel-desc);
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .hero-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .avatar-wrap {
    margin: 0 auto;
  }

  .hero-info {
    align-items: center;
  }

  .meta-row {
    justify-content: center;
  }

  .actions {
    justify-content: center;
  }
}

@media (max-width: 540px) {
  .hero-card {
    padding: 24px;
  }

  .hero {
    gap: 16px;
  }

  .hero-panel {
    padding: 20px;
  }
}
</style>
