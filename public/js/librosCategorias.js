async function loadLibroCategorias() {
  const response = await fetch('/api/librocategorias');
  const librocategorias = await response.json();
  const librocategoriasList = document.getElementById('librocategorias-list');
  librocategoriasList.innerHTML = '';
  librocategorias.forEach(entry => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${entry.TituloLibro}</td>
        <td>${entry.NombreCategoria}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="editEntry('${entry.TituloLibro}', '${entry.NombreCategoria}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteEntry('${entry.TituloLibro}', '${entry.NombreCategoria}')">Eliminar</button>
        </td>
      `;
      librocategoriasList.appendChild(tr);
  });
}

function editEntry(libroTitulo, categoriaNombre) {
  document.getElementById('editLibroID').value = libroTitulo;
  document.getElementById('editCategoriaID').value = categoriaNombre;
  const editModal = new bootstrap.Modal(document.getElementById('editModal'));
  editModal.show();
}

async function deleteEntry(libroTitulo, categoriaNombre) {
  if (confirm(`¿Está seguro que desea eliminar la entrada Libro: ${libroTitulo}, Categoría: ${categoriaNombre}?`)) {
      const response = await fetch(`/api/librocategorias/${libroTitulo}/${categoriaNombre}`, {
          method: 'DELETE'
      });

      if (response.ok) {
          loadLibroCategorias();
      } else {
          console.error('Error eliminando la entrada');
      }
  }
}

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nuevoLibroTitulo = document.getElementById('editLibroID').value;
  const nuevaCategoriaNombre = document.getElementById('editCategoriaID').value;

  const response = await fetch(`/api/librocategorias/${nuevoLibroTitulo}/${nuevaCategoriaNombre}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nuevoLibroTitulo, nuevaCategoriaNombre })
  });

  if (response.ok) {
      loadLibroCategorias();
      const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
      editModal.hide();
  } else {
      console.error('Error actualizando la entrada');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadLibroCategorias();
});
  