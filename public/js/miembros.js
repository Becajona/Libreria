// js/miembros.js

async function loadMiembros() {
    const response = await fetch('/api/members');
    const miembros = await response.json();
    const miembrosList = document.getElementById('miembros-list');
    miembrosList.innerHTML = '';
    miembros.forEach(miembro => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${miembro.MiembroID}</td>
            <td>${miembro.Nombre}</td>
            <td>${miembro.Apellido}</td>
            <td>${miembro.Email}</td>
            <td>${miembro.FechaRegistro}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editMiembro(${miembro.MiembroID})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteMiembro(${miembro.MiembroID})">Eliminar</button>
            </td>
        `;
        miembrosList.appendChild(tr);
    });
}

function editMiembro(miembroID) {
    // Aquí va la lógica para editar el miembro con el ID proporcionado
    console.log(`Editando miembro con ID: ${miembroID}`);
}

async function deleteMiembro(miembroID) {
    if (confirm('¿Estás seguro de que quieres eliminar este miembro?')) {
        try {
            const response = await fetch(`/api/members/${miembroID}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadMiembros(); // Recargar la lista de miembros después de eliminar
            } else {
                console.error('Error al eliminar el miembro');
                alert('Error al eliminar el miembro');
            }
        } catch (error) {
            console.error('Error al eliminar el miembro:', error);
            alert('Error al eliminar el miembro');
        }
    }
}



document.addEventListener('DOMContentLoaded', () => {
    loadMiembros();
});
