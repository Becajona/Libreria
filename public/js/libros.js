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
      document.getElementById('book-form').reset();
    }
  });
  
  document.getElementById('edit-book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const LibroID = document.getElementById('LibroID').value;
    const Titulo = document.getElementById('edit-Titulo').value;
    const AutorID = document.getElementById('edit-AutorID').value;
    const Genero = document.getElementById('edit-Genero').value;
    const FechaPublicacion = document.getElementById('edit-FechaPublicacion').value;
  
    const response = await fetch(`/api/libros/${LibroID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Titulo, AutorID, Genero, FechaPublicacion })
    });
  
    if (response.ok) {
      loadBooks();
      document.getElementById('edit-book-form').reset();
      var modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
      modal.hide();
    }
  });
  
  async function loadBooks() {
    const response = await fetch('/api/libros');
    const books = await response.json();
    const booksList = document.getElementById('books-list');
    booksList.innerHTML = '';
    books.forEach(book => {
      const li = document.createElement('li');
      li.innerHTML = `${book.Titulo} by Author ID: ${book.AutorID} 
                      <button onclick="editBook(${book.LibroID})">Editar</button>
                      <button onclick="deleteBook(${book.LibroID})">Eliminar</button>`;
      booksList.appendChild(li);
    });
  }
  
  async function editBook(libroID) {
    const response = await fetch(`/api/libros/${libroID}`);
    if (response.ok) {
      const book = await response.json();
      document.getElementById('LibroID').value = book.LibroID;
      document.getElementById('edit-Titulo').value = book.Titulo;
      document.getElementById('edit-AutorID').value = book.AutorID;
      document.getElementById('edit-Genero').value = book.Genero;
  
      // Convertir la fecha a formato YYYY-MM-DD
      const fecha = new Date(book.FechaPublicacion);
      const formattedDate = fecha.toISOString().split('T')[0];
      document.getElementById('edit-FechaPublicacion').value = formattedDate;
  
      var editModal = new bootstrap.Modal(document.getElementById('editModal'));
      editModal.show();
    } else {
      console.error('Error al cargar el libro para editar');
      alert('Error al cargar el libro para editar');
    }
  }
  
  async function deleteBook(libroID) {
    if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      try {
        const response = await fetch(`/api/libros/${libroID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          loadBooks(); 
        } else {
          console.error('Error al eliminar el libro');
          alert('Error al eliminar el libro');
        }
      } catch (error) {
        console.error('Error al eliminar el libro:', error);
        alert('Error al eliminar el libro');
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', loadBooks);
  