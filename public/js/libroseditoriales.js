async function loadLibrosEditoriales() {
    const response = await fetch('/api/libroseditoriales');
    const libroseditoriales = await response.json();
    const libroseditorialesList = document.getElementById('libroseditoriales-list');
    libroseditorialesList.innerHTML = '';
    libroseditoriales.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${entry.LibroID}</td>
            <td>${entry.EditorialID}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editEntry(${entry.LibroID}, ${entry.EditorialID})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEntry(${entry.LibroID}, ${entry.EditorialID})">Eliminar</button>
            </td>
        `;
        libroseditorialesList.appendChild(tr);
    });
}

function editEntry(libroID, editorialID) {
    // Lógica para editar la entrada
    console.log(`Editando LibroID: ${libroID}, EditorialID: ${editorialID}`);
}

function deleteEntry(libroID, editorialID) {
    // Lógica para eliminar la entrada
    console.log(`Eliminando LibroID: ${libroID}, EditorialID: ${editorialID}`);
}

document.addEventListener('DOMContentLoaded', () => {
    loadLibrosEditoriales();
});
