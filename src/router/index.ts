import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/AppDashboard.vue'
import RegStep1 from '@/views/register/RegStep1.vue'
import RegStep2 from '@/views/register/RegStep2.vue'
import RegStep3 from '@/views/register/RegStep3.vue'
import AppProfile from '@/views/AppProfile.vue'
import AppAuth from '@/views/AppAuth.vue'
import { useAuthStore } from '@/stores/authstore'
import AppGraphs from '@/views/AppGraphs.vue'
import AppRecepies from '@/views/AppRecepies.vue'
import AppMealsDiary from '@/views/AppMealsDiary.vue'
import { useRegisterStore } from '@/stores/register'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Dashboard, meta: { requiersAuth: true} },
    { path: '/register/step-1', component: RegStep1, meta: { guestOnly: true } }, 
    { path: '/register/step-2', component: RegStep2, meta: { guestOnly: true, requireRegisterStep1: true } },
    { path: '/register/step-3', component: RegStep3, meta: { guestOnly: true, requireRegisterStep1: true, requireRegisterStep2: true } },
    { path: '/profile', component: AppProfile, meta: { requiersAuth: true} },
    { path: '/auth', component: AppAuth, meta: { guestOnly: true } },
    { path: '/graphs', component: AppGraphs, meta: { requiersAuth: true} },
    { path: '/recepies', component: AppRecepies, meta: { requiersAuth: true} }, 
    { path: '/meals-diary', component: AppMealsDiary, meta: { requiersAuth: true} },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if(!auth.isAuthChecked) {
    await auth.checkAuth()
  }

  if(to.meta.requiersAuth && !auth.token) {
    return '/auth'
  }

  if (to.meta.guestOnly && auth.token) {
    return '/'
  }

  if (to.meta.requireRegisterStep1) {
    const register = useRegisterStore()
    if (
      !register.nickname ||
      !register.email || 
      !register.password
    ) {
      return '/register/step-1'
    }
  }

  if (to.meta.requireRegisterStep2) {
    const register = useRegisterStore()

    if (
      !register.userWeight ||
      !register.userHeight ||
      !register.userAge ||
      !register.gender
    ) {
      return '/register/step-2'
    }
  }
})

export default router
