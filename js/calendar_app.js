// --- Global State ---
let events = JSON.parse(localStorage.getItem('calendar_events')) || [];
let currentDate = new Date(); // The month being viewed
let selectedDate = new Date(); // The day selected in the agenda
let currentView = 'month';

// --- Toast Notification ---
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-24 right-4 z-[9999] flex flex-col gap-2';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    let icon = ''; let iconColor = 'text-success';
    if (type === 'success') {
        icon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    } else if (type === 'danger') {
        iconColor = 'text-danger';
        icon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`;
    } else {
        iconColor = 'text-warning';
        icon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
    }
    toast.className = `flex items-center gap-3 p-4 rounded-xl border shadow-lg bg-surface dark:bg-surface border-border dark:border-[#27272a] transform translate-x-full transition-all duration-300 ease-out`;
    toast.innerHTML = `<div class="shrink-0 ${iconColor}">${icon}</div><p class="text-sm font-medium text-primary">${message}</p>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('translate-x-full'));
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- Utils ---
const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function parseDateStr(dateStr) {
    // Expects YYYY-MM-DD
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date();
}

function generateId() {
    return 'evt_' + Date.now() + '_' + Math.floor(Math.random()*1000);
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initCalendar();
    
    // Bind controls
    document.getElementById('btn-prev-month').addEventListener('click', prevMonth);
    document.getElementById('btn-next-month').addEventListener('click', nextMonth);
    document.getElementById('btn-today').addEventListener('click', goToToday);
});

function initCalendar() {
    updateHeaderTitle();
    renderView();
    // Default open agenda for today
    selectedDate = new Date();
    openAgendaPanel(formatDate(selectedDate));
}

function updateHeaderTitle() {
    const titleEl = document.getElementById('calendar-header-title');
    if (titleEl) {
        if (currentView === 'month') {
            titleEl.innerText = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        } else if (currentView === 'week') {
            const start = new Date(currentDate);
            start.setDate(currentDate.getDate() - currentDate.getDay());
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            titleEl.innerText = `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${start.getFullYear()}`;
        } else if (currentView === 'day') {
            titleEl.innerText = `${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        }
    }
}

function prevMonth() {
    if (currentView === 'month') {
        currentDate.setMonth(currentDate.getMonth() - 1);
    } else if (currentView === 'week') {
        currentDate.setDate(currentDate.getDate() - 7);
    } else {
        currentDate.setDate(currentDate.getDate() - 1);
    }
    initCalendar();
}

function nextMonth() {
    if (currentView === 'month') {
        currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (currentView === 'week') {
        currentDate.setDate(currentDate.getDate() + 7);
    } else {
        currentDate.setDate(currentDate.getDate() + 1);
    }
    initCalendar();
}

function goToToday() {
    currentDate = new Date();
    selectedDate = new Date();
    initCalendar();
}

// --- View Rendering ---
function switchCalendarView(view) {
    currentView = view;
    const views = ['month', 'week', 'day'];
    const activeClasses = ['font-semibold', 'bg-white', 'dark:bg-surface', 'shadow-sm', 'text-primary'];
    const inactiveClasses = ['font-medium', 'text-gray-500', 'dark:text-gray-400', 'hover:text-primary'];
    
    views.forEach(v => {
        const btn = document.getElementById(`btn-view-${v}`);
        const container = document.getElementById(`view-${v}`);
        if (!btn || !container) return;
        
        // Remove all toggle classes first
        btn.classList.remove(...activeClasses, ...inactiveClasses);
        
        if (v === view) {
            btn.classList.add(...activeClasses);
            container.classList.remove('hidden');
            container.classList.add('flex', 'flex-col');
        } else {
            btn.classList.add(...inactiveClasses);
            container.classList.add('hidden');
            container.classList.remove('flex', 'flex-col');
        }
    });
    
    updateHeaderTitle();
    renderView();
}

function renderView() {
    if (currentView === 'month') renderMonthView();
    else if (currentView === 'week') renderWeekView();
    else if (currentView === 'day') renderDayView();
}

function getEventsForDate(dateStr) {
    return events.filter(e => e.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
}

function renderMonthView() {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    let html = '';
    const todayStr = formatDate(new Date());
    const selStr = formatDate(selectedDate);
    
    // Previous month cells
    for (let i = firstDay - 1; i >= 0; i--) {
        const d = prevMonthDays - i;
        const dDate = new Date(year, month - 1, d);
        const dStr = formatDate(dDate);
        html += createMonthCell(dDate, dStr, true, dStr === todayStr, dStr === selStr);
    }
    
    // Current month cells
    for (let i = 1; i <= daysInMonth; i++) {
        const dDate = new Date(year, month, i);
        const dStr = formatDate(dDate);
        html += createMonthCell(dDate, dStr, false, dStr === todayStr, dStr === selStr);
    }
    
    // Next month cells (to complete grid of 35 or 42)
    const totalCells = firstDay + daysInMonth;
    const remaining = (Math.ceil(totalCells / 7) * 7) - totalCells;
    for (let i = 1; i <= remaining; i++) {
        const dDate = new Date(year, month + 1, i);
        const dStr = formatDate(dDate);
        html += createMonthCell(dDate, dStr, true, dStr === todayStr, dStr === selStr);
    }
    
    grid.innerHTML = html;
}

function createMonthCell(dateObj, dateStr, isMuted, isToday, isSelected) {
    const dayEvts = getEventsForDate(dateStr);
    
    let bgClass = isMuted ? 'bg-gray-50 dark:bg-[#09090b] opacity-60' : 'bg-white dark:bg-surface';
    if (isSelected) bgClass = 'bg-gray-100 dark:bg-[#18181b] shadow-inner';
    
    let numHtml = `<span class="text-xs font-medium ${isMuted ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}">${dateObj.getDate()}</span>`;
    if (isToday) {
        numHtml = `<div class="flex items-center justify-between"><span class="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-white shadow-sm dark:bg-[#FAFAFA] dark:text-[#09090b]">${dateObj.getDate()}</span></div>`;
    }
    
    let evtsHtml = '';
    // Show max 3 events
    dayEvts.slice(0, 3).forEach(evt => {
        if (evt.type === 'Tugas') {
            evtsHtml += `<div class="bg-gray-100 border border-transparent px-1.5 py-0.5 rounded text-[9px] text-gray-700 font-medium truncate mt-1 dark:bg-[#27272a] dark:text-gray-300" title="${evt.title}">${evt.title}</div>`;
        } else {
            evtsHtml += `<div class="bg-blue-50 border-l-2 border-brand px-1.5 py-0.5 rounded text-[9px] text-brand font-medium truncate mt-1 dark:bg-blue-500/10 dark:border-blue-500/20" title="${evt.title}">${evt.title}</div>`;
        }
    });
    if (dayEvts.length > 3) {
        evtsHtml += `<div class="text-[9px] text-gray-400 mt-0.5 font-medium pl-1">+${dayEvts.length - 3} lagi</div>`;
    }
    
    return `
    <div class="p-2 min-h-[80px] cursor-pointer hover:bg-gray-100 dark:hover:bg-[#27272a] transition-colors flex flex-col gap-0.5 border-r border-b border-border dark:border-[#27272a] ${bgClass}" onclick="openAgendaPanel('${dateStr}')">
        ${numHtml}
        ${evtsHtml}
    </div>
    `;
}

function renderWeekView() {
    const grid = document.getElementById('week-grid');
    if (!grid) return;
    
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay());
    
    let html = '';
    for(let i=0; i<7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const dStr = formatDate(d);
        const dayEvts = getEventsForDate(dStr);
        
        let evtList = dayEvts.map(evt => {
            return `<div class="bg-white dark:bg-surface border border-border dark:border-[#27272a] p-2 rounded shadow-sm text-xs cursor-pointer hover:border-brand" onclick="openEditModal('${evt.id}')">
                <div class="font-bold text-primary truncate">${evt.title}</div>
                <div class="text-[10px] text-gray-500">${evt.time}</div>
            </div>`;
        }).join('');
        
        html += `
        <div class="flex flex-col border-r border-border dark:border-[#27272a] min-w-[120px]">
            <div class="p-2 text-center border-b border-border dark:border-[#27272a] bg-gray-50 dark:bg-[#09090b] cursor-pointer hover:bg-gray-100" onclick="openAgendaPanel('${dStr}')">
                <div class="text-xs text-gray-500">${days[d.getDay()].substring(0,3)}</div>
                <div class="text-sm font-bold text-primary ${dStr === formatDate(new Date()) ? 'bg-primary text-white rounded-full w-6 h-6 mx-auto flex items-center justify-center mt-1 dark:bg-[#FAFAFA] dark:text-[#09090b]' : 'mt-1'}">${d.getDate()}</div>
            </div>
            <div class="flex-1 p-2 space-y-2 bg-white dark:bg-background overflow-y-auto">
                ${evtList}
            </div>
        </div>
        `;
    }
    grid.innerHTML = html;
}

function renderDayView() {
    const list = document.getElementById('day-list');
    if (!list) return;
    
    const dStr = formatDate(currentDate);
    const dayEvts = getEventsForDate(dStr);
    
    let html = '';
    if (dayEvts.length === 0) {
        html = `<div class="p-8 text-center text-gray-400 text-sm">Tidak ada jadwal untuk hari ini.</div>`;
    } else {
        dayEvts.forEach(evt => {
            html += `
            <div class="flex items-center p-4 border-b border-border dark:border-[#27272a] hover:bg-gray-50 dark:hover:bg-[#18181b] cursor-pointer" onclick="openEditModal('${evt.id}')">
                <div class="w-20 text-sm font-bold text-primary">${evt.time}</div>
                <div class="w-3 h-3 rounded-full ${evt.type === 'Tugas' ? 'bg-gray-400' : 'bg-brand'} mx-4"></div>
                <div class="flex-1">
                    <h4 class="text-base font-semibold text-primary">${evt.title}</h4>
                    <p class="text-xs text-gray-500">${evt.category || evt.type}</p>
                </div>
            </div>`;
        });
    }
    list.innerHTML = html;
}

// --- Agenda Panel ---
function openAgendaPanel(dateStr) {
    selectedDate = parseDateStr(dateStr);
    
    // Also sync the currentView date if it's month
    if (currentView === 'month' && selectedDate.getMonth() !== currentDate.getMonth()) {
        currentDate = new Date(selectedDate);
    }
    
    renderView(); // re-render to show selected style
    
    const panel = document.getElementById('agenda-panel');
    const dateDisplay = document.getElementById('agenda-date-display');
    const dayDisplay = document.getElementById('agenda-day-display');
    const list = document.getElementById('agenda-list');
    
    dateDisplay.innerText = `${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    dayDisplay.innerText = days[selectedDate.getDay()];
    
    const dayEvts = getEventsForDate(dateStr);
    
    let html = '';
    if (dayEvts.length === 0) {
        html = `
        <div class="flex flex-col items-center justify-center h-40 text-gray-400">
            <svg class="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-xs font-medium">Tidak ada jadwal</span>
        </div>`;
    } else {
        dayEvts.forEach(evt => {
            const isTask = evt.type === 'Tugas';
            html += `
            <div onclick="openEditModal('${evt.id}')" class="bg-surface border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group dark:bg-surface dark:border-[#27272a] relative overflow-hidden">
                ${!isTask ? `<div class="absolute left-0 top-0 bottom-0 w-1 bg-brand"></div>` : ''}
                <div class="flex items-start justify-between ${!isTask ? 'pl-2' : ''}">
                    <div>
                        <h4 class="text-sm font-semibold text-primary ${isTask ? 'line-clamp-2' : ''}">${evt.title}</h4>
                        <p class="text-xs text-gray-500 mt-1 dark:text-gray-400">${evt.time} ${evt.category ? '• ' + evt.category : ''}</p>
                    </div>
                    <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[9px] font-medium text-gray-600 dark:bg-[#18181b] dark:text-gray-400 shrink-0 ml-2 border border-border dark:border-[#3f3f46]">${evt.type}</span>
                </div>
            </div>`;
        });
    }
    
    list.innerHTML = html;
    
    if (window.innerWidth < 768) {
        panel.classList.remove('translate-x-full');
    }
}

function closeAgendaPanel() {
    const panel = document.getElementById('agenda-panel');
    panel.classList.add('translate-x-full');
}

// --- Modal Logic ---
let currentEditId = null;

function openAddModal() {
    currentEditId = null;
    document.getElementById('modal-title').innerText = "Tambah Baru";
    document.getElementById('add-modal-input').value = '';
    document.getElementById('add-modal-date').value = formatDate(selectedDate);
    document.getElementById('add-modal-time').value = '10:00';
    document.getElementById('add-modal-category').value = '';
    document.getElementById('add-modal-type').value = 'Acara';
    
    document.getElementById('btn-delete-event').classList.add('hidden');
    showModal();
}

function openEditModal(id) {
    const evt = events.find(e => e.id === id);
    if (!evt) return;
    
    currentEditId = id;
    document.getElementById('modal-title').innerText = "Edit " + evt.type;
    document.getElementById('add-modal-input').value = evt.title;
    document.getElementById('add-modal-date').value = evt.date;
    document.getElementById('add-modal-time').value = evt.time;
    document.getElementById('add-modal-category').value = evt.category || '';
    document.getElementById('add-modal-type').value = evt.type || 'Acara';
    
    document.getElementById('btn-delete-event').classList.remove('hidden');
    showModal();
}

function showModal() {
    const addModal = document.getElementById('add-modal');
    const addModalContent = document.getElementById('add-modal-content');
    addModal.classList.remove('hidden');
    setTimeout(() => {
        addModalContent.classList.remove('scale-95', 'opacity-0');
        addModalContent.classList.add('scale-100', 'opacity-100');
        document.getElementById('add-modal-input').focus();
    }, 10);
}

function closeAddModal() {
    const addModal = document.getElementById('add-modal');
    const addModalContent = document.getElementById('add-modal-content');
    addModalContent.classList.remove('scale-100', 'opacity-100');
    addModalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        addModal.classList.add('hidden');
    }, 200);
}

function saveEvent() {
    const title = document.getElementById('add-modal-input').value.trim();
    const date = document.getElementById('add-modal-date').value;
    const time = document.getElementById('add-modal-time').value;
    const category = document.getElementById('add-modal-category').value.trim();
    const type = document.getElementById('add-modal-type').value;
    
    if (!title || !date) {
        showToast('Judul dan Tanggal wajib diisi!', 'warning');
        return;
    }
    
    if (currentEditId) {
        // Edit existing
        const idx = events.findIndex(e => e.id === currentEditId);
        if (idx !== -1) {
            events[idx] = { id: currentEditId, title, date, time, category, type };
        }
    } else {
        // Add new
        events.push({
            id: generateId(),
            title, date, time, category, type
        });
    }
    
    localStorage.setItem('calendar_events', JSON.stringify(events));
    closeAddModal();
    
    // Refresh UI
    selectedDate = parseDateStr(date);
    currentDate = new Date(selectedDate);
    renderView();
    openAgendaPanel(date);
    
    showToast(currentEditId ? 'Data berhasil diperbarui!' : 'Jadwal baru berhasil ditambahkan!');
}

function deleteEvent() {
    if (!currentEditId) return;
    
    events = events.filter(e => e.id !== currentEditId);
    localStorage.setItem('calendar_events', JSON.stringify(events));
    
    closeAddModal();
    renderView();
    openAgendaPanel(formatDate(selectedDate));
    
    showToast('Jadwal berhasil dihapus secara permanen.', 'danger');
}
