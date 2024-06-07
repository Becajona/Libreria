async function loadPrestamos() {
    console.log('Loading prestamos...');
    try {
        const response = await fetch('/api/prestamos');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const prestamos = await response.json();
        console.log('Prestamos data:', prestamos);
        const prestamosList = document.getElementById('prestamos-list');
        prestamosList.innerHTML = '';
        prestamos.forEach(prestamo => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${prestamo.PrestamoID}</td>
                <td>${prestamo.Miembro}</td>
                <td>${prestamo.Libro}</td>
                <td>${prestamo.FechaPrestamo}</td>
                <td>${prestamo.FechaDevolucion}</td>
                <td>${prestamo.Estado}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editPrestamo(${prestamo.PrestamoID})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePrestamo(${prestamo.PrestamoID})">Eliminar</button>
                </td>
            `;
            prestamosList.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching prestamos:', error);
    }
}

async function deletePrestamo(prestamoID) {
    try {
        const response = await fetch(`/api/prestamos/${prestamoID}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            loadPrestamos();
        } else {
            console.error('Error al eliminar el préstamo');
        }
    } catch (error) {
        console.error('Error al eliminar el préstamo:', error);
    }
}

function editPrestamo(prestamoID) {
    // Lógica para editar el préstamo
    console.log(`Editando préstamo con ID: ${prestamoID}`);
}

document.addEventListener('DOMContentLoaded', () => {
    loadPrestamos();

    document.getElementById('nuevoPrestamoForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const miembroID = document.getElementById('miembroID').value;
        const libroID = document.getElementById('libroID').value;
        const fechaPrestamo = document.getElementById('fechaPrestamo').value;
        const fechaDevolucion = document.getElementById('fechaDevolucion').value;
        const estado = document.getElementById('estado').value;

        try {
            const response = await fetch('/api/prestamos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ miembroID, libroID, fechaPrestamo, fechaDevolucion, estado })
            });
            if (response.ok) {
                loadPrestamos();
                $('#nuevoPrestamoModal').modal('hide');
            } else {
                console.error('Error al agregar el préstamo');
            }
        } catch (error) {
            console.error('Error al agregar el préstamo:', error);
        }
    });
});
