import { HandleDashboard } from "./dashboardController.js";

export class HandleBook {
  constructor() {
    this.dashboard = new HandleDashboard();
  }

  async createBook () {
    await this.dashboard.renderSelect()

    const form = document.getElementById("book-form");
    const input = document.getElementById('image-path');

    // Mostra o livro selecionado pelo usuario
    input.addEventListener('change', () => {
      const image = document.getElementById('selected-image');
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        image.src = reader.result;
      }

      reader.readAsDataURL(file);
    });

    // Faz o cadastro de um livro
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData (form);
      const requestBody = {
        method: "POST",
        body: formData
      };

      fetch("http://localhost:3001/books", requestBody)
      .then((response) => response.json())
      .then(async (data) => {
        alert("Livro criado com sucesso:", data);
        await this.dashboard.renderViewDashboard()
        await this.dashboard.renderTable();
        const bookForm = document.querySelector('.add-book')
        bookForm.classList.remove('active')
      })
      .catch((error) => {
        alert("Ocorreu um erro ao criar o livro:", error);
      });
    });

  }

  async renderBooksByCategories () {
    await fetch('http://localhost:3001/category', {
      method: 'GET',
      mode: 'cors'
    })
    .then(response => response.json())
    .then(async categories => {
      // Criacao da estrutura de sessoes de livros por categoria e percorre todas as categorias
      for (const category of categories) {
        const bookStyleDiv = document.createElement('div');
        const bookRender = document.querySelector('.bookRender');
        bookStyleDiv.classList.add('book-style')

        const categoryTitle = document.createElement('h2');
        categoryTitle.innerText = category.name;
        categoryTitle.classList.add('category-title')

        const buttonBookPrev = document.createElement('button');
        buttonBookPrev.classList.add('book-prev')
        buttonBookPrev.classList.add('glider-prev')
        buttonBookPrev.innerText = '‹'

        const buttonBookNext = document.createElement('button');
        buttonBookNext.classList.add('book-next')
        buttonBookNext.classList.add('glider-next')
        buttonBookNext.innerText = '›'

        const divRenderBook = document.createElement("div")
        divRenderBook.classList.add('book-slider')

        // Listagem dos livros por categoria
        const categoryWithBook = await fetch(`http://localhost:3001/category/${category._id}`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(async books => {
          // Se a categoria nao conter nenhum livro, retorna null
          if (books.length === 0) {
            return null;
          }

          // Cria a estrutura dos cards dos books, onde percorre todos os livros, da categoria atual
          for (const book of books) {
            const link = document.createElement("book-card");
            link.setAttribute("name", book.name);
            const imagePath = "http://localhost:3001/" + book.imagePath;
            link.setAttribute("book", imagePath);

            // Abre o modal do livro atual
            link.addEventListener("click", () => {
              this.openBookModal(book);
            });

            divRenderBook.setAttribute("id", book.category_id)
            divRenderBook.appendChild(link);
          }

        })

        // Uma categoria so ira carregar caso tenha livro na mesma
        if(categoryWithBook !== null) {
          bookRender.appendChild(bookStyleDiv)
          bookStyleDiv.appendChild(categoryTitle)
          bookStyleDiv.appendChild(buttonBookPrev)
          bookStyleDiv.appendChild(buttonBookNext)
          bookStyleDiv.appendChild(divRenderBook);
        }
      }
    })
  }

  openBookModal(book) {
    const modal = document.createElement("div");
    // Cria modal do book na DOM
    modal.innerHTML = `
    <div class="modal-book">
        <img src="http://localhost:3001/${book.imagePath}" />
        <div>
        <h2>${book.name}</h2>
        <p>Autor:  <span>${book.author}</span></p>
        <h3>Descrição:</h3>
        <p>${book.description}</p>
        <button class="modal-back-button">Voltar</button>
        </div>
    </div>
    `;

    document.body.appendChild(modal);

    const backButton = modal.querySelector(".modal-back-button");

    // Evento de remover modal do book
    backButton.addEventListener("click", () => {
      modal.remove();
    });
  }
}
