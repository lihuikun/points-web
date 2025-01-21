import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('../views/Auth.vue')
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('../views/Home.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'lottery',
          name: 'Lottery',
          component: () => import('../views/Lottery.vue'),
          meta: { title: '幸运抽奖', requiresAuth: true }
        },
        {
          path: 'tasks',
          name: 'Tasks',
          component: () => import('../views/Tasks.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('../views/Profile.vue'),
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/auth')
  } else if (to.path === '/auth' && token) {
    next('/')
  } else {
    next()
  }
})

export default router 