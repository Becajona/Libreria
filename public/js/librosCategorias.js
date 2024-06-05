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
  // Lógica para editar la entrada
  console.log(`Editando LibroID: ${libroID}, CategoriaID: ${categoriaID}`);
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

document.addEventListener('DOMContentLoaded', () => {
  loadLibroCategorias();
});