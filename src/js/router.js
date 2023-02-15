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
    this.dom()
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
      "/contact": "Contact",
      "/admin": "Dashboard",
    }

    for (const route in routes) {
      const link = document.createElement("a");
      link.href = route;
      link.innerText = routes[route]
      link.classList = 'nav-item'
      link.onclick = () => this.route()
      navLinks.appendChild(link);
    }
  }

  async dom() {
    const { pathname } = window.location
    const route = this.routes [pathname] || this.routes [404]

    const app = await fetch(route).then(data => data.text()).then(html => {
      return document.querySelector('#appRender').innerHTML
    })

    if (pathname === "/") {
      const $simpleCarousel = document.querySelector(".glider");

    new Glider($simpleCarousel, {
      slidesToShow: 1,
      draggable: false,
      infinity: true,
      rewind: true,
      arrows: {
        prev: ".glider-prev",
        next: ".glider-next",
      },
    });
    }

    return app
  }
}