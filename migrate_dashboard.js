const fs = require('fs');

const newDashboardApp = `
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
        
        html += \`
        <div class="relative">
            <div class="absolute -left-[25px] top-1 h-3 w-3 rounded-full \${colorClass} ring-4 ring-white dark:ring-surface"></div>
            <p class="text-sm"><span class="font-medium">\${typeLabel}</span></p>
            <p class="text-xs text-gray-500 mt-1 dark:text-gray-400">\${log.label}</p>
            <span class="text-[10px] text-gray-400 mt-1 block">\${formatTime(log.time)}</span>
        </div>\`;
    });
    
    if (html === '') {
        html = '<p class="text-sm text-gray-500">Belum ada aktivitas.</p>';
    }
    container.innerHTML = html;
}

async function updateDashboardStats() {
    try {
        // Fetch from OS_DB
        const transactions = await OS_DB.getFinances();
        const notes = await OS_DB.getNotes();
        const allTasksDB = await OS_DB.getTasks();
        
        // --- Finance Stats ---
        let today = new Date();
        today.setHours(0,0,0,0);
        let todayEnd = new Date();
        todayEnd.setHours(23,59,59,999);
        
        let monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        let todayExpense = transactions.filter(t => t.type === 'expense' && new Date(t.date) >= today && new Date(t.date) <= todayEnd)
                                        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        let monthIncome = transactions.filter(t => t.type === 'income' && new Date(t.date) >= monthStart)
                                        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
                                        
        const expEl = document.getElementById('stat-expense');
        if (expEl) expEl.innerText = 'Rp ' + todayExpense.toLocaleString('id-ID');
        
        const incEl = document.getElementById('stat-income');
        if (incEl) incEl.innerText = 'Rp ' + monthIncome.toLocaleString('id-ID');
        
        // --- Notes Stats ---
        const notesContainer = document.getElementById('dashboard-notes');
        if (notesContainer) {
            let nHtml = '';
            notes.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
            notes.slice(0,3).forEach(note => {
                nHtml += \`
                <a href="notes.html" class="block bg-surface p-5 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-gray-300 transition-all group dark:bg-surface dark:border-[#27272a]">
                    <h4 class="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">\${note.title || 'Tanpa Judul'}</h4>
                    <p class="text-xs text-gray-500 line-clamp-3 leading-relaxed dark:text-gray-400">\${(note.content || '').substring(0,100)}</p>
                    <div class="mt-4 flex items-center justify-between">
                        <span class="text-[10px] text-gray-400">\${note.createdAt ? new Date(note.createdAt).toLocaleDateString('id-ID') : ''}</span>
                    </div>
                </a>\`;
            });
            if (nHtml !== '') notesContainer.innerHTML = nHtml;
        }
        
        // --- Tasks Stats ---
        const taskContainer = document.getElementById('dashboard-tasks');
        if (taskContainer) {
            // Filter unfinished tasks
            const activeTasks = allTasksDB.filter(t => t.status !== 'done');
            
            const upcomingTasks = activeTasks.filter(t => t.deadline);
            
            const statTasksEl = document.getElementById('stat-tasks');
            const statTasksTotEl = document.getElementById('stat-tasks-total');
            if (statTasksEl) statTasksEl.innerText = Math.min(activeTasks.length, 5);
            if (statTasksTotEl) statTasksTotEl.innerText = '/ ' + activeTasks.length;
            
            // Update Deadlines Stat (Tenggat Waktu)
            const deadlineStatEl = document.querySelector('div.grid > div:nth-child(2) > div.text-2xl.font-semibold');
            if (deadlineStatEl) {
                if (upcomingTasks.length > 0) {
                    // sort by date ascending
                    upcomingTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
                    const nearest = upcomingTasks[0];
                    const diffDays = Math.ceil((new Date(nearest.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                    
                    if (diffDays < 0) {
                        deadlineStatEl.innerText = 'Terlewat';
                        deadlineStatEl.classList.add('text-danger');
                        deadlineStatEl.classList.remove('text-warning');
                    } else if (diffDays === 0) {
                        deadlineStatEl.innerText = 'Hari ini';
                        deadlineStatEl.classList.add('text-warning');
                        deadlineStatEl.classList.remove('text-danger');
                    } else {
                        deadlineStatEl.innerText = diffDays + ' Hari';
                        deadlineStatEl.classList.remove('text-danger', 'text-warning');
                    }
                } else {
                    deadlineStatEl.innerText = '-';
                    deadlineStatEl.classList.remove('text-danger', 'text-warning');
                }
            }
            
            let tHtml = '';
            // Show only the 5 most recently created or high priority tasks
            // For now, let's sort by priority then date
            activeTasks.sort((a, b) => {
                const p = { 'Tinggi': 3, 'Sedang': 2, 'Rendah': 1 };
                return (p[b.priority] || 0) - (p[a.priority] || 0);
            });
            
            activeTasks.slice(0, 5).forEach(task => {
                let priorityBadge = task.priority === 'Tinggi' ? 'bg-red-50 text-red-700 ring-red-600/10' :
                                    (task.priority === 'Sedang' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' : 'bg-gray-50 text-gray-600 ring-gray-500/10');
                tHtml += \`
                <li class="p-4 hover:bg-gray-50 transition-colors group flex items-start cursor-pointer dark:hover:bg-[#27272a]" onclick="location.href='tasks.html'">
                    <div class="pt-0.5" onclick="event.stopPropagation()">
                        <input type="checkbox" onchange="completeTaskFromDashboard('\${task.id}')" class="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer transition-all dark:bg-surface dark:border-[#3f3f46]">
                    </div>
                    <div class="ml-3 flex-1">
                        <p class="text-sm font-medium text-primary">\${task.title}</p>
                        <div class="flex items-center gap-3 mt-1.5">
                            <span class="text-xs text-gray-500 dark:text-gray-400">Tugas</span>
                            <span class="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset \${priorityBadge} dark:bg-[#09090b] dark:text-gray-400 dark:ring-gray-700">\${task.priority || 'Rendah'}</span>
                        </div>
                    </div>
                </li>\`;
            });
            if (tHtml !== '') {
                taskContainer.innerHTML = tHtml;
            } else {
                taskContainer.innerHTML = '<li class="p-4"><p class="text-sm text-gray-500">Tidak ada tugas yang sedang berjalan.</p></li>';
            }
        }
    } catch(e) {
        console.error("Dashboard failed to fetch OS_DB:", e);
    }
}

window.completeTaskFromDashboard = async function(id) {
    try {
        const t = await OS_DB.getTasks();
        const task = t.find(x => x.id === id);
        if(task) {
            task.status = 'done';
            await OS_DB.updateTask(id, task);
            logActivity('task', task.title);
            updateDashboardStats();
            if(window.showToast) window.showToast('Tugas diselesaikan!', 'success');
        }
    } catch(e) {
        console.error("Gagal menyelesaikan tugas", e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Slight delay to ensure DB is initialized
    setTimeout(() => {
        renderActivityTimeline();
        updateDashboardStats();
    }, 100);
});
`;

fs.writeFileSync('D:/PersonalOS/js/dashboard_app.js', newDashboardApp);
console.log('Migrated dashboard_app.js to IndexedDB');
