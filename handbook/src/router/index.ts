import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/Create.vue'),
    },
    {
      path: '/editor',
      name: 'editor-root',
      component: () => import('../views/Editor.vue'),
    },
    {
      path: '/editor/:id',
      name: 'editor',
      component: () => import('../views/Editor.vue'),
      props: true
    },
    {
      path: '/mood',
      name: 'mood',
      component: () => import('../views/Mood.vue'),
    },
    {
      path: '/mood-calendar',
      name: 'mood-calendar',
      component: () => import('../views/MoodCalendar.vue'),
    },
    {
      path: '/mood-card',
      name: 'mood-card',
      component: () => import('../views/MoodCard.vue'),
    },
    {
      path: '/album',
      name: 'album',
      component: () => import('../views/Album.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue'),
    },
    {
      path: '/project/:id',
      name: 'project',
      component: () => import('../views/ProjectDetail.vue'),
      props: true
    },
    {
      path: '/export',
      name: 'export',
      component: () => import('../views/Export.vue'),
    },
  ],
})

export default router
