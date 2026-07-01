// ARENA SQUAD - CALENDAR UI
// Interface do usuário e interações

const { Reservations, SLOTS, formatDate, formatDateBR } = window.ReservationSystem;

// ========================================
// STATE
// ========================================
let currentDate = new Date();
let selectedDate = null;
let selectedSlot = null;

// ========================================
// CALENDAR RENDERING
// ========================================
function renderCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const firstDayOfWeek = firstDay.getDay();
  const prevMonthDays = prevLastDay.getDate();

  // Sync selectors with current date
  document.getElementById('monthSelector').value = month;
  document.getElementById('yearSelector').value = year;

  const calendarDays = document.getElementById('calendarDays');
  calendarDays.innerHTML = '';

  const today = new Date();
  const todayStr = formatDate(today);

  // Previous month days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const dayElement = createDayElement(day, 'other-month');
    calendarDays.appendChild(dayElement);
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = formatDate(date);
    const status = Reservations.getDateStatus(dateStr);

    const dayElement = createDayElement(day, status);

    if (dateStr === todayStr) {
      dayElement.classList.add('today');
    }

    dayElement.addEventListener('click', () => handleDayClick(dateStr));
    calendarDays.appendChild(dayElement);
  }

  // Next month days
  const totalCells = calendarDays.children.length;
  const remainingCells = (7 - (totalCells % 7)) % 7;
  for (let day = 1; day <= remainingCells; day++) {
    const dayElement = createDayElement(day, 'other-month');
    calendarDays.appendChild(dayElement);
  }
}

function createDayElement(day, status) {
  const dayElement = document.createElement('div');
  dayElement.className = `calendar-day ${status}`;
  dayElement.innerHTML = `
    <span class="calendar-day-number">${day}</span>
    ${status !== 'other-month' ? '<span class="calendar-day-status"></span>' : ''}
  `;
  return dayElement;
}

// ========================================
// NAVIGATION
// ========================================
document.getElementById('prevMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

document.getElementById('nextMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

// ========================================
// DAY CLICK
// ========================================
function handleDayClick(date) {
  selectedDate = date;
  showSlotsModal(date);
}

// ========================================
// SLOTS MODAL
// ========================================
function showSlotsModal(date) {
  const modal = document.getElementById('slotsModal');
  const dateElement = document.getElementById('selectedDate');
  const slotsList = document.getElementById('slotsList');

  dateElement.textContent = formatDateBR(date);

  const slots = Reservations.getAvailableSlots(date);
  slotsList.innerHTML = slots.map(slot => `
    <div class="slot-item ${slot.status}">
      <div class="slot-info">
        <span class="slot-time">${slot.label}</span>
        <span class="slot-status">${getStatusLabel(slot.status)}</span>
      </div>
      <button class="btn-reserve"
              ${!slot.available ? 'disabled' : ''}
              onclick="handleReserveClick('${date}', '${slot.id}')">
        ${slot.available ? 'Reservar' : 'Indisponível'}
      </button>
    </div>
  `).join('');

  modal.classList.add('active');
}

function getStatusLabel(status) {
  const labels = {
    available: 'Disponível',
    reserved: 'Reservado',
    closed: 'Arena Fechada'
  };
  return labels[status] || status;
}

// ========================================
// RESERVATION MODAL
// ========================================
window.handleReserveClick = function(date, slotId) {
  selectedDate = date;
  selectedSlot = slotId;
  showReservationModal(date, slotId);
};

function showReservationModal(date, slotId) {
  const modal = document.getElementById('reservationModal');
  const dateTimeInput = document.getElementById('reservationDateTime');

  const slot = SLOTS.find(s => s.id === slotId);
  dateTimeInput.value = `${formatDateBR(date)} - ${slot.label}`;

  document.getElementById('slotsModal').classList.remove('active');
  modal.classList.add('active');
}

// ========================================
// FORM HANDLERS
// ========================================
const form = document.getElementById('reservationForm');

// WhatsApp mask
document.getElementById('whatsapp').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 11) value = value.substr(0, 11);

  if (value.length > 6) {
    e.target.value = `(${value.substr(0, 2)}) ${value.substr(2, 5)}-${value.substr(7)}`;
  } else if (value.length > 2) {
    e.target.value = `(${value.substr(0, 2)}) ${value.substr(2)}`;
  } else if (value.length > 0) {
    e.target.value = `(${value}`;
  }
});

// Range slider
const rangeInput = document.getElementById('allowedPlayers');
const rangeValue = document.getElementById('playerCountValue');
rangeInput.addEventListener('input', () => {
  rangeValue.textContent = rangeInput.value;
});

// Show rules link
document.getElementById('showRulesLink').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('rulesModal').classList.add('active');
});

// Form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    date: selectedDate,
    slot: selectedSlot,
    gameName: document.getElementById('gameName').value,
    playerName: document.getElementById('playerName').value,
    whatsapp: document.getElementById('whatsapp').value,
    gameMode: document.getElementById('gameMode').value,
    gameStyle: document.querySelector('input[name="gameStyle"]:checked').value,
    missionType: document.getElementById('missionType').value,
    allowedPlayers: document.getElementById('allowedPlayers').value
  };

  try {
    Reservations.createReservation(formData);

    closeAllModals();
    form.reset();
    rangeValue.textContent = '24';
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());

    alert('Reserva confirmada com sucesso!\n\nVocê receberá uma confirmação via WhatsApp em breve.');
  } catch (error) {
    alert('Erro ao criar reserva: ' + error.message);
  }
});

// Cancel buttons
document.getElementById('cancelReservation').addEventListener('click', () => {
  closeAllModals();
  form.reset();
  rangeValue.textContent = '24';
});

// ========================================
// ADMIN FUNCTIONS
// ========================================
document.getElementById('toggleArenaStatus').addEventListener('click', () => {
  document.getElementById('adminPasswordModal').classList.add('active');
});

document.getElementById('confirmAdminPassword').addEventListener('click', () => {
  const password = document.getElementById('adminPassword').value;

  try {
    const result = Reservations.toggleDateStatus(selectedDate, password);
    const message = result === 'closed'
      ? 'Arena fechada para este dia.'
      : 'Arena reaberta para este dia.';

    alert(message);

    document.getElementById('adminPassword').value = '';
    closeAllModals();
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
  } catch (error) {
    alert('Erro: ' + error.message);
  }
});

document.getElementById('cancelAdminPassword').addEventListener('click', () => {
  document.getElementById('adminPassword').value = '';
  document.getElementById('adminPasswordModal').classList.remove('active');
});

// ========================================
// MODAL CLOSE HANDLERS
// ========================================
document.getElementById('closeSlotsModal').addEventListener('click', () => {
  document.getElementById('slotsModal').classList.remove('active');
});

document.getElementById('closeReservationModal').addEventListener('click', () => {
  closeAllModals();
  form.reset();
  rangeValue.textContent = '24';
});

document.getElementById('closeRulesModal').addEventListener('click', () => {
  document.getElementById('rulesModal').classList.remove('active');
});

document.getElementById('closeAdminPasswordModal').addEventListener('click', () => {
  document.getElementById('adminPassword').value = '';
  document.getElementById('adminPasswordModal').classList.remove('active');
});

// Close modal on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeAllModals();
      form.reset();
      rangeValue.textContent = '24';
    }
  });
});

// ========================================
// UTILITY
// ========================================
function closeAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('active');
  });
}

function populateYearSelector() {
  const yearSelector = document.getElementById('yearSelector');
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 1;
  const endYear = currentYear + 5;

  for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelector.appendChild(option);
  }
}

// ========================================
// SELECTOR EVENT LISTENERS
// ========================================
document.getElementById('monthSelector').addEventListener('change', (e) => {
  currentDate.setMonth(parseInt(e.target.value));
  renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

document.getElementById('yearSelector').addEventListener('change', (e) => {
  currentDate.setFullYear(parseInt(e.target.value));
  renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  populateYearSelector();
  renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
  console.log('Arena Squad Calendar - Sistema iniciado');
});
