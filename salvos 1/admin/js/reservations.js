// ARENA SQUAD - RESERVATIONS SYSTEM
// Gerenciamento de reservas com localStorage

// ========================================
// STORAGE KEYS
// ========================================
const STORAGE_KEYS = {
  RESERVATIONS: 'arena_squad_reservations',
  CLOSED_DATES: 'arena_squad_closed_dates',
  ADMIN_PASSWORD: 'admin123'
};

// ========================================
// SLOTS CONFIGURATION
// ========================================
const SLOTS = [
  { id: '08:00-10:00', label: '08:00 - 10:00', start: '08:00', end: '10:00' },
  { id: '10:00-12:00', label: '10:00 - 12:00', start: '10:00', end: '12:00' },
  { id: '12:00-14:00', label: '12:00 - 14:00', start: '12:00', end: '14:00' },
  { id: '14:00-16:00', label: '14:00 - 16:00', start: '14:00', end: '16:00' },
  { id: '16:00-18:00', label: '16:00 - 18:00', start: '16:00', end: '18:00' }
];

// ========================================
// UTILITY FUNCTIONS
// ========================================
function generateId() {
  return 'res_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateBR(date) {
  const d = new Date(date + 'T12:00:00');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatWhatsApp(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.substr(0, 2)}) ${cleaned.substr(2, 5)}-${cleaned.substr(7)}`;
  }
  return phone;
}

// ========================================
// STORAGE LAYER
// ========================================
const Storage = {
  getReservations() {
    const data = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return data ? JSON.parse(data) : [];
  },

  saveReservation(reservation) {
    const reservations = this.getReservations();
    reservations.push(reservation);
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    return reservation;
  },

  deleteReservation(id) {
    const reservations = this.getReservations();
    const filtered = reservations.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(filtered));
  },

  getClosedDates() {
    const data = localStorage.getItem(STORAGE_KEYS.CLOSED_DATES);
    return data ? JSON.parse(data) : {};
  },

  setClosedDates(closedDates) {
    localStorage.setItem(STORAGE_KEYS.CLOSED_DATES, JSON.stringify(closedDates));
  },

  closeDate(date) {
    const closedDates = this.getClosedDates();
    if (!closedDates[date]) {
      closedDates[date] = { allDay: true, slots: [] };
    }
    closedDates[date].allDay = true;
    this.setClosedDates(closedDates);
  },

  openDate(date) {
    const closedDates = this.getClosedDates();
    if (closedDates[date]) {
      delete closedDates[date];
      this.setClosedDates(closedDates);
    }
  },

  isDateClosed(date) {
    const closedDates = this.getClosedDates();
    return closedDates[date] && closedDates[date].allDay;
  }
};

// ========================================
// RESERVATIONS LOGIC
// ========================================
const Reservations = {
  getAvailableSlots(date) {
    if (Storage.isDateClosed(date)) {
      return SLOTS.map(slot => ({
        ...slot,
        available: false,
        status: 'closed'
      }));
    }

    const reservations = Storage.getReservations();
    const dateReservations = reservations.filter(r => r.date === date);

    return SLOTS.map(slot => {
      const reserved = dateReservations.some(r => r.slot === slot.id);
      return {
        ...slot,
        available: !reserved,
        status: reserved ? 'reserved' : 'available',
        reservation: reserved ? dateReservations.find(r => r.slot === slot.id) : null
      };
    });
  },

  isSlotAvailable(date, slotId) {
    if (Storage.isDateClosed(date)) {
      return false;
    }

    const reservations = Storage.getReservations();
    return !reservations.some(r => r.date === date && r.slot === slotId);
  },

  createReservation(data) {
    if (!this.isSlotAvailable(data.date, data.slot)) {
      throw new Error('Horário não disponível');
    }

    const reservation = {
      id: generateId(),
      date: data.date,
      slot: data.slot,
      gameName: data.gameName,
      playerName: data.playerName,
      whatsapp: formatWhatsApp(data.whatsapp),
      gameMode: data.gameMode,
      gameStyle: data.gameStyle,
      allowedPlayers: parseInt(data.allowedPlayers),
      missionType: data.missionType,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    return Storage.saveReservation(reservation);
  },

  getReservationsForDate(date) {
    const reservations = Storage.getReservations();
    return reservations.filter(r => r.date === date);
  },

  getDateStatus(date) {
    if (Storage.isDateClosed(date)) {
      return 'closed';
    }

    const slots = this.getAvailableSlots(date);
    const availableCount = slots.filter(s => s.available).length;

    if (availableCount === 0) return 'full';
    if (availableCount === SLOTS.length) return 'available';
    return 'partial';
  },

  toggleDateStatus(date, password) {
    if (password !== STORAGE_KEYS.ADMIN_PASSWORD) {
      throw new Error('Senha incorreta');
    }

    if (Storage.isDateClosed(date)) {
      Storage.openDate(date);
      return 'opened';
    } else {
      Storage.closeDate(date);
      return 'closed';
    }
  }
};

// ========================================
// EXPORT
// ========================================
window.ReservationSystem = {
  Storage,
  Reservations,
  SLOTS,
  formatDate,
  formatDateBR,
  formatWhatsApp
};
