import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import JobList from '../components/Job/JobList.vue';
import JobDetails from '../components/Job/JobDetails.vue';

// 定义路由
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'resume',
    component: () => import('@/views/resume/index.vue'),
    meta: { title: 'AI简历 - 简历制作' }
  },
  {
    path: '/resumeDesign',
    name: 'resumeDesign',
    component: () => import('@/views/resumeDesign/index.vue'),
    meta: { title: 'AI简历 - 简历设计' }
  },
  {
    path: '/template',
    name: 'template',
    component: () => import('@/views/template/index.vue'),
    meta: { title: 'AI简历 - 简历模板' }
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/views/setting/index.vue'),
    meta: { title: 'AI简历 - 网站配置' }
  },
  {
    path: '/aiDeep',
    name: 'aiDeep',
    component: () => import('@/views/aiDeep/index.vue'),
    meta: { title: 'AI简历 - AI深度交流', keepAlive: true }
  },
  {
    path:'/login',
    name:'login',
    component:()=>import('@/views/Login/index.vue'),
    meta: { title: 'AI简历 - 登录' }
  },
  {
    path:'/interview',
    name:'interview',
    component:()=>import('@/views/interview/index.vue'),
    meta:{title:'AI简历 - 面试'},
    children:[
      {
        path:'/interview/setting',
        name:'interviewSettings',
        component:()=>import('@/views/interview/components/setting.vue'),
      }
    ,
    {
      path:'/interview/room',
      name:'interviewRoom',
      component:()=>import('@/views/interview/components/room.vue'),
      meta: { hideLayout: true,hideThemeSwitcher: true  }, // 隐藏全局布局

    },
    {
      path:'/interview/report',
      name:'interviewReport',
      component:()=>import('@/views/interview/components/report.vue'),
    }
    ,
    {
      path:'/interview/manage',
      name:'interviewManage',
      component:()=>import('@/views/interview/components/manage.vue'),
    }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/404.vue')
  },
  {
    path: '/job-list',
    name: 'JobList',
    component: JobList
  },
  {
    path: '/job-details/:id',
    name: 'JobDetails',
    component: JobDetails
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 使用 HTML5 历史模式
  routes
});
router.afterEach((to) => {
  document.title = (to.meta?.title as string) || '默认标题';
});
export default router;
