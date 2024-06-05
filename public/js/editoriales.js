async function loadEditoriales() {
    const response = await fetch('/api/editoriales');
    const editoriales = await response.json();
    const editorialesList = document.getElementById('editoriales-list');
    editorialesList.innerHTML = '';
    editoriales.forEach(editorial => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${editorial.EditorialID}</td>
            <td>${editorial.Nombre}</td>
            <td>${editorial.Pais}</td>
        `;
        editorialesList.appendChild(row);
    }); 
}

document.addEventListener('DOMContentLoaded', () => {
    loadEditoriales();
});
