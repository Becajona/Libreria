async function loadAutores() {
    const response = await fetch('/api/autores');
    if (response.ok) {
        const autores = await response.json();
        const autoresList = document.getElementById('autores-list');
        autoresList.innerHTML = '';
        autores.forEach(autor => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${autor.AutorID}</td>
                <td>${autor.Nombre}</td>
                <td>${autor.Apellido}</td>
                <td><button class="btn btn-primary btn-sm" onclick="showEditAutorModal(${autor.AutorID}, '${autor.Nombre}', '${autor.Apellido}')">Editar</button></td>
                <td><button class="btn btn-danger" onclick="deleteAutor(${autor.AutorID})">Eliminar</button></td>
            `;
            autoresList.appendChild(tr);
        });
    } else {
        console.error('Error al obtener la lista de autores.');
    }
}

function showAddAutorModal() {
    $('#autorModal').modal('show');
    document.getElementById('autorForm').reset();
    document.getElementById('edit-autorID').value = '';
    document.getElementById('autorID').disabled = false;
    document.getElementById('autorModalLabel').textContent = 'Agregar Autor';
}

function showEditAutorModal(AutorID, Nombre, Apellido) {
    $('#autorModal').modal('show');
    document.getElementById('edit-autorID').value = AutorID;
    document.getElementById('autorID').value = AutorID;
    document.getElementById('autorID').disabled = true;
    document.getElementById('nombre').value = Nombre;
    document.getElementById('apellido').value = Apellido;
    document.getElementById('autorModalLabel').textContent = 'Editar Autor';
}

async function deleteAutor(AutorID) {
    if (confirm('¿Está seguro de que desea eliminar este autor?')) {
        try {
            const response = await fetch(`/api/autores/${AutorID}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el autor.');
            }
            loadAutores(); // Recargar la lista de autores después de eliminar uno
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAutores();

    const autorForm = document.getElementById('autorForm');
    autorForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const editAutorID = document.getElementById('edit-autorID').value;
        const formData = {
            AutorID: document.getElementById('autorID').value,
            Nombre: document.getElementById('nombre').value,
            Apellido: document.getElementById('apellido').value
        };

        try {
            const response = await fetch(`/api/autores${editAutorID ? `/${editAutorID}` : ''}`, {
                method: editAutorID ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error(`Error al ${editAutorID ? 'editar' : 'agregar'} el autor.`);
            }
            $('#autorModal').modal('hide');
            loadAutores(); // Recargar la lista de autores después de agregar o editar uno
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
