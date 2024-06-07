
async function loadEditoriales() {
    const response = await fetch('/api/editoriales');
    const editoriales = await response.json();
    const editorialesList = document.getElementById('editoriales-list');
    editorialesList.innerHTML = '';
    editoriales.forEach(editorial => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${editorial.EditorialID}</td>
            <td>${editorial.Nombre}</td>
            <td>${editorial.Pais}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="showEditEditorialModal(${editorial.EditorialID}, '${editorial.Nombre}', '${editorial.Pais}')">Editar</button>
            </td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteEditorial(${editorial.EditorialID})">Eliminar</button>
            </td>
        `;
        editorialesList.appendChild(tr);
    });
}

async function deleteEditorial(editorialID) {
    try {
        const response = await fetch(`/api/editoriales/${editorialID}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            loadEditoriales();
        } else {
            console.error('Error al eliminar la editorial');
        }
    } catch (error) {
        console.error('Error al eliminar la editorial:', error);
    }
}

function showAddEditorialModal() {
    document.getElementById('editorialModalLabel').textContent = 'Agregar Editorial';
    document.getElementById('editorialForm').reset();
    document.getElementById('editorialForm').dataset.editorialId = '';
    $('#editorialModal').modal('show');
}

function showEditEditorialModal(editorialID, nombre, pais) {
    document.getElementById('editorialModalLabel').textContent = 'Editar Editorial';
    document.getElementById('nombre').value = nombre;
    document.getElementById('pais').value = pais;
    document.getElementById('editorialForm').dataset.editorialId = editorialID;
    $('#editorialModal').modal('show');
}

document.getElementById('editorialForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const editorialID = event.target.dataset.editorialId;
    const nombre = document.getElementById('nombre').value;
    const pais = document.getElementById('pais').value;

    const method = editorialID ? 'PUT' : 'POST';
    const url = editorialID ? `/api/editoriales/${editorialID}` : '/api/editoriales';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, pais })
        });
        if (response.ok) {
            loadEditoriales();
            $('#editorialModal').modal('hide');
        } else {
            console.error(`Error al ${editorialID ? 'editar' : 'agregar'} la editorial`);
        }
    } catch (error) {
        console.error(`Error al ${editorialID ? 'editar' : 'agregar'} la editorial:`, error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadEditoriales();
});
