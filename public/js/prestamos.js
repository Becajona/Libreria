
async function loadPrestamos() {
    const response = await fetch('/api/loans');
    const prestamos = await response.json();
    const prestamosList = document.getElementById('prestamos-list');
    prestamosList.innerHTML = '';
    prestamos.forEach(prestamo => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${prestamo.PrestamoID}</td>
            <td>${prestamo.MiembroID}</td>
            <td>${prestamo.FechaPrestamo}</td>
            <td>${prestamo.FechaDevolucion}</td>
            <td>${prestamo.Estado}</td>
            <td>
              <button class="btn btn-primary btn-sm" onclick="editEntry(${prestamo.PrestamoID})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="deleteEntry(${prestamo.PrestamoID})">Eliminar</button>
            </td>
        `;
        prestamosList.appendChild(tr);
    });
}

function editEntry(prestamoID) {
  // Lógica para editar la entrada
  console.log(`Editando PréstamoID: ${prestamoID}`);
}

async function deleteEntry(prestamoID) {
    const response = await fetch(`/api/loans/${prestamoID}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        loadPrestamos();
    } else {
        console.error('Error al eliminar el préstamo');
    }
}



document.addEventListener('DOMContentLoaded', () => {
    loadPrestamos();
});
