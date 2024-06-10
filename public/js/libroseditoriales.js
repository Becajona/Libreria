async function loadLibrosEditoriales() {
    const response = await fetch('/api/libroseditoriales');
    const libroseditoriales = await response.json();
    const libroseditorialesList = document.getElementById('libroseditoriales-list');
    libroseditorialesList.innerHTML = '';
    libroseditoriales.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${entry.TituloLibro}</td>
            <td>${entry.NombreEditorial}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editEntry('${entry.TituloLibro}', '${entry.NombreEditorial}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEntry('${entry.TituloLibro}', '${entry.NombreEditorial}')">Eliminar</button>
            </td>
        `;
        libroseditorialesList.appendChild(tr);
    });
}

function editEntry(libroTitulo, editorialNombre) {
    // Lógica para editar la entrada
    console.log(`Editando TituloLibro: ${libroTitulo}, NombreEditorial: ${editorialNombre}`);
}

function deleteEntry(libroTitulo, editorialNombre) {
    // Lógica para eliminar la entrada
    console.log(`Eliminando TituloLibro: ${libroTitulo}, NombreEditorial: ${editorialNombre}`);
}

document.addEventListener('DOMContentLoaded', () => {
    loadLibrosEditoriales();
});
