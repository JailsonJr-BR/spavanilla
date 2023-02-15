export function renderNavLinks() {

  const navLinks = document.getElementById("navLinksRender");

  const routes = {
    "/": "Home",
    "/about": "About us",
  }

  for (const route in routes) {
    const link = document.createElement("a");
    link.href = route;
    link.innerText = routes[route];
    link.onclick = () => router.route(route);
    navLinks.appendChild(link);
  }
}
