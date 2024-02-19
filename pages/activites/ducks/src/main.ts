import { createApp } from "vue";
import { Lazyload } from "vant";
import App from "./App.vue";
import "@skr/act-utils/styles/reset.less";
import "@skr/act-utils/styles/animate.css";
// import store from '../../store/index';
const app = createApp(App);
// app.use(store).use(Lazyload);
app.use(Lazyload);
app.mount("#app");
