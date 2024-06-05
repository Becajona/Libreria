async function loadReseñas() {
    const response = await fetch('/api/reviews');
    const reseñas = await response.json();
    const reseñasList = document.getElementById('reseñas-list');
    reseñasList.innerHTML = '';
    reseñas.forEach(reseña => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reseña.ReseñaID}</td>
            <td>${reseña.LibroID}</td>
            <td>${reseña.MiembroID}</td>
            <td>${reseña.Calificación}</td>
            <td>${reseña.Comentario}</td>
            <td>${reseña.Fecha}</td>
        `;
        reseñasList.appendChild(row);
    }); 
}

document.addEventListener('DOMContentLoaded', () => {
    loadReseñas();
});