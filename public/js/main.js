

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
