async function loadReseñas() {
    const response = await fetch('/api/reviews');
    const reseñas = await response.json();
    const reseñasList = document.getElementById('reseñas-list');
    reseñasList.innerHTML = '';
    reseñas.forEach(reseña => {
        const li = document.createElement('li');
        li.textContent = `Reseña ID: ${reseña.ReseñaID}, Libro ID: ${reseña.LibroID}, Miembro ID: ${reseña.MiembroID}, Calificación: ${reseña.Calificación}, Comentario: ${reseña.Comentario}, Fecha: ${reseña.Fecha}`;
        reseñasList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadReseñas();
});
