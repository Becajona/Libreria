document.addEventListener('DOMContentLoaded', () => {
    loadAutores();

    const agregarAutorForm = document.getElementById('agregarAutorForm');
    agregarAutorForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = {
            Nombre: document.getElementById('agregar-nombre').value,
            Apellido: document.getElementById('agregar-apellido').value
        };

        try {
            const response = await fetch('/api/autores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Error al agregar el autor.');
            }
            $('#agregarAutorModal').modal('hide');
            loadAutores(); // Recargar la lista de autores después de agregar uno
        } catch (error) {
            console.error('Error:', error);
        }
    });

    const editarAutorForm = document.getElementById('editarAutorForm');
    editarAutorForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const AutorID = document.getElementById('editar-autorID').value;
        const formData = {
            Nombre: document.getElementById('editar-nombre').value,
            Apellido: document.getElementById('editar-apellido').value
        };

        try {
            const response = await fetch(`/api/autores/${AutorID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Error al editar el autor.');
            }
            $('#editarAutorModal').modal('hide');
            loadAutores(); // Recargar la lista de autores después de editar uno
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

function showAddAutorModal() {
    $('#agregarAutorModal').modal('show');
    document.getElementById('agregarAutorForm').reset();
}

function showEditAutorModal(AutorID, Nombre, Apellido) {
    $('#editarAutorModal').modal('show');
    document.getElementById('editar-autorID').value = AutorID;
    document.getElementById('editar-nombre').value = Nombre;
    document.getElementById('editar-apellido').value = Apellido;
}

async function deleteAutor(AutorID) {
    if (confirm('¿Está seguro de que desea eliminar este autor?')) {
        try {
            const response = await fetch(`/api/autores/${AutorID}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el autor.');
            }
            loadAutores(); // Recargar la lista de autores después de eliminar uno
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

async function loadAutores() {
    try {
        const response = await fetch('/api/autores');
        if (!response.ok) {
            throw new Error('Error al obtener la lista de autores.');
        }
        const autores = await response.json();
        const autoresList = document.getElementById('autores-list');
        autoresList.innerHTML = '';
        for (const autor of autores) {
            try {
                const imageUrl = await searchAuthorImage(`${autor.Nombre} ${autor.Apellido}`);
                autoresList.innerHTML += `
                    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <div class="card">
                            <img src="${imageUrl}" class="card-img-top" alt="Imagen del autor">
                            <div class="card-body">
                                <h5 class="card-title">${autor.Nombre} ${autor.Apellido}</h5>
                                <p class="card-text">ID: ${autor.AutorID}</p>
                                <button class="btn btn-warning btn-sm" onclick="showEditAutorModal(${autor.AutorID}, '${autor.Nombre}', '${autor.Apellido}')">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteAutor(${autor.AutorID})">Eliminar</button>
                            </div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Error al cargar la imagen del autor:', error);
            }
        }
    } catch (error) {
        console.error('Error cargando autores:', error);
    }
}

async function searchAuthorImage(authorName) {
    const customSearchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(authorName)}&cx=371efca1b815e4096&key=AIzaSyDn7KHmvOOvVDxMCYnoeV4N-oOrPF-7QeQ&searchType=image`;

    try {
        const response = await fetch(customSearchUrl);
        if (!response.ok) {
            throw new Error('Error al realizar la búsqueda.');
        }
        const data = await response.json();
        if (!data.items || data.items.length === 0) {
            throw new Error('No se encontraron imágenes.');
        }
        // Obtener la URL de la primera imagen encontrada
        return data.items[0].link;
    } catch (error) {
        console.error('Error al buscar la imagen del autor:', error);
        return 'https://placehold.it/200x200'; // Imagen de relleno si no se encuentra una imagen
    }
}

