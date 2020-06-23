import Home from "./components/home/Home";
import Gallery from "./components/gallery/Gallery";
import PackageDetail from "./components/package/PackageDetail";
import Documentation from "./components/docs/Documentation";
import NotFound from "./components/error/NotFound";

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
    path: "/package/:id",
    component: PackageDetail,
    props: (route) => ({ v: route.query.v })
  },
  {
    path: "/package/:id/*",
    component: PackageDetail
  },
  {
    path: "/docs",
    component: Documentation
  },
  {
    path: "/404",
    component: NotFound
  },
  {
    path: "*",
    redirect: "/404",
  },
];