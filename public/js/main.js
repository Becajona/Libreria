document.getElementById('book-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const Titulo = document.getElementById('Titulo').value;
  const AutorID = document.getElementById('AutorID').value;
  const Genero = document.getElementById('Genero').value;
  const FechaPublicacion = document.getElementById('FechaPublicacion').value;

  const response = await fetch('/api/libros', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ Titulo, AutorID, Genero, FechaPublicacion })
  });

  if (response.ok) {
    loadBooks();
  }
});

async function loadBooks() {
  const response = await fetch('/api/libros');
  const books = await response.json();
  const booksList = document.getElementById('books-list');
  booksList.innerHTML = '';
  books.forEach(book => {
    const li = document.createElement('li');
    li.textContent = `${book.Titulo} by Author ID: ${book.AutorID}`;
    booksList.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', loadBooks);


