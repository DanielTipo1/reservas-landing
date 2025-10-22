// === Configuración ===
// Reemplaza con tu número WhatsApp (código país + número, sin + ni espacios)
const WHATSAPP_NUMBER = "34675570566"; // ¡¡RECUERDA CAMBIAR ESTE NÚMERO!!

// === Utilidades ===
const todayISO = new Date().toISOString().split('T')[0];

function setMinToday(selector){
  document.querySelectorAll(selector).forEach(el => el.setAttribute('min', todayISO));
}

function openWhatsAppFromPayload(title, kvPairs){
  const lines = kvPairs.map(([k,v]) => `${k}: ${v && String(v).trim() ? String(v).trim() : '-'}`).join('%0A');
  const txt = `${encodeURIComponent(title)}%0A${lines}`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${txt}`;
  window.open(url, '_blank');
}

// === Lógica de UI (Botones de Servicio) ===
document.querySelectorAll('.service-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const v = btn.getAttribute('data-service');
    const map = {vuelos:'Vuelos', paquetes:'Paquetes', hoteles:'Hoteles', autos:'Autos'};
    const sel = document.getElementById('servicio');
    if (sel) sel.value = map[v] || 'Vuelos';
    
    // Enfoca el primer campo del formulario en lugar de solo hacer scroll
    document.getElementById('nombre')?.focus();
  });
});

// === Lógica de Formulario (Cálculo de Días) ===
const fechaIdaEl = document.getElementById('fechaIda');
const fechaVueltaEl = document.getElementById('fechaVuelta');
const diasNochesEl = document.getElementById('diasNoches');

function calcularEstadia() {
  const d1 = fechaIdaEl.value;
  const d2 = fechaVueltaEl.value;

  if (d1 && d2) {
    const date1 = new Date(d1);
    const date2 = new Date(d2);

    if (date2 < date1) {
      diasNochesEl.value = 'Error: Regreso antes de la ida';
      diasNochesEl.style.color = 'red';
      return;
    }
    
    // Diferencia en milisegundos
    const diffTime = Math.abs(date2 - date1);
    // Diferencia en días (ceil para redondear hacia arriba)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const noches = diffDays;
    const dias = noches + 1;

    diasNochesEl.value = `${dias} Días / ${noches} Noches`;
    diasNochesEl.style.color = 'var(--muted)';
  } else {
    diasNochesEl.value = 'Se calcula automáticamente';
    diasNochesEl.style.color = 'var(--muted)';
  }
}

// Añadimos los 'listeners' a los campos de fecha
fechaIdaEl?.addEventListener('change', calcularEstadia);
fechaVueltaEl?.addEventListener('change', calcularEstadia);


// === Lógica de Formulario (Envío a WhatsApp) ===
document.getElementById('bookingForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const d = id => document.getElementById(id)?.value?.trim() || '';

  // Validación de fechas
  if (d('fechaVuelta') && d('fechaIda') && d('fechaVuelta') < d('fechaIda')){
    alert('La fecha de regreso no puede ser anterior a la ida.');
    return;
  }
  
  // Recogemos todos los nuevos valores
  const kv = [
    ['Nombre', d('nombre')],
    ['WhatsApp', d('telefono')],
    ['Email', d('email')],
    ['Servicio', d('servicio')],
    ['Destino', d('destino')],
    ['Origen', d('origen')],
    ['Adultos', d('adultos')],
    ['Niños', d('ninos')],
    ['Fecha ida', d('fechaIda')],
    ['Fecha regreso', d('fechaVuelta')],
    ['Estadía', d('diasNoches')],
    ['Especificaciones', d('notas')]
  ];
  
  openWhatsAppFromPayload('Nueva Cotización de Viaje', kv);
});

// === Año footer ===
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// === Fechas mínimas (al final para asegurar que todo cargó) ===
setMinToday('#fechaIda, #fechaVuelta');
