async function loadMiembros() {
    const response = await fetch('/api/members');
    const miembros = await response.json();
    const miembrosList = document.getElementById('miembros-list');
    miembrosList.innerHTML = '';
    miembros.forEach(miembro => {
        const li = document.createElement('li');
        li.textContent = `${miembro.Nombre} ${miembro.Apellido} (ID: ${miembro.MiembroID})`;
        miembrosList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadMiembros();
});
