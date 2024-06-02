<script>
import axios from "axios";
import { store } from "./store";

export default {
  computed: {
    isLoggedIn() {
      return store.token !== "";
    },
  },
  methods: {
    async handleLogout() {
      try {
        const res = await axios.post(
          "http://localhost:3333/api/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${store.token}`,
            },
          }
        );

        if (res.error) {
          throw new Error(res);
        }

        store.token = { value: "" };

        this.$router.push("/signup");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<template>
  <nav class="w-full flex bg-gray-100 items-center justify-start p-4 gap-8">
    <RouterLink v-if="!isLoggedIn" class="hover:underline" to="/"
      >Go to Login Page</RouterLink
    >
    <RouterLink v-if="!isLoggedIn" class="hover:underline" to="/signup"
      >Go to Signup Page</RouterLink
    >
    <RouterLink v-if="isLoggedIn" class="hover:underline" to="/home"
      >Go to Home Page</RouterLink
    >
    <button @:click="handleLogout" v-if="isLoggedIn" class="hover:underline">
      Logout
    </button>
  </nav>
  <main>
    <RouterView :key="$route.fullPath" />
  </main>
</template>
