async function loadAutores() {
    const response = await fetch('/api/autores');
    if (response.ok) {
        const autores = await response.json();
        const autoresList = document.getElementById('autores-list');
        autoresList.innerHTML = '';
        autores.forEach(autor => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${autor.AutorID}</td>
                <td>${autor.Nombre}</td>
                <td>${autor.Apellido}</td>
            `;
            autoresList.appendChild(tr);
        });
    } else {
        console.error('Error al obtener la lista de autores.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAutores();

    const autorForm = document.getElementById('autorForm');
    autorForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(autorForm);
        try {
            const response = await fetch('/api/autores', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Error al agregar el autor.');
            }
            loadAutores(); // Recargar la lista de autores después de agregar uno nuevo
            autorForm.reset(); // Limpiar el formulario después de la inserción
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
