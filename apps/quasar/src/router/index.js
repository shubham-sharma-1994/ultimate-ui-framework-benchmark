import { createRouter, createWebHistory } from 'vue-router'
import ShowcasePage from '../pages/ShowcasePage.vue'
import DetailPage from '../pages/DetailPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Showcase',
      component: ShowcasePage,
      meta: { index: 0 }
    },
    {
      path: '/detail/:id',
      name: 'Detail',
      component: DetailPage,
      props: true,
      meta: { index: 1 }
    }
  ]
})

router.afterEach((to, from) => {
  const toDepth = to.meta.index || 0
  const fromDepth = from.meta.index || 0
  to.meta.transition = toDepth < fromDepth ? 'slide-back' : 'slide-forward'
})

export default router
