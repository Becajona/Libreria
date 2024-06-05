async function loadPrestamos() {
    const response = await fetch('/api/loans');
    const prestamos = await response.json();
    const prestamosList = document.getElementById('prestamos-list');
    prestamosList.innerHTML = '';
    prestamos.forEach(prestamo => {
        const li = document.createElement('li');
        li.textContent = `Préstamo ID: ${prestamo.PrestamoID}, Miembro ID: ${prestamo.MiembroID}, Fecha Préstamo: ${prestamo.FechaPrestamo}, Fecha Devolución: ${prestamo.FechaDevolucion}, Estado: ${prestamo.Estado}`;
        prestamosList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadPrestamos();
});


