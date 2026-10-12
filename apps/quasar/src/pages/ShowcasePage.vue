<template>
  <q-page class="showcase-page">
    <div class="scroll-container" @scroll="onScroll">
      <!-- 1. App bar -->
      <q-header
        class="bg-surface text-primary-token q-py-sm q-px-md"
        :class="{'shadow-1': isScrolled}"
        style="transition: box-shadow 0.15s cubic-bezier(0.2, 0, 0, 1);"
      >
        <q-toolbar class="q-pa-none">
          <q-toolbar-title class="text-title">Pulse</q-toolbar-title>
          <q-btn
            flat
            round
            dense
            id="theme-toggle"
            @click="toggleTheme"
          >
            <transition name="fade-rotate" mode="out-in">
              <q-icon :key="isDark ? 'dark' : 'light'" :name="isDark ? 'dark_mode' : 'light_mode'" />
            </transition>
          </q-btn>
        </q-toolbar>
      </q-header>

      <div class="content-wrapper">
        <!-- 2. Hero card -->
        <q-card class="hero-card">
          <q-card-section class="column justify-center items-center full-height">
            <div class="text-title text-white z-top text-center" style="margin-top: 32px;">Same app.<br>Every framework.</div>
            <div class="orbit-container" id="orbit">
              <div class="orbit-ring"></div>
              <div class="orbit-dot dot-1"></div>
              <div class="orbit-dot dot-2"></div>
              <div class="orbit-dot dot-3"></div>
            </div>
          </q-card-section>
        </q-card>

        <!-- 3. Counter row -->
        <div class="row items-center justify-between counter-row q-mt-md">
          <div class="row items-center q-gutter-sm">
            <div class="text-label text-muted">Taps</div>
            <div class="counter-display" style="width: 60px; overflow: hidden; height: 40px; position: relative;">
              <transition name="slide-up">
                <div :key="count" class="text-display" style="position: absolute; bottom: 0;">{{ count }}</div>
              </transition>
            </div>
          </div>
          <q-btn
            id="counter-inc"
            color="primary"
            round
            unelevated
            icon="add"
            @click="incrementCount"
            @pointerdown="startLongPress"
            @pointerup="cancelLongPress"
            @pointerleave="cancelLongPress"
            :class="{'shake': isShaking}"
            class="counter-btn"
          />
        </div>

        <!-- 4. Controls card -->
        <q-card class="bg-surface q-mt-md shadow-1" style="border-radius: 20px;">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-body">Notifications</div>
              <q-toggle v-model="notifications" id="switch" color="primary" />
            </div>

            <div class="q-mt-md">
              <div class="row justify-between text-label">
                <span class="text-muted">Intensity</span>
                <span class="text-primary-token">{{ intensity }}</span>
              </div>
              <q-slider
                v-model="intensity"
                id="slider"
                :min="0"
                :max="100"
                color="primary"
                class="q-mt-sm"
              />
            </div>

            <div class="row q-gutter-x-sm q-mt-md">
              <q-chip
                v-for="lvl in ['Low', 'Medium', 'High']"
                :key="lvl"
                :id="`chip-${lvl.toLowerCase()}`"
                clickable
                :selected="selectedLevel === lvl"
                @click="selectedLevel = lvl"
                :color="selectedLevel === lvl ? 'primary' : 'surfaceAlt'"
                :text-color="selectedLevel === lvl ? 'white' : 'text'"
                class="intensity-chip"
              >
                {{ lvl }}
              </q-chip>
            </div>
          </q-card-section>
        </q-card>

        <!-- 5. Text field -->
        <div class="q-mt-lg">
          <q-input
            v-model="name"
            id="name-input"
            label="Your name"
            outlined
            color="primary"
            class="name-input"
          />
          <transition name="fade">
            <div v-if="name" class="text-body q-mt-sm text-primary-token transition-all">Hello, {{ name }}</div>
          </transition>
        </div>

        <!-- 6. List -->
        <div class="q-mt-lg list-container">
          <transition-group name="staggered-fade" tag="div">
            <q-item
              v-for="(item, index) in items"
              :key="item.id"
              :id="`item-${item.id}`"
              clickable
              @click="goToDetail(item.id)"
              class="list-item"
              :style="{ animationDelay: `${index * 50}ms` }"
            >
              <q-item-section avatar>
                <div
                  class="item-thumbnail hero-thumbnail"
                  :style="`background: linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})`"
                ></div>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-title">{{ item.title }}</q-item-label>
                <q-item-label caption class="text-caption text-muted">{{ item.subtitle }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="chevron_right" class="text-muted" />
              </q-item-section>
            </q-item>
          </transition-group>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import data from '../data.json'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const isScrolled = ref(false)
const onScroll = (e) => {
  isScrolled.value = e.target.scrollTop > 0
}

const isDark = ref(false)
const toggleTheme = () => {
  isDark.value = !isDark.value
  document.body.classList.toggle('body--dark', isDark.value)
  $q.dark.set(isDark.value)
}

const count = ref(0)
const incrementCount = () => {
  count.value++
}

let longPressTimer = null
const isShaking = ref(false)
const startLongPress = () => {
  longPressTimer = setTimeout(() => {
    count.value = 0
    isShaking.value = true
    setTimeout(() => {
      isShaking.value = false
    }, 300)
  }, 500)
}
const cancelLongPress = () => {
  clearTimeout(longPressTimer)
}

const notifications = ref(false)
const intensity = ref(50)
const selectedLevel = ref('Medium')
const name = ref('')

const items = ref([])
onMounted(() => {
  // Stagger entrance
  setTimeout(() => {
    items.value = data.items
  }, 100)
})

const goToDetail = (id) => {
  router.push(`/detail/${id}`)
}
</script>

<style scoped>
.showcase-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.scroll-container {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

.q-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 56px;
  background-color: var(--surface);
  color: var(--text);
}

.content-wrapper {
  padding: 16px;
  padding-bottom: 32px;
}

/* Hero card */
.hero-card {
  height: 180px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  position: relative;
  overflow: hidden;
}

/* Orbit animation */
.orbit-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  pointer-events: none;
}
.orbit-ring {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}
.orbit-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  margin: -6px 0 0 -6px;
  animation: orbit 3s linear infinite;
}
.dot-1 { animation-delay: 0s; }
.dot-2 { animation-delay: -1s; }
.dot-3 { animation-delay: -2s; }

@keyframes orbit {
  0% { transform: rotate(0deg) translateX(40px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
}

/* Counter Slide up */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.65, 0, 0.35, 1);
}
.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Button scaling */
.counter-btn:active {
  transform: scale(0.96);
  transition: transform 0.15s cubic-bezier(0.2, 0, 0, 1);
}

/* Shake animation */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  16%, 50%, 83% { transform: translateX(-6px); }
  33%, 66% { transform: translateX(6px); }
}
.shake {
  animation: shake 0.3s ease-in-out;
}

/* Intensity chip transition */
.intensity-chip {
  transition: background-color 0.15s cubic-bezier(0.2, 0, 0, 1),
              color 0.15s cubic-bezier(0.2, 0, 0, 1);
}

/* Fade Rotate */
.fade-rotate-enter-active,
.fade-rotate-leave-active {
  transition: all 0.5s cubic-bezier(0.05, 0.7, 0.1, 1);
}
.fade-rotate-enter-from,
.fade-rotate-leave-to {
  opacity: 0;
  transform: rotate(180deg);
}

/* Input label float (Quasar does this natively with 'outlined' + standard props, we'll rely on it, but adjust outline transition if needed) */
.name-input :deep(.q-field__control) {
  border-radius: 14px;
}
.name-input :deep(.q-field__control:before) {
  transition: border-color 0.15s cubic-bezier(0.2, 0, 0, 1), border-width 0.15s cubic-bezier(0.2, 0, 0, 1);
}
.name-input :deep(.q-field__control:after) {
  transition: border-color 0.15s cubic-bezier(0.2, 0, 0, 1), border-width 0.15s cubic-bezier(0.2, 0, 0, 1);
}
.name-input :deep(.q-field__label) {
  transition: transform 0.15s cubic-bezier(0.2, 0, 0, 1), color 0.15s cubic-bezier(0.2, 0, 0, 1);
}

/* Staggered list */
.list-item {
  animation: slideFadeUp 0.5s cubic-bezier(0.05, 0.7, 0.1, 1) both;
  margin-bottom: 16px;
  padding: 0;
}
.item-thumbnail {
  width: 56px;
  height: 56px;
  border-radius: 16px;
}

@keyframes slideFadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
