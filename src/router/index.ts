import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../pages/Home.vue'
import Posts from '../pages/Posts.vue'
import PostDetail from '../pages/PostDetail.vue'
import About from '../pages/About.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home },
  { path: '/posts', name: 'posts', component: Posts },
  { path: '/posts/:slug', name: 'post', component: PostDetail },
  { path: '/about', name: 'about', component: About }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
