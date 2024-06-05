async function loadPrestamos() {
    console.log('Loading prestamos...');
    try {
        const response = await fetch('/api/prestamos');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const prestamos = await response.json();
        console.log('Prestamos data:', prestamos); // Log the data for debugging
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
            `;
            prestamosList.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching prestamos:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPrestamos();
});
