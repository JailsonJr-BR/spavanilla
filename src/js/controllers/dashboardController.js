export class HandleDashboard {
  async renderViewDashboard () {
    // Renderiza a quantidade total de categorias cadastradas
    await fetch('http://localhost:3001/category', {
      method: 'GET',
      mode: 'cors'
    })
    .then(response => response.json())
    .then(categories => {
      const categoriesQuantity = document.querySelector('.categories-view')
      categoriesQuantity.innerText = categories.length
    })

    // Renderiza a quantidade total de livros cadastrados
    await fetch('http://localhost:3001/books', {
      method: 'GET',
      mode: 'cors'
    })
    .then(response => response.json())
    .then(books => {
      const booksQuantity = document.querySelector('.books-view')
      booksQuantity.innerText = books.length
    })

    // Renderiza a quantidade total de contatos enviados
    await fetch('http://localhost:3001/contact', {
      method: 'GET',
      mode: 'cors'
    })
    .then(response => response.json())
    .then(contact => {
      const contactQuantity = document.querySelector('.contact-view')
      contactQuantity.innerText = contact.length
    })
  }

  async renderTable() {
    const table = document.querySelector('#books-table');
    await fetch('http://localhost:3001/books')
      .then(response => response.json())
      .then(async data => {
        table.querySelector('tbody').innerHTML = '';

        // Faz a buscas das categorias
        const categoriesMap = {};
        await fetch('http://localhost:3001/category')
        .then(response => response.json())
        .then(categories => {
          categories.forEach(category => {
            categoriesMap[category._id] = category.name;
          });
        });

        // Cria uma linha para cada livro
        data.forEach(book => {
          const row = document.createElement('tr');
          const name = document.createElement('td');
          name.textContent = book.name;
          const author = document.createElement('td');
          author.textContent = book.author;
          const description = document.createElement('td');
          description.textContent = categoriesMap[book.category_id]
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Excluir';
          const deleteCell = document.createElement('td');
          deleteCell.appendChild(deleteBtn);

          // Remove um livro cadastrado
          deleteBtn.addEventListener('click', async () => {
            try {
              const removeBook = confirm(`Tem certeza que deseja excluir o livro: ${book.name}?`)
              if(removeBook) {
                await fetch(`http://localhost:3001/books/${book._id}`, { method: 'DELETE' });
                row.remove();
                await this.renderViewDashboard()

              }
            } catch (error) {
              console.error('Ocorreu um erro ao excluir o livro:', error);
            }
          });

          row.appendChild(name);
          row.appendChild(author);
          row.appendChild(description);
          row.appendChild(deleteCell);


          table.querySelector('tbody').appendChild(row);
        });
      })
      .catch(error => console.error(error));
  }

  async renderSelect() {
    try {
      const response = await fetch('http://localhost:3001/category', {
        method: 'GET',
        mode: 'cors'
      });
      const categories = await response.json();

      const select = document.getElementById("category_id");

      // Percorre todas as categorias e renderiza as mesmas
      for (const category of categories) {
        const option = document.createElement('option');
        option.value = category._id;
        option.text = category.name;
        select.appendChild(option);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async createContact () {
    const form = document.getElementById("contact-form");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = form.querySelector("#name").value;
      const email = form.querySelector("#email").value;
      const subject = form.querySelector("#subject").value;
      const message = form.querySelector("#message").value;

      // Pega os dados do formulario e manda para o servidor
      const requestBody = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      };

      fetch("http://localhost:3001/contact", requestBody)
      .then((response) => response.json())
      .then(data => {
        alert("Mensagem enviada com sucesso:", data);
        form.querySelector("#name").value = ""
        form.querySelector("#email").value = ""
        form.querySelector("#subject").value = ""
        form.querySelector("#message").value = ""
      })
      .catch((error) => {
        console.log(error);
        alert("Ocorreu um erro ao enviar sua mensagem:", error);
      });
    });
  }

  async renderContact() {
    const table = document.querySelector('#contact-table');
    await fetch('http://localhost:3001/contact')
      .then(response => response.json())
      .then(async data => {

        // Cria uma linha para cada contato
        data.forEach(contact => {
          const row = document.createElement('tr');
          const name = document.createElement('td');
          name.textContent = contact.name;
          const email = document.createElement('td');
          email.textContent = contact.email;
          const subject = document.createElement('td');
          subject.textContent = contact.subject;
          const message = document.createElement('td');
          message.textContent = contact.message;

          row.appendChild(name);
          row.appendChild(email);
          row.appendChild(subject);
          row.appendChild(message);


          table.querySelector('tbody').appendChild(row);
        });
      })
      .catch(error => console.error(error));
  }

  async createCategory () {
    const teste = await new Promise((resolve) => {
      const input = prompt('Nome da categoria que deseja adicionar')
      resolve(input)
    })

    const requestBody = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: teste
      })
    };

    fetch("http://localhost:3001/category", requestBody)
    .then((response) => response.json())
    .then(async (data) => {
      alert("Categoria criada com sucesso:", data);
      await this.renderViewDashboard()
    })
    .catch((error) => {
      alert("Ocorreu um erro ao criar a categoria:", error);
    });
  }
}