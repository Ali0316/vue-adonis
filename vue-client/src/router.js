import { createWebHistory, createRouter } from "vue-router";

import SignUp from "./SignUp.vue";
import HomeView from "./HomeView.vue";
import LogIn from "./LogIn.vue";
import { store } from "./store";

const routes = [
  { path: "/", component: LogIn },
  { path: "/signup", component: SignUp },
  { path: "/home", component: HomeView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.token !== "";

  if (isLoggedIn) {
    if (to.path !== "/home") {
      next("/home");
    } else {
      next();
    }
  } else {
    if (to.path !== "/signup" && to.path !== "/") {
      next("/login");
    } else {
      next();
    }
  }
});

export default router;
