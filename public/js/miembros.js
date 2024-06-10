async function loadMiembros() {
    const response = await fetch('/api/members');
    const miembros = await response.json();
    const miembrosList = document.getElementById('miembros-list');
    miembrosList.innerHTML = '';
    miembros.forEach(miembro => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
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
    fetch(`/api/members/${miembroID}`)
        .then(response => response.json())
        .then(miembro => {
            document.getElementById('editarMiembroId').value = miembro.MiembroID;
            document.getElementById('editarNombre').value = miembro.Nombre;
            document.getElementById('editarApellido').value = miembro.Apellido;
            document.getElementById('editarEmail').value = miembro.Email;
            document.getElementById('editarFechaRegistro').value = miembro.FechaRegistro;
            $('#editarMiembroModal').modal('show');
        })
        .catch(error => {
            console.error('Error al cargar el miembro:', error);
            alert('Error al cargar el miembro');
        });
}

async function deleteMiembro(miembroID) {
    if (confirm('¿Estás seguro de que quieres eliminar este miembro?')) {
        try {
            const response = await fetch(`/api/members/${miembroID}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadMiembros(); 
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
    
    const nuevoMiembroForm = document.getElementById('nuevoMiembroForm');
    nuevoMiembroForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('email').value;
        const fechaRegistro = document.getElementById('fecharegistro').value;

        const nuevoMiembro = {
            Nombre: nombre,
            Apellido: apellido,
            Email: email,
            FechaRegistro: fechaRegistro
        };

        try {
            const response = await fetch('/api/members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoMiembro)
            });

            if (response.ok) {
                $('#nuevoMiembroModal').modal('hide');
                nuevoMiembroForm.reset();
                loadMiembros();
            } else {
                console.error('Error al agregar el nuevo miembro');
                alert('Error al agregar el nuevo miembro');
            }
        } catch (error) {
            console.error('Error al agregar el nuevo miembro:', error);
            alert('Error al agregar el nuevo miembro');
        }
    });
});
