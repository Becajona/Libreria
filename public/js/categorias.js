async function loadCategorias() {
    const response = await fetch('/api/categorias');
    const categorias = await response.json();
    const categoriasList = document.getElementById('categorias-list');
    categoriasList.innerHTML = '';
    categorias.forEach(categoria => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${categoria.CategoriaID}</td>
            <td>${categoria.Nombre}</td>
            <td>${categoria.Descripcion}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="showEditCategoriaModal(${categoria.CategoriaID}, '${categoria.Nombre}', '${categoria.Descripcion}')">Editar</button>
            </td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteCategoria(${categoria.CategoriaID})">Eliminar</button>
            </td>
        `;
        categoriasList.appendChild(tr);
    });
}

async function deleteCategoria(categoriaID) {
    try {
        const response = await fetch(`/api/categorias/${categoriaID}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            loadCategorias();
        } else {
            console.error('Error al eliminar la categoría');
        }
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
    }
}

function showAddCategoriaModal() {
    document.getElementById('categoriaModalLabel').textContent = 'Agregar Categoría';
    document.getElementById('categoriaForm').reset();
    document.getElementById('categoriaForm').dataset.categoriaId = '';
    $('#categoriaModal').modal('show');
}

function showEditCategoriaModal(categoriaID, nombre, descripcion) {
    document.getElementById('categoriaModalLabel').textContent = 'Editar Categoría';
    document.getElementById('nombre').value = nombre;
    document.getElementById('descripcion').value = descripcion;
    document.getElementById('categoriaForm').dataset.categoriaId = categoriaID;
    $('#categoriaModal').modal('show');
}

document.getElementById('categoriaForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const categoriaID = event.target.dataset.categoriaId;
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;

    const method = categoriaID ? 'PUT' : 'POST';
    const url = categoriaID ? `/api/categorias/${categoriaID}` : '/api/categorias';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, descripcion })
        });
        if (response.ok) {
            loadCategorias();
            $('#categoriaModal').modal('hide');
        } else {
            console.error(`Error al ${categoriaID ? 'editar' : 'agregar'} la categoría`);
        }
    } catch (error) {
        console.error(`Error al ${categoriaID ? 'editar' : 'agregar'} la categoría:`, error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadCategorias();
});