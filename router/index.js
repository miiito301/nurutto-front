import { createRouter, createWebHistory } from "vue-router";
import Form from "../src/components/Form.vue";
import Search from "../src/components/Search.vue";
import Login from "../src/components/Login.vue";
import Signup from "../src/components/Signup.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/form", component: Form, meta: { requiresAuth: true } },
  { path: "/search", component: Search, meta: { requiresAuth: true } },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 認証ガード
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if ((to.path === "/login" || to.path === "/signup") && isAuthenticated) {
    next("/form");
  } else {
    next();
  }
});

export default router;
