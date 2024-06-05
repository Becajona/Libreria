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




// encabezado
function loadContent(url, elementId) {
  fetch(url)
      .then(response => response.text())
      .then(data => {
          document.getElementById(elementId).innerHTML = data;
      })
      .catch(error => console.error('Error loading content:', error));
}

document.addEventListener('DOMContentLoaded', () => {
  loadContent('/templates/cabecera.html', 'header');
  loadContent('/templates/pie.html', 'footer');
});




//carrusel libro 
let currentBookSlide = 0;

function showBookSlide(index) {
    const slides = document.querySelectorAll('.book-slide');
    const totalSlides = slides.length;
    const slidesToShow = 3; // Cambia este valor para ajustar cuántos libros se muestran a la vez
    const maxIndex = totalSlides - slidesToShow;

    if (index > maxIndex) {
        currentBookSlide = 0;
    } else if (index < 0) {
        currentBookSlide = maxIndex;
    } else {
        currentBookSlide = index;
    }
    
    const offset = -currentBookSlide * 100 / slidesToShow;
    document.querySelector('.book-carousel-container').style.transform = `translateX(${offset}%)`;
}

function moveBookSlide(direction) {
    showBookSlide(currentBookSlide + direction);
}

// Auto play book slides
setInterval(() => {
    moveBookSlide(1);
}, 5000);
