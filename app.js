// =========================================
// === Lógica de UI (Botones de Destino) ===
// =========================================
document.querySelectorAll('.destination-card').forEach(btn => {
  btn.addEventListener('click', () => {
    // 1. Obtiene el nombre del destino de la tarjeta
    const destino = btn.getAttribute('data-destino');
    const destinoInput = document.getElementById('destino');
    
    // 2. Lo pone en el campo "Destino" del formulario
    if (destinoInput && destino) {
      destinoInput.value = destino;
    }
    
    // 3. Baja suavemente hasta el formulario
    document.getElementById('form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
