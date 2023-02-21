import { HandleBook } from "./controllers/bookController.js";
import { HandleDashboard } from "./controllers/dashboardController.js";

export class handleRoute {
  constructor() {
    this.routes = {};
    this.book = new HandleBook();
    this.dashboard = new HandleDashboard();
  }

  // Adiciona as rotas e o caminho das mesmas
  add(routeName, page) {
    this.routes[routeName] = page
  }

  route(event) {
    event = event || window.event
    event.preventDefault()

    window.history.pushState({}, "", event.target.href)

    this.handle()
    this.dom()
    this.dashboard.renderTable()
  }

  // Permite a renderizacao da aplicacao
  handle() {
    const { pathname } = window.location
    const route = this.routes [pathname] || this.routes [404]

    fetch(route).then(data => data.text()).then(html => {
      document.querySelector('#appRender').innerHTML = html
    })
  }

  // Funcao que renderiza o menu de navegecao
  renderNavLinks() {
    const navLinks = document.getElementById("navLinksRender");

    const routes = {
      "/": "Início",
      "/about": "Sobre nós",
      "/contact": "Contate-nos",
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

  // Funcao que verifica a pagina atual, e permite que elas renderizem oque precisam para o seu funcionamento
  async dom() {
    const { pathname } = window.location
    const route = this.routes [pathname] || this.routes [404]

    const app = await fetch(route).then(data => data.text()).then(html => {
      return document.querySelector('#appRender').innerHTML
    })

    if (pathname === "/") {
      await this.book.renderBooksByCategories()

      const heroSlider = document.querySelector(".home-slider")
      new Glider(heroSlider, {
        slidesToShow: 1,
        draggable: true,
        rewind: true,
        arrows: {
          prev: ".hero-prev",
          next: ".hero-next",
        },
      })

      const bookSliders = document.querySelectorAll(".book-slider")

      bookSliders.forEach (async bookSlider => {
        const container = bookSlider.parentNode
        const prevButton = container.querySelector(".book-prev")
        const nextButton = container.querySelector(".book-next")

        await new Glider(bookSlider, {
          slidesToShow: 5,
          draggable: true,
          rewind: true,
          resizeLock: false,
          arrows: {
            prev: prevButton,
            next: nextButton,
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
      })
    }

    if (pathname === "/contact") {
      this.dashboard.createContact()
    }

    if (pathname === "/admin") {
      await this.dashboard.renderTable()
      await this.dashboard.renderViewDashboard()
      this.book.createBook()
      const addBookButton = document.querySelector('.add-book-model')
      const bookForm = document.querySelector('.add-book')
      const backAddBook = document.querySelector('.back-add-book')
      const addCategoryButton = document.querySelector('.category-book-model')
      const viewContactsButton = document.querySelector('.contact-book-model')

      addCategoryButton.addEventListener('click', async () => {
        await this.dashboard.createCategory()
      })

      viewContactsButton.addEventListener('click', async () => {
        this.route()
      })

      addBookButton.addEventListener('click', async () => {
        bookForm.classList.add('active')
      })

      backAddBook.addEventListener('click', async () => {
        bookForm.classList.remove('active')
      })


    }

    if (pathname === "/contactview") {
      await this.dashboard.renderContact()
    }

    return app
  }

}