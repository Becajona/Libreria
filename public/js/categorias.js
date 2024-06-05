async function loadCategorias() {
    const response = await fetch('/api/categorias');
    const categorias = await response.json();
    const categoriasList = document.getElementById('categorias-list');
    categoriasList.innerHTML = '';
    categorias.forEach(categoria => {
        const li = document.createElement('li');
        li.textContent = `Categoría ID: ${categoria.CategoriaID}, Nombre: ${categoria.Nombre}, Descripción: ${categoria.Descripcion}`;
        categoriasList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCategorias();
});
