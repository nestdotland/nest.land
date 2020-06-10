import Home from "./components/home/Home";
import Gallery from "./components/gallery/Gallery";

export const routes = [
  {
    path: "",
    component: Home,
  },
  {
    path: "/gallery",
    component: Gallery,
    props: (route) => ({ search: route.query.search })
  },
  {
    path: "*",
    redirect: "/",
  },
];