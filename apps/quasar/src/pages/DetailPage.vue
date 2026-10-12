<template>
  <q-page class="detail-page" v-if="item">
    <!-- 1. Collapsing header -->
    <div class="header-container" :style="{ height: headerHeight + 'px' }">
      <div
        class="header-bg hero-thumbnail"
        :style="[
          `background: linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})`,
          { transform: `translateY(${scrollOffset * 0.5}px)` },
          { viewTransitionName: 'hero-thumbnail' }
        ]"
      ></div>

      <q-btn
        id="back"
        flat
        round
        dense
        icon="arrow_back"
        color="white"
        class="back-btn z-top absolute-top-left q-ma-sm"
        @click="goBack"
      />

      <div
        class="header-title z-top absolute-bottom q-pa-md text-white text-display"
        :style="{
          transform: `translateY(${-scrollOffset * 0.2}px) scale(${titleScale})`,
          transformOrigin: 'bottom left',
          bottom: '0'
        }"
      >
        {{ item.title }}
      </div>
    </div>

    <div class="scroll-container" @scroll="onScroll" style="height: calc(100vh - 56px); overflow-y: auto;">
      <!-- Spacing for header content area -->
      <div style="height: 184px;"></div>

      <div class="content-wrapper q-pa-md bg-surface" style="border-radius: 28px 28px 0 0; min-height: 100vh; position: relative; z-index: 1;">

        <!-- 2. Progress ring -->
        <div class="row justify-center q-my-xl">
          <div class="progress-ring-container" @click="replayRing" id="ring">
            <svg class="progress-ring" width="120" height="120">
              <circle
                class="progress-ring-bg"
                stroke="var(--surface-alt)"
                stroke-width="12"
                fill="transparent"
                r="54"
                cx="60"
                cy="60"
              />
              <circle
                class="progress-ring-circle"
                :stroke="item.colors[0]"
                stroke-width="12"
                stroke-linecap="round"
                fill="transparent"
                r="54"
                cx="60"
                cy="60"
                :style="{ strokeDasharray: circumference, strokeDashoffset: dashoffset }"
              />
            </svg>
            <div class="progress-text text-display text-primary-token">{{ Math.round(currentScore) }}%</div>
          </div>
        </div>

        <!-- 3. Expandable panel -->
        <q-expansion-item
          id="accordion"
          class="q-mt-md bg-surface shadow-1"
          style="border-radius: 20px; overflow: hidden;"
          header-class="text-title"
          :label="'Details'"
          expand-icon-class="text-muted"
        >
          <q-card>
            <q-card-section class="text-body fade-in-section">
              {{ item.body }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <!-- 4. Draggable card -->
        <div class="drag-area q-mt-xl" ref="dragArea">
          <div
            id="drag-card"
            class="drag-card shadow-2 bg-primary text-white row items-center justify-center text-title"
            :style="dragStyle"
            @pointerdown="startDrag"
          >
            Drag me
          </div>
        </div>

        <!-- 5. Swipe-to-dismiss list -->
        <div class="q-mt-xl">
          <transition-group name="list" tag="div">
            <q-slide-item
              v-for="swipeItem in swipeList"
              :key="swipeItem.id"
              :id="`swipe-${swipeItem.id}`"
              @right="(e) => onSwipeRight(e, swipeItem)"
              right-color="negative"
              class="q-mb-sm rounded-borders shadow-1"
            >
              <template v-slot:right>
                <q-icon name="delete" />
              </template>
              <q-item class="bg-surface">
                <q-item-section class="text-body">Swipe item {{ swipeItem.id }}</q-item-section>
              </q-item>
            </q-slide-item>
          </transition-group>

          <q-btn
            v-if="swipeList.length < 3"
            id="swipe-reset"
            flat
            color="primary"
            class="q-mt-sm"
            @click="resetSwipe"
          >
            Reset
          </q-btn>
        </div>

        <!-- 6. Buttons row -->
        <div class="row q-gutter-sm q-mt-xl justify-center">
          <q-btn id="btn-dialog" color="primary" unelevated @click="showDialog = true">Show dialog</q-btn>
          <q-btn id="btn-sheet" color="secondary" unelevated @click="showSheet = true">Show sheet</q-btn>
          <q-btn id="btn-toast" color="accent" text-color="black" unelevated @click="showToast">Toast</q-btn>
        </div>

        <!-- 7. Loading shimmer -->
        <div class="q-mt-xl relative-position" style="min-height: 100px;">
          <transition name="fade" mode="out-in">
            <div v-if="isLoading" id="shimmer" class="shimmer-container">
              <div class="shimmer-line" style="width: 100%;"></div>
              <div class="shimmer-line" style="width: 80%;"></div>
              <div class="shimmer-line" style="width: 60%;"></div>
            </div>
            <div v-else class="text-body text-muted fade-enter">
              This is the actual loaded body content replacing the shimmer after 1.5 seconds.
            </div>
          </transition>
        </div>

        <div style="height: 100px;"></div>
      </div>
    </div>

    <!-- Modals -->
    <q-dialog v-model="showDialog" transition-show="scale" transition-hide="scale">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-title">Dialog</div>
        </q-card-section>
        <q-card-section class="text-body">
          This is a modal dialog.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showSheet" position="bottom">
      <q-card style="border-radius: 28px 28px 0 0; width: 100%;">
        <div class="row justify-center q-pt-md cursor-pointer" v-close-popup>
          <div style="width: 40px; height: 4px; border-radius: 2px; background: var(--outline);"></div>
        </div>
        <q-card-section>
          <div class="text-title q-mb-md">Bottom Sheet</div>
          <div class="text-body text-muted">Drag handle or tap outside to dismiss.</div>
        </q-card-section>
        <div style="height: 100px;"></div>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import data from '../data.json'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const item = ref(null)
const scrollOffset = ref(0)

const headerHeight = computed(() => Math.max(56, 240 - scrollOffset.value))
const titleScale = computed(() => {
  const progress = Math.min(1, scrollOffset.value / (240 - 56))
  return 1 - (progress * (1 - 20/32))
})

const onScroll = (e) => {
  scrollOffset.value = e.target.scrollTop
}

const goBack = () => {
  router.back()
}

// Progress Ring
const circumference = 2 * Math.PI * 54
const dashoffset = ref(circumference)
const currentScore = ref(0)
let animFrame = null

const animateRing = () => {
  if (!item.value) return
  const targetScore = item.value.score
  const duration = 500 // slow
  const startTime = performance.now()

  const animate = (time) => {
    let progress = (time - startTime) / duration
    if (progress > 1) progress = 1

    // cubic-bezier(0.05, 0.7, 0.1, 1) approximation
    const easeProgress = 1 - Math.pow(1 - progress, 4)

    currentScore.value = easeProgress * targetScore
    dashoffset.value = circumference - (easeProgress * targetScore / 100) * circumference

    if (progress < 1) {
      animFrame = requestAnimationFrame(animate)
    }
  }
  cancelAnimationFrame(animFrame)
  animFrame = requestAnimationFrame(animate)
}

const replayRing = () => {
  dashoffset.value = circumference
  currentScore.value = 0
  setTimeout(animateRing, 50)
}

// Draggable card (Spring physics approximated with transition)
const dragArea = ref(null)
const isDragging = ref(false)
const dragPos = ref({ x: 0, y: 0 })
const startPos = ref({ x: 0, y: 0 })

const dragStyle = computed(() => ({
  transform: `translate(${dragPos.value.x}px, ${dragPos.value.y}px)`,
  transition: 'none'
}))

let animationFrameId = null
let velocityX = 0
let velocityY = 0

const animateSpring = () => {
  const stiffness = 300
  const damping = 20
  const mass = 1

  const springForceX = -stiffness * dragPos.value.x
  const dampingForceX = -damping * velocityX
  const accelerationX = (springForceX + dampingForceX) / mass
  velocityX += accelerationX * 0.016 // 16ms approx for 60fps
  dragPos.value.x += velocityX * 0.016

  const springForceY = -stiffness * dragPos.value.y
  const dampingForceY = -damping * velocityY
  const accelerationY = (springForceY + dampingForceY) / mass
  velocityY += accelerationY * 0.016
  dragPos.value.y += velocityY * 0.016

  if (Math.abs(dragPos.value.x) < 0.1 && Math.abs(velocityX) < 0.1 && Math.abs(dragPos.value.y) < 0.1 && Math.abs(velocityY) < 0.1) {
    dragPos.value = { x: 0, y: 0 }
    cancelAnimationFrame(animationFrameId)
  } else {
    animationFrameId = requestAnimationFrame(animateSpring)
  }
}

const startDrag = (e) => {
  isDragging.value = true
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  startPos.value = {
    x: e.clientX - dragPos.value.x,
    y: e.clientY - dragPos.value.y
  }
  document.addEventListener('pointermove', onDrag)
  document.addEventListener('pointerup', endDrag)
}

const onDrag = (e) => {
  if (!isDragging.value) return
  let newX = e.clientX - startPos.value.x
  let newY = e.clientY - startPos.value.y

  // Bound to 240px play area (card is 96px, so bound is +- 72px)
  const bound = (240 - 96) / 2
  dragPos.value = {
    x: Math.max(-bound, Math.min(bound, newX)),
    y: Math.max(-bound, Math.min(bound, newY))
  }
}

const endDrag = () => {
  isDragging.value = false
  velocityX = 0
  velocityY = 0
  animateSpring() // Spring back
  document.removeEventListener('pointermove', onDrag)
  document.removeEventListener('pointerup', endDrag)
}

// Swipe list
const initialSwipeList = [{id: 1}, {id: 2}, {id: 3}]
const swipeList = ref([...initialSwipeList])

const onSwipeRight = ({ reset }, swipeItem) => {
  swipeList.value = swipeList.value.filter(i => i.id !== swipeItem.id)
  reset()
}

const resetSwipe = () => {
  swipeList.value = [...initialSwipeList]
}

// Modals
const showDialog = ref(false)
const showSheet = ref(false)

const showToast = () => {
  $q.notify({
    message: 'This is a toast message',
    color: 'surface',
    textColor: 'text',
    position: 'bottom',
    timeout: 2000,
    classes: 'shadow-2'
  })
}

// Shimmer
const isLoading = ref(true)

onMounted(() => {
  const id = parseInt(route.params.id)
  item.value = data.items.find(i => i.id === id)

  if (item.value) {
    setTimeout(animateRing, 100) // slight delay for entrance
  }

  setTimeout(() => {
    isLoading.value = false
  }, 1500)
})

</script>

<style scoped>
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  max-width: 480px;
  margin: 0 auto;
  z-index: 10;
  overflow: hidden;
  transition: height 0s; /* Handled by JS */
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  will-change: transform;
}

.header-title {
  transition: transform 0s;
}

/* Progress ring */
.progress-ring-container {
  position: relative;
  width: 120px;
  height: 120px;
  cursor: pointer;
}
.progress-ring {
  transform: rotate(-90deg);
}
.progress-ring-circle {
  transition: stroke-dashoffset 0.5s cubic-bezier(0.05, 0.7, 0.1, 1);
}
.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Expandable content fade */
.fade-in-section {
  animation: fadeIn 0.3s ease-in both;
  animation-delay: 0.15s;
}

/* Drag area */
.drag-area {
  width: 240px;
  height: 240px;
  margin: 0 auto;
  border: 2px dashed var(--outline);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  touch-action: none;
}
.drag-card {
  width: 96px;
  height: 96px;
  border-radius: 20px;
  cursor: grab;
  user-select: none;
  touch-action: none;
}
.drag-card:active {
  cursor: grabbing;
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s cubic-bezier(0.65, 0, 0.35, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Shimmer */
.shimmer-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.shimmer-line {
  height: 20px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--surface-alt) 25%, var(--outline) 50%, var(--surface-alt) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
