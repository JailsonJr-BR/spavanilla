export class handleRoute {
  constructor() {
    this.routes = {};
  }

  add(routeName, page) {
    this.routes[routeName] = page
  }

  route(event) {
    event = event || window.event
    event.preventDefault()

    window.history.pushState({}, "", event.target.href)

    this.handle()
  }

  handle() {
    const { pathname } = window.location
    const route = this.routes [pathname] || this.routes [404]

    fetch(route).then(data => data.text()).then(html => {
      document.querySelector('#appRender').innerHTML = html
    })
  }

  renderNavLinks() {
    const navLinks = document.getElementById("navLinksRender");

    const routes = {
      "/": "Home",
      "/about": "About us",
    }

    for (const route in routes) {
      const link = document.createElement("a");
      link.href = route;
      link.innerText = routes[route];
      link.onclick = () => this.route()
      navLinks.appendChild(link);
    }
  }
}