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
    path: "/docs/:page?",
    component: Documentation
  },
  {
    path: "*",
    redirect: "/",
  },
];