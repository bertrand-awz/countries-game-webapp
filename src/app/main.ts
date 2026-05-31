import "../../style.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "@/app/App.vue";
import i18n from "@/app/i18n";
import router from "@/app/router";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(i18n);

app.mount("#app");
