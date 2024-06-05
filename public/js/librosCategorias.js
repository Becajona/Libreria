    let currentLibroID;
    let currentCategoriaID;

    async function loadLibroCategorias() {
      const response = await fetch('/api/librocategorias');
      const librocategorias = await response.json();
      const librocategoriasList = document.getElementById('librocategorias-list');
      librocategoriasList.innerHTML = '';
      librocategorias.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${entry.LibroID}</td>
          <td>${entry.CategoriaID}</td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="editEntry(${entry.LibroID}, ${entry.CategoriaID})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteEntry(${entry.LibroID}, ${entry.CategoriaID})">Eliminar</button>
          </td>
        `;
        librocategoriasList.appendChild(tr);
      });
    }

    function editEntry(libroID, categoriaID) {
      currentLibroID = libroID;
      currentCategoriaID = categoriaID;
      document.getElementById('editLibroID').value = libroID;
      document.getElementById('editCategoriaID').value = categoriaID;
      const editModal = new bootstrap.Modal(document.getElementById('editModal'));
      editModal.show();
    }

    async function deleteEntry(libroID, categoriaID) {
      if (confirm(`¿Está seguro que desea eliminar la entrada LibroID: ${libroID}, CategoriaID: ${categoriaID}?`)) {
        const response = await fetch(`/api/librocategorias/${libroID}/${categoriaID}`, {
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
      const nuevoLibroID = document.getElementById('editLibroID').value;
      const nuevaCategoriaID = document.getElementById('editCategoriaID').value;

      const response = await fetch(`/api/librocategorias/${currentLibroID}/${currentCategoriaID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nuevoLibroID, nuevaCategoriaID })
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