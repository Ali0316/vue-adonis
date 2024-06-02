import { reactive } from "vue";

export const store = reactive({
  get token() {
    return (
      localStorage.getItem("token") || sessionStorage.getItem("token") || ""
    );
  },
  set token({ value, rememberMe = false }) {
    if (value === "") {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    } else {
      if (rememberMe) {
        localStorage.setItem("token", value);
      } else {
        sessionStorage.setItem("token", value);
      }
    }
  },
});
