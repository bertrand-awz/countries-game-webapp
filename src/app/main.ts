import "../../style.css";

import { createApp } from "vue";

import App from "@/app/App.vue";
import i18n from "@/app/i18n";
import router from "@/app/router";

createApp(App).use(router).use(i18n).mount("#app");
