//import { renderNavLinks } from "./routes/render-nav-links.js";
import { handleRoute } from "./router.js";

const router = new handleRoute()
router.add("/", "../src/pages/home.html")
router.add("/about", "../src/pages/about.html")
router.add(404, "../src/pages/404.html")

router.handle()
router.renderNavLinks()

window.onpopstate = () => router.handle()
window.route = () => router.route()