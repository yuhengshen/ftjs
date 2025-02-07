import { createApp } from "vue";
import { registerForm } from "@tf/antd";
import App from "./App.vue";

registerForm();
createApp(App).mount("#app");
