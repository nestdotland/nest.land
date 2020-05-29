import Home from "./components/home/Home.vue";
import Gallery from "./components/gallery/Gallery.vue";

export const routes = [
  {
    path: "",
    component: Home,
  },
  {
    path: "/gallery",
    component: Gallery,
  },
];
