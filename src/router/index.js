import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/stand",
    component: () => import("@/views/Stand.vue"),
    children: [
      {
        path: "optimizer-v3",
        name: "OptimizerV3",
        component: () => import("@/views/OptimizerV3/Home"),
      },
      {
        path: "optimizer-v3/:id",
        name: "PoolV3",
        component: () => import("@/views/OptimizerV3/Pool"),
      },
      {
        path: "farm",
        name: "FarmStand",
        component: () => import("@/views/FarmStand/index.vue"),
      },
      {
        path: "positions",
        name: "Positions",
        component: () => import("@/views/MyPositions/index.vue"),
      },
    ],
  },
  {
    path: "/stake",
    name: "Nice",
    component: () => import("@/views/Nice.vue"),
  },
  {
    path: "/bridge",
    name: "Bridge",
    component: () => import("@/views/Bridge.vue"),
  },
  // Not found (404)
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

export default router;
