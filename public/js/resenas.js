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
            <td>
                <button class="btn btn-primary btn-sm" onclick="showEditReseñaModal(${reseña.ReseñaID}, ${reseña.LibroID}, ${reseña.MiembroID}, ${reseña.Calificación}, '${reseña.Comentario}', '${reseña.Fecha}')">Editar</button>
            </td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteReseña(${reseña.ReseñaID})">Eliminar</button>
            </td>
        `;
        reseñasList.appendChild(row);
    });
}

async function deleteReseña(reseñaID) {
    try {
        const response = await fetch(`/api/reviews/${reseñaID}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            loadReseñas();
        } else {
            console.error('Error al eliminar la reseña');
        }
    } catch (error) {
        console.error('Error al eliminar la reseña:', error);
    }
}

function showAddReseñaModal() {
    document.getElementById('reseñaModalLabel').textContent = 'Agregar Reseña';
    document.getElementById('reseñaForm').reset();
    document.getElementById('reseñaForm').dataset.reseñaId = '';
    $('#reseñaModal').modal('show');
}

function showEditReseñaModal(reseñaID, libroID, miembroID, calificación, comentario, fecha) {
    document.getElementById('reseñaModalLabel').textContent = 'Editar Reseña';
    document.getElementById('libroID').value = libroID;
    document.getElementById('miembroID').value = miembroID;
    document.getElementById('calificación').value = calificación;
    document.getElementById('comentario').value = comentario;
    document.getElementById('fecha').value = fecha;
    document.getElementById('reseñaForm').dataset.reseñaId = reseñaID;
    $('#reseñaModal').modal('show');
}

document.getElementById('reseñaForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const reseñaID = event.target.dataset.reseñaId;
    const libroID = document.getElementById('libroID').value;
    const miembroID = document.getElementById('miembroID').value;
    const calificación = document.getElementById('calificación').value;
    const comentario = document.getElementById('comentario').value;
    const fecha = document.getElementById('fecha').value;

    const method = reseñaID ? 'PUT' : 'POST';
    const url = reseñaID ? `/api/reviews/${reseñaID}` : '/api/reviews';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ libroID, miembroID, calificación, comentario, fecha })
        });
        if (response.ok) {
            loadReseñas();
            $('#reseñaModal').modal('hide');
        } else {
            console.error(`Error al ${reseñaID ? 'editar' : 'agregar'} la reseña`);
        }
    } catch (error) {
        console.error(`Error al ${reseñaID ? 'editar' : 'agregar'} la reseña:`, error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadReseñas();
});
