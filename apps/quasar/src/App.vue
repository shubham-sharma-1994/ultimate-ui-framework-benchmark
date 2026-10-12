<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'slide-forward'" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<style>
/* Forward transition (Page 1 -> Page 2) */
.slide-forward-enter-active,
.slide-forward-leave-active {
  transition: all 0.3s cubic-bezier(0.65, 0, 0.35, 1);
}
.slide-forward-enter-from {
  transform: translateX(30%);
  opacity: 0;
}
.slide-forward-leave-to {
  transform: translateX(-10%);
  opacity: 0.6;
}

/* Backward transition (Page 2 -> Page 1) */
.slide-back-enter-active,
.slide-back-leave-active {
  transition: all 0.3s cubic-bezier(0.65, 0, 0.35, 1);
}
.slide-back-enter-from {
  transform: translateX(-10%);
  opacity: 0.6;
}
.slide-back-leave-to {
  transform: translateX(30%);
  opacity: 0;
}
</style>
