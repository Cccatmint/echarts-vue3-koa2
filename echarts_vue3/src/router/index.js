import { createRouter, createWebHashHistory } from 'vue-router'
// import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    redirect: '/screenpage'
  },
  {
    path: '/sellerpage',
    name: 'SellerPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "SellerPage" */ '../views/SellerPage.vue')
  },
  {
    path: '/trendpage',
    name: 'TrendPage',
    component: () => import(/* webpackChunkName: "TrendPage" */ '../views/TrendPage.vue')
  },
  {
    path: '/mappage',
    name: 'MapPage',
    component: () => import(/* webpackChunkName: "MapPage" */ '../views/MapPage.vue')
  },
  {
    path: '/rankpage',
    name: 'RankPage',
    component: () => import(/* webpackChunkName: "RankPage" */ '../views/RankPage.vue')
  },
  {
    path: '/hotpage',
    name: 'HotPage',
    component: () => import(/* webpackChunkName: "HotPage" */ '../views/HotPage.vue')
  },
  {
    path: '/stockpage',
    name: 'StockPage',
    component: () => import(/* webpackChunkName: "StockPage" */ '../views/StockPage.vue')
  },
  {
    path: '/screenpage',
    name: 'ScreenPage',
    component: () => import(/* webpackChunkName: "ScreenPage" */ '../views/ScreenPage.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
