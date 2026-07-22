const fs = require('fs');

const newCalendarApp = `
// js/calendar_app.js

let currentView = 'month'; // 'month', 'week', 'day'
let currentDate = new Date();
let selectedDate = new Date();
let currentEditId = null;

// --- Global State ---
let events = []; // Array of { id, title, date (YYYY-MM-DD), type, timeStart, timeEnd, category }
let tasks = []; // Array of tasks from DB

async function loadAllEvents() {
    try {
        // Fetch from OS_DB
        const dbEvents = await OS_DB.getEvents();
        const dbTasks = await OS_DB.getTasks();
        
        // Map tasks to event-like structure for the calendar
        const taskEvents = dbTasks
            .filter(t => t.deadline)
            .map(t => ({
                id: 'task_' + t.id,
                title: t.title,
                date: t.deadline,
                type: 'Tugas',
                status: t.status,
                priority: t.priority
            }));

        events = [...dbEvents, ...taskEvents];
        renderView();
        
        // Refresh agenda if it's open
        const panel = document.getElementById('agenda-panel');
        if (!panel.classList.contains('translate-x-full')) {
            openAgendaPanel(formatDate(selectedDate));
        }
    } catch(e) {
        console.error("Gagal memuat event:", e);
        if(window.showToast) window.showToast("Gagal memuat kalender", "danger");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in (optional for standalone, usually we just let them in)
    // Wait a tiny bit for DB to initialize
    setTimeout(() => {
        loadAllEvents();
    }, 100);

    // Setup input listeners
    document.getElementById('add-modal-type').addEventListener('change', (e) => {
        const type = e.target.value;
        const timeInputs = document.querySelectorAll('#add-modal-time-start, #add-modal-time-end');
        if(type === 'Acara' || type === 'Tugas') {
            timeInputs.forEach(el => el.classList.remove('hidden'));
        } else {
            timeInputs.forEach(el => el.classList.add('hidden'));
        }
    });
});

// --- Utility Functions ---
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
}

function formatDate(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return \`\${y}-\${m}-\${d}\`;
}

function parseDateStr(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return new Date(y, m - 1, d);
}

const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

// --- Navigation ---
function prevMonth() {
    if (currentView === 'month') {
        currentDate.setMonth(currentDate.getMonth() - 1);
    } else if (currentView === 'week') {
        currentDate.setDate(currentDate.getDate() - 7);
    } else {
        currentDate.setDate(currentDate.getDate() - 1);
    }
    renderView();
}

function nextMonth() {
    if (currentView === 'month') {
        currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (currentView === 'week') {
        currentDate.setDate(currentDate.getDate() + 7);
    } else {
        currentDate.setDate(currentDate.getDate() + 1);
    }
    renderView();
}

function goToToday() {
    currentDate = new Date();
    selectedDate = new Date();
    renderView();
    openAgendaPanel(formatDate(selectedDate));
}

function switchCalendarView(view) {
    currentView = view;
    // Update button styles
    ['month', 'week', 'day'].forEach(v => {
        const btn = document.getElementById('btn-view-' + v);
        if (v === view) {
            btn.className = 'px-3 py-1.5 text-xs font-semibold bg-white shadow-sm rounded-md text-primary transition-all dark:bg-surface';
        } else {
            btn.className = 'px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-all cursor-pointer dark:text-gray-400';
        }
    });

    renderView();
}

function updateHeaderTitle() {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    
    if(currentView === 'month') {
        document.getElementById('calendar-header-title').innerText = \`\${monthNames[m]} \${y}\`;
    } else if(currentView === 'week') {
        // Find start of week (Sunday)
        const day = currentDate.getDay();
        const start = new Date(currentDate);
        start.setDate(currentDate.getDate() - day);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        
        if(start.getMonth() === end.getMonth()) {
            document.getElementById('calendar-header-title').innerText = \`\${start.getDate()} - \${end.getDate()} \${monthNames[start.getMonth()]} \${y}\`;
        } else {
            document.getElementById('calendar-header-title').innerText = \`\${start.getDate()} \${monthNames[start.getMonth()].substring(0,3)} - \${end.getDate()} \${monthNames[end.getMonth()].substring(0,3)} \${y}\`;
        }
    } else {
        document.getElementById('calendar-header-title').innerText = \`\${currentDate.getDate()} \${monthNames[m]} \${y}\`;
    }
}

// --- Render Main Views ---
function renderView() {
    updateHeaderTitle();
    
    // Hide all views first
    document.getElementById('view-month').classList.add('hidden');
    
    if (currentView === 'month') {
        document.getElementById('view-month').classList.remove('hidden');
        renderMonthView();
    } else if (currentView === 'week') {
        document.getElementById('view-month').classList.remove('hidden'); // Repurposing grid for now
        renderWeekView();
    } else {
        document.getElementById('view-month').classList.remove('hidden'); // Repurposing grid
        renderDayView();
    }
}

function getEventsForDate(dateStr) {
    return events.filter(e => e.date === dateStr);
}

function renderMonthView() {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';
    
    // Switch to 7 cols
    grid.className = 'flex-1 grid grid-cols-7 gap-px bg-border border border-t-0 border-border rounded-b-xl overflow-hidden dark:border-[#27272a]';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    let firstDay = getFirstDayOfMonth(year, month);
    
    const todayStr = formatDate(new Date());
    const selStr = formatDate(selectedDate);
    
    // Padding days before start of month
    for (let i = 0; i < firstDay; i++) {
        const cell = document.createElement('div');
        cell.className = 'bg-gray-50/50 min-h-[100px] dark:bg-[#09090b]/50';
        grid.appendChild(cell);
    }
    
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, month, d);
        const dateStr = formatDate(dateObj);
        const dayEvents = getEventsForDate(dateStr);
        
        const isToday = dateStr === todayStr;
        const isSelected = dateStr === selStr;
        
        const cell = document.createElement('div');
        cell.className = \`bg-surface min-h-[100px] p-1.5 sm:p-2 cursor-pointer transition-colors relative group \${isSelected ? 'ring-2 ring-inset ring-primary' : 'hover:bg-gray-50 dark:hover:bg-[#18181b]'}\`;
        cell.onclick = () => {
            selectedDate = dateObj;
            renderView(); // re-render to show selection
            openAgendaPanel(dateStr);
        };
        
        // Day number
        const numContainer = document.createElement('div');
        numContainer.className = 'flex justify-between items-start';
        
        const numSpan = document.createElement('span');
        numSpan.className = \`inline-flex items-center justify-center w-7 h-7 text-xs sm:text-sm font-semibold rounded-full \${isToday ? 'bg-primary text-white dark:bg-[#FAFAFA] dark:text-[#09090b]' : 'text-primary dark:text-gray-300'}\`;
        numSpan.innerText = d;
        numContainer.appendChild(numSpan);
        
        // Show count indicator on mobile
        if(dayEvents.length > 0) {
            const countBadge = document.createElement('span');
            countBadge.className = 'md:hidden text-[10px] font-bold text-gray-400';
            countBadge.innerText = dayEvents.length;
            numContainer.appendChild(countBadge);
        }
        
        cell.appendChild(numContainer);
        
        // Event blocks (Desktop)
        const eventContainer = document.createElement('div');
        eventContainer.className = 'hidden md:flex flex-col mt-2 gap-1 overflow-hidden h-[calc(100%-2rem)]';
        
        // Show up to 3 events
        dayEvents.slice(0, 3).forEach(ev => {
            const evEl = document.createElement('div');
            
            let bgClass = 'bg-gray-100 text-gray-700 dark:bg-[#27272a] dark:text-gray-300';
            if(ev.type === 'Tugas') bgClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
            else if(ev.type === 'Acara') bgClass = 'bg-brand/10 text-brand border border-brand/20';
            else if(ev.type === 'Pengingat') bgClass = 'bg-warning/10 text-warning border border-warning/20';
            
            evEl.className = \`text-[10px] sm:text-xs truncate px-1.5 py-0.5 rounded-md font-medium \${bgClass}\`;
            evEl.innerText = ev.title;
            eventContainer.appendChild(evEl);
        });
        
        if (dayEvents.length > 3) {
            const moreEl = document.createElement('div');
            moreEl.className = 'text-[10px] text-gray-400 font-medium px-1.5';
            moreEl.innerText = \`+\${dayEvents.length - 3} lainnya\`;
            eventContainer.appendChild(moreEl);
        }
        
        cell.appendChild(eventContainer);
        grid.appendChild(cell);
    }
    
    // Padding end
    const totalCells = firstDay + daysInMonth;
    const paddingEnd = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < paddingEnd; i++) {
        const cell = document.createElement('div');
        cell.className = 'bg-gray-50/50 min-h-[100px] dark:bg-[#09090b]/50';
        grid.appendChild(cell);
    }
}

// Simple implementations for Week and Day view using the grid (just showing 7 days or 1 day)
function renderWeekView() {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';
    grid.className = 'flex-1 grid grid-cols-7 gap-px bg-border border border-t-0 border-border rounded-b-xl overflow-hidden dark:border-[#27272a]';
    
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const todayStr = formatDate(new Date());
    const selStr = formatDate(selectedDate);
    
    for(let i=0; i<7; i++) {
        const loopDate = new Date(startOfWeek);
        loopDate.setDate(startOfWeek.getDate() + i);
        const dateStr = formatDate(loopDate);
        const dayEvents = getEventsForDate(dateStr);
        
        const isToday = dateStr === todayStr;
        const isSelected = dateStr === selStr;
        
        const cell = document.createElement('div');
        cell.className = \`bg-surface min-h-[300px] p-2 cursor-pointer transition-colors relative \${isSelected ? 'ring-2 ring-inset ring-primary' : 'hover:bg-gray-50 dark:hover:bg-[#18181b]'}\`;
        cell.onclick = () => {
            selectedDate = loopDate;
            renderView();
            openAgendaPanel(dateStr);
        };
        
        const numSpan = document.createElement('span');
        numSpan.className = \`inline-flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full \${isToday ? 'bg-primary text-white dark:bg-[#FAFAFA] dark:text-[#09090b]' : 'text-primary dark:text-gray-300'}\`;
        numSpan.innerText = loopDate.getDate();
        cell.appendChild(numSpan);
        
        const eventContainer = document.createElement('div');
        eventContainer.className = 'flex flex-col mt-3 gap-1.5';
        
        dayEvents.forEach(ev => {
            const evEl = document.createElement('div');
            let bgClass = 'bg-gray-100 text-gray-700 dark:bg-[#27272a] dark:text-gray-300';
            if(ev.type === 'Tugas') bgClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
            else if(ev.type === 'Acara') bgClass = 'bg-brand/10 text-brand border border-brand/20';
            
            evEl.className = \`text-xs px-2 py-1 rounded-md font-medium leading-tight \${bgClass}\`;
            evEl.innerText = ev.title;
            eventContainer.appendChild(evEl);
        });
        
        cell.appendChild(eventContainer);
        grid.appendChild(cell);
    }
}

function renderDayView() {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';
    grid.className = 'flex-1 grid grid-cols-1 gap-px bg-border border border-t-0 border-border rounded-b-xl overflow-y-auto dark:border-[#27272a]';
    
    const dateStr = formatDate(currentDate);
    const dayEvents = getEventsForDate(dateStr);
    
    const cell = document.createElement('div');
    cell.className = 'bg-surface min-h-[500px] p-6';
    
    const title = document.createElement('h3');
    title.className = 'text-lg font-bold text-primary mb-6';
    title.innerText = "Agenda Harian";
    cell.appendChild(title);
    
    if(dayEvents.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'text-gray-400 text-sm italic';
        empty.innerText = "Tidak ada agenda di hari ini.";
        cell.appendChild(empty);
    } else {
        const list = document.createElement('div');
        list.className = 'flex flex-col gap-3 max-w-2xl';
        dayEvents.forEach(ev => {
            const item = document.createElement('div');
            let borderCls = 'border-l-gray-300';
            if(ev.type === 'Tugas') borderCls = 'border-l-blue-500';
            else if(ev.type === 'Acara') borderCls = 'border-l-brand';
            
            item.className = \`p-4 rounded-xl border border-border border-l-4 \${borderCls} bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-[#09090b] dark:border-[#27272a]\`;
            item.innerHTML = \`
                <div>
                    <h4 class="font-bold text-primary">\${ev.title}</h4>
                    <p class="text-xs text-gray-500 mt-1 uppercase tracking-wider">\${ev.type}</p>
                </div>
                <div class="text-right">
                    \${ev.timeStart ? \`<span class="text-sm font-medium text-primary bg-gray-100 px-2 py-1 rounded dark:bg-[#18181b]">\${ev.timeStart} \${ev.timeEnd ? '- '+ev.timeEnd : ''}</span>\` : ''}
                </div>
            \`;
            list.appendChild(item);
        });
        cell.appendChild(list);
    }
    
    grid.appendChild(cell);
}

// --- Agenda Panel (Right Side) ---
const daysNamesIndo = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
function openAgendaPanel(dateStr) {
    const panel = document.getElementById('agenda-panel');
    panel.classList.remove('translate-x-full');
    
    const dateObj = parseDateStr(dateStr);
    document.getElementById('agenda-date-display').innerText = \`\${dateObj.getDate()} \${monthNames[dateObj.getMonth()].substring(0,3)} \${dateObj.getFullYear()}\`;
    document.getElementById('agenda-date-display').nextElementSibling.innerText = daysNamesIndo[dateObj.getDay()];
    
    const dayEvents = getEventsForDate(dateStr);
    const listEl = document.getElementById('agenda-list');
    listEl.innerHTML = '';
    
    if (dayEvents.length === 0) {
        listEl.innerHTML = \`
            <div class="flex flex-col items-center justify-center h-48 text-gray-400">
                <svg class="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p class="text-sm font-medium">Kosong</p>
                <p class="text-xs mt-1">Tidak ada agenda</p>
            </div>
        \`;
        return;
    }
    
    // Sort logic: Tasks first, then time sorted
    dayEvents.sort((a,b) => {
        if(a.type === 'Tugas' && b.type !== 'Tugas') return -1;
        if(b.type === 'Tugas' && a.type !== 'Tugas') return 1;
        const ta = a.timeStart || '23:59';
        const tb = b.timeStart || '23:59';
        return ta.localeCompare(tb);
    });
    
    dayEvents.forEach(ev => {
        const isTask = ev.type === 'Tugas';
        
        let colorTheme = 'text-brand bg-brand/10';
        let icon = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
        
        if (isTask) {
            colorTheme = 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
            icon = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        } else if (ev.type === 'Pengingat') {
            colorTheme = 'text-warning bg-warning/10';
            icon = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        }
        
        const item = document.createElement('div');
        item.className = 'group p-4 rounded-xl border border-border hover:border-gray-300 bg-white transition-all cursor-pointer shadow-sm hover:shadow-md dark:bg-[#09090b] dark:border-[#27272a] dark:hover:border-[#3f3f46]';
        
        // If it's not a task, we allow editing from calendar
        if (!isTask) {
            item.onclick = () => editEvent(ev.id);
        } else {
            item.onclick = () => {
                if(window.showToast) window.showToast("Tugas dikelola di menu Tasks.", "info");
                setTimeout(() => window.location.href='tasks.html', 800);
            };
        }
        
        item.innerHTML = \`
            <div class="flex items-start gap-3">
                <div class="p-2 rounded-lg shrink-0 \${colorTheme}">
                    \${icon}
                </div>
                <div class="flex-1 min-w-0 pt-0.5">
                    <h4 class="text-sm font-bold text-primary truncate leading-tight">\${ev.title}</h4>
                    <div class="flex items-center gap-2 mt-2">
                        \${ev.timeStart ? \`<span class="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded dark:bg-[#18181b] dark:text-gray-400">\${ev.timeStart}\${ev.timeEnd ? ' - '+ev.timeEnd : ''}</span>\` : ''}
                        \${ev.category ? \`<span class="text-[10px] uppercase font-bold text-gray-400">\${ev.category}</span>\` : ''}
                        \${isTask ? \`<span class="text-[10px] uppercase font-bold text-gray-400">\${ev.priority}</span>\` : ''}
                    </div>
                </div>
            </div>
        \`;
        
        listEl.appendChild(item);
    });
}

function closeAgendaPanel() {
    const panel = document.getElementById('agenda-panel');
    panel.classList.add('translate-x-full');
}

// --- Modal Add/Edit Event ---
function openAddModal() {
    currentEditId = null;
    document.getElementById('modal-title').innerText = "Tambah Baru";
    document.getElementById('add-modal-input').value = '';
    document.getElementById('add-modal-date').value = formatDate(selectedDate);
    document.getElementById('add-modal-time-start').value = '10:00';
    document.getElementById('add-modal-time-end').value = '11:00';
    document.getElementById('add-modal-category').value = '';
    document.getElementById('add-modal-type').value = 'Acara';
    
    document.getElementById('btn-delete-event').classList.add('hidden');
    showModal();
}

function editEvent(id) {
    const ev = events.find(e => e.id === id);
    if(!ev) return;
    
    currentEditId = ev.id;
    document.getElementById('modal-title').innerText = "Edit Jadwal";
    document.getElementById('add-modal-input').value = ev.title;
    document.getElementById('add-modal-date').value = ev.date;
    document.getElementById('add-modal-time-start').value = ev.timeStart || '';
    document.getElementById('add-modal-time-end').value = ev.timeEnd || '';
    document.getElementById('add-modal-category').value = ev.category || '';
    document.getElementById('add-modal-type').value = ev.type || 'Acara';
    
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

async function saveEvent() {
    const title = document.getElementById('add-modal-input').value.trim();
    const date = document.getElementById('add-modal-date').value;
    const timeStart = document.getElementById('add-modal-time-start').value;
    const timeEnd = document.getElementById('add-modal-time-end').value;
    const category = document.getElementById('add-modal-category').value.trim();
    const type = document.getElementById('add-modal-type').value;

    if (!title) {
        if(window.showToast) window.showToast('Judul tidak boleh kosong', 'warning');
        return;
    }

    const eventData = {
        title,
        date,
        timeStart,
        timeEnd,
        category,
        type
    };

    if (currentEditId) {
        await OS_DB.updateEvent(currentEditId, eventData);
        if(window.showToast) window.showToast('Jadwal berhasil diubah!', 'success');
    } else {
        await OS_DB.addEvent(eventData);
        if(window.showToast) window.showToast('Jadwal berhasil ditambahkan!', 'success');
    }
    
    closeAddModal();
    await loadAllEvents();
}

async function deleteEvent() {
    if (!currentEditId) return;
    
    await OS_DB.deleteEvent(currentEditId);
    
    closeAddModal();
    await loadAllEvents();
    
    if(window.showToast) window.showToast('Jadwal berhasil dihapus secara permanen.', 'danger');
}

// Make functions globally available for inline event handlers
window.openAddModal = openAddModal;
window.closeAddModal = closeAddModal;
window.saveEvent = saveEvent;
window.deleteEvent = deleteEvent;
window.editEvent = editEvent;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
window.goToToday = goToToday;
window.switchCalendarView = switchCalendarView;
window.closeAgendaPanel = closeAgendaPanel;
`;

fs.writeFileSync('D:/PersonalOS/js/calendar_app.js', newCalendarApp);
console.log('Migrated calendar_app.js to IndexedDB');
