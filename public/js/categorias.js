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
        `;
        categoriasList.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCategorias();
});
