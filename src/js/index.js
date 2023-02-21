import { handleRoute } from "./router.js"
import { activeNav } from "./utils.js"
import BookCard from "./components/BookCard.js"

const router = new handleRoute()
router.add("/", "../src/pages/home.html")
router.add("/about", "../src/pages/about.html")
router.add("/contact", "../src/pages/contact.html")
router.add("/admin", "../src/pages/dashboard.html")
router.add("/contactview", "../src/pages/contactview.html")
router.add(404, "../src/pages/404.html")

router.handle()
router.renderNavLinks()
await router.dom()

activeNav()

window.customElements.define('book-card', BookCard)
window.onpopstate = () => router.handle()
window.route = () => router.route()