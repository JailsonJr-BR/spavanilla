const template = document.createElement("template")

template.innerHTML = `
<link rel="stylesheet" href="src/css/styles.css"/>
  <div class="book-card">
  <div class="book">
    <img />
  </div>
  <div class="title">
    <h3></h3>
  </div>
  <div>
    <button>View Details</button>
  </div>
  </div>
`

class BookCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open"})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  static get observedAttributes() {
    return ["name", "book"]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.shadowRoot.querySelector(".title h3").innerText =
      this.getAttribute("name")
    this.shadowRoot.querySelector(".book img").src =
      this.getAttribute("book")
  }
}

export default BookCard