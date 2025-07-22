import { createRouter, createWebHistory } from 'vue-router';
import TheHome from './view/TheHome.vue';
import { oa, OpenEventKeys } from '@/analytics';

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: TheHome,
    meta: {
      title: '通用',
    },
  },

  {
    path: '/icons',
    name: 'icons',
    component: () => import('@/view/TheIcons.vue'),
    meta: {
      title: '图标',
    },
  },
  {
    path: '/text',
    name: 'text',
    component: () => import('@/view/TheText.vue'),
    meta: {
      title: '文本',
    },
  },
];

export const router = createRouter({
  // history: createWebHashHistory('./'),
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savePosition) {
    if (savePosition) {
      return savePosition;
    } else {
      return {
        top: 0,
        behavior: 'smooth',
      };
    }
  },
});

router.afterEach((to, from) => {
  oa.report(OpenEventKeys.PV, () => ({
    prev_page: from.fullPath,
    url: to.fullPath,
    title: to.meta.title as string,
  }));
});
