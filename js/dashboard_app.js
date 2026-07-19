// dashboard_app.js

window.logActivity = function(type, label) {
    let logs = JSON.parse(localStorage.getItem('activity_log')) || [];
    logs.unshift({ type: type, label: label, time: new Date().toISOString() });
    if (logs.length > 50) logs = logs.slice(0, 50);
    localStorage.setItem('activity_log', JSON.stringify(logs));
    if (document.getElementById('dashboard-activity')) {
        renderActivityTimeline();
    }
};

function formatTime(isoString) {
    const d = new Date(isoString);
    return d.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) + ' WIB';
}

function renderActivityTimeline() {
    const container = document.getElementById('dashboard-activity');
    if (!container) return;
    let logs = JSON.parse(localStorage.getItem('activity_log')) || [];
    let html = '';
    logs.slice(0, 5).forEach(log => {
        let colorClass = 'bg-primary dark:bg-[#FAFAFA]';
        if (log.type === 'expense') colorClass = 'bg-danger';
        else if (log.type === 'income') colorClass = 'bg-success';
        else if (log.type === 'task') colorClass = 'bg-success';
        
        let typeLabel = 'Aktivitas';
        if (log.type === 'expense') typeLabel = 'Pengeluaran ditambahkan';
        else if (log.type === 'income') typeLabel = 'Pemasukan ditambahkan';
        else if (log.type === 'task') typeLabel = 'Tugas selesai';
        else if (log.type === 'note') typeLabel = 'Catatan dibuat';
        
        html += `
        <div class="relative">
            <div class="absolute -left-[25px] top-1 h-3 w-3 rounded-full ${colorClass} ring-4 ring-white"></div>
            <p class="text-sm"><span class="font-medium">${typeLabel}</span></p>
            <p class="text-xs text-gray-500 mt-1 dark:text-gray-400">${log.label}</p>
            <span class="text-[10px] text-gray-400 mt-1 block">${formatTime(log.time)}</span>
        </div>`;
    });
    
    if (html === '') {
        html = '<p class="text-sm text-gray-500">Belum ada aktivitas.</p>';
    }
    container.innerHTML = html;
}

function updateDashboardStats() {
    // Finance stats
    let transactions = JSON.parse(localStorage.getItem('finance_transactions')) || [];
    
    let today = new Date();
    today.setHours(0,0,0,0);
    let todayEnd = new Date();
    todayEnd.setHours(23,59,59,999);
    
    let monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    let todayExpense = transactions.filter(t => t.type === 'pengeluaran' && new Date(t.date) >= today && new Date(t.date) <= todayEnd)
                                    .reduce((sum, t) => sum + t.amount, 0);
    let monthIncome = transactions.filter(t => t.type === 'pemasukan' && new Date(t.date) >= monthStart)
                                    .reduce((sum, t) => sum + t.amount, 0);
                                    
    const expEl = document.getElementById('stat-expense');
    if (expEl) expEl.innerText = 'Rp ' + todayExpense.toLocaleString('id-ID');
    
    const incEl = document.getElementById('stat-income');
    if (incEl) incEl.innerText = 'Rp ' + monthIncome.toLocaleString('id-ID');
    
    // Notes
    const notesContainer = document.getElementById('dashboard-notes');
    if (notesContainer) {
        let notes = JSON.parse(localStorage.getItem('user_notes')) || [];
        let nHtml = '';
        notes.sort((a,b) => new Date(b.created_at || b.date || b.timestamp || 0) - new Date(a.created_at || a.date || a.timestamp || 0));
        notes.slice(0,3).forEach(note => {
            nHtml += `
            <a href="notes.html" class="block bg-surface p-5 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-gray-300 transition-all group dark:bg-surface dark:border-[#27272a]">
                <h4 class="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">${note.title || 'Tanpa Judul'}</h4>
                <p class="text-xs text-gray-500 line-clamp-3 leading-relaxed dark:text-gray-400">${(note.content || note.desc || '').substring(0,100)}</p>
                <div class="mt-4 flex items-center justify-between">
                    <span class="text-[10px] text-gray-400">${note.created_at || note.date || note.timestamp ? new Date(note.created_at || note.date || note.timestamp).toLocaleDateString('id-ID') : ''}</span>
                </div>
            </a>`;
        });
        if (nHtml !== '') notesContainer.innerHTML = nHtml;
    }
    
    // Tasks: Check board
    const taskContainer = document.getElementById('dashboard-tasks');
    if (taskContainer) {
        let allTasks = [];
        ['state_board-todo', 'state_board-inprogress'].forEach(key => {
            const state = localStorage.getItem(key);
            if (state) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(state, 'text/html');
                const cards = doc.querySelectorAll('.kanban-card');
                cards.forEach(card => {
                    const titleEl = card.querySelector('h4');
                    if (titleEl) {
                        allTasks.push(titleEl.innerText);
                    }
                });
                if (allTasks.length === 0) {
                    // Fallback to h4 directly
                    const titles = doc.querySelectorAll('h4');
                    titles.forEach(t => allTasks.push(t.innerText));
                }
            }
        });
        
        const statTasksEl = document.getElementById('stat-tasks');
        const statTasksTotEl = document.getElementById('stat-tasks-total');
        if (statTasksEl) statTasksEl.innerText = Math.min(allTasks.length, 5); // Example
        if (statTasksTotEl) statTasksTotEl.innerText = '/ ' + allTasks.length;
        
        let tHtml = '';
        allTasks.slice(0, 5).forEach(title => {
            tHtml += `
            <li class="p-4 hover:bg-gray-50 transition-colors group flex items-start cursor-pointer dark:hover:bg-[#27272a]">
                <div class="pt-0.5">
                    <input type="checkbox" class="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer transition-all dark:bg-surface dark:border-[#3f3f46]">
                </div>
                <div class="ml-3 flex-1">
                    <p class="text-sm font-medium text-primary">${title}</p>
                    <div class="flex items-center gap-3 mt-1.5">
                        <span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-[#09090b] dark:text-gray-400">Tugas</span>
                    </div>
                </div>
            </li>`;
        });
        if (tHtml !== '') {
            taskContainer.innerHTML = tHtml;
        } else {
            taskContainer.innerHTML = '<li class="p-4"><p class="text-sm text-gray-500">Tidak ada tugas yang sedang berjalan.</p></li>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderActivityTimeline();
    updateDashboardStats();
});
