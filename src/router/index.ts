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
          path: 'sign-in',
          name: 'sign-in',
          component: () => import('../views/SignIn.vue'),
          meta: { title: '每日签到', requiresAuth: true }
        },
        {
          path: 'lottery',
          name: 'Lottery',
          component: () => import('../views/Lottery.vue'),
          meta: { title: '幸运抽奖', requiresAuth: true }
        },
        {
          path: 'ticket',
          name: 'Ticket',
          component: () => import('../views/Ticket.vue'),
          meta: { title: '幸运刮刮乐', requiresAuth: true }
        },
        {
          path: 'lottery-history',
          name: 'Lottery-History',
          component: () => import('../views/Lottery-History.vue'),
          meta: { title: '抽奖记录', requiresAuth: true }
        },
        {
          path: 'history',
          name: 'History',
          component: () => import('../views/History.vue'),
          meta: { title: '积分历史', requiresAuth: true }
        },
        {
          path: 'tasks',
          name: 'Tasks',
          component: () => import('../views/Tasks.vue'),
          meta: { title: '每日任务', requiresAuth: true }
        },
        {
          path: 'festive',
          name: 'Festive',
          component: () => import('../views/Festive.vue'),
          meta: { title: '节日气氛', requiresAuth: true }
        },
        {
          path: 'posts',
          name: 'posts',
          component: () => import('../views/posts.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'share',
          name: 'share',
          component: () => import('../views/Share.vue'),
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