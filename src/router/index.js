import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/plan',
      name: 'Plan',
      component: () => import('@/views/Plan.vue')
    },

    

  ],
})

export default router