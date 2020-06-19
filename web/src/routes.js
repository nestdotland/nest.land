import Home from "./components/home/Home";
import Gallery from "./components/gallery/Gallery";
import PackageDetail from "./components/package/PackageDetail";
import Documentation from "./components/docs/Documentation";

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
    component: PackageDetail
  },
  {
    path: "/package/:id/files/*",
    component: PackageDetail
  },
  {
    path: "/docs",
    component: Documentation
  },
  {
    path: "*",
    redirect: "/",
  },
];