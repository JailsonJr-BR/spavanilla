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
      const heroSlider = document.querySelector(".home-slider");
      new Glider(heroSlider, {
        slidesToShow: 1,
        draggable: true,
        rewind: true,
        arrows: {
          prev: ".hero-prev",
          next: ".hero-next",
        },
        duration: 0.5,
      })

      const bookSlider = document.querySelector(".book-slider");
      new Glider(bookSlider, {
        draggable: true,
        rewind: true,
        resizeLock: false,
        arrows: {
          prev: ".book-prev",
          next: ".book-next",
        },
        responsive: [
          {
            breakpoint: 900,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 575,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 360,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1
            }
          }
        ]
      })
    }

    return app
  }
}