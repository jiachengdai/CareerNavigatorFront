import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useTokenStore } from '@/store/token';
import { useAccountInfoStore } from '@/store/account';
import { getCurrentUserInfo } from '@/api/account';


// 定义路由
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/resume',
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
    meta: { title: 'AI简历 - 登录', hideHeader: true }
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
    path: '/profile/:username',
    name: 'profile',
    component: () => import('@/views/profile/index.vue'),
    meta: { title: 'AI简历 - 个人信息' }
  },
  {
    path: '/user-management',
    name: 'userManagement',
    component: () => import('@/views/userManagement/index.vue'),
    meta: { title: 'AI简历 - 用户管理' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/404.vue')
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 使用 HTML5 历史模式
  routes
});

// 不需要登录即可访问的路由路径
const publicRoutes = ['/login', '/404'];

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  console.log('路由守卫检查:', to.path);
  
  // 如果是公开路由，直接放行
  if (publicRoutes.includes(to.path) || to.path.startsWith('/:pathMatch')) {
    console.log('访问公开页面，无需验证');
    return next();
  }
  
  // 获取 token 和用户信息
  const tokenStore = useTokenStore();
  const accountStore = useAccountInfoStore();
  const hasToken = !!tokenStore.token;
  
  console.log('路由守卫 - Token状态:', hasToken ? '存在' : '不存在');
  console.log('路由守卫 - 用户信息状态:', accountStore.info ? '存在' : '不存在');
  
  // 没有token，重定向到登录页
  if (!hasToken) {
    console.log('没有Token，重定向到登录页');
    return next('/login');
  }
  
  // 有token但没有用户信息，尝试获取用户信息
  if (!accountStore.info) {
    console.log('有Token但没有用户信息，尝试获取用户信息');
    try {
      const userInfoResult = await getCurrentUserInfo();
      console.log('获取用户信息结果:', userInfoResult);
      
      if (userInfoResult.code === 0 && userInfoResult.data) {
        console.log('成功获取到用户信息');
        accountStore.setInfo(userInfoResult.data);
        return next(); // 获取成功后放行
      } else {
        console.log('获取用户信息失败，清除Token并重定向到登录页');
        tokenStore.removeToken();
        return next('/login');
      }
    } catch (error) {
      console.error('获取用户信息发生错误:', error);
      tokenStore.removeToken();
      accountStore.removeInfo();
      return next('/login');
    }
  }
  
  // 有token和用户信息，直接放行
  console.log('用户已登录，允许访问:', to.path);
  next();
});

router.afterEach((to) => {
  document.title = (to.meta?.title as string) || '默认标题';
});

export default router;
