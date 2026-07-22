
// js/inbox_app.js
let inboxItems = [];

async function loadInbox() {
    try {
        inboxItems = await db.inbox.orderBy('createdAt').reverse().toArray();
        renderInbox();
    } catch(e) {
        console.error('Error loading inbox', e);
    }
}

function renderInbox() {
    const container = document.getElementById('inbox-container');
    const countEl = document.getElementById('inbox-count');
    if (!container) return;

    if (countEl) countEl.textContent = inboxItems.length;

    if (inboxItems.length === 0) {
        container.innerHTML = `
            <div class="text-center py-10">
                <p class="text-gray-400 dark:text-gray-500">Kotak masuk kosong. Anda sudah membereskan semuanya!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = inboxItems.map(item => `
        <div class="group bg-white dark:bg-surface p-4 rounded-xl border border-border dark:border-[#27272a] shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-id="${item.id}">
            <div class="flex-1">
                <p class="text-sm font-medium text-primary whitespace-pre-wrap">${escapeHtml(item.content)}</p>
                <span class="text-[10px] text-gray-400 mt-2 block">${timeAgo(item.createdAt)}</span>
            </div>
            <div class="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="convertInboxItem('${item.id}', 'task')" class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-border rounded-lg transition-colors whitespace-nowrap dark:text-gray-400 dark:bg-[#09090b] dark:hover:bg-[#27272a] dark:border-[#27272a]">
                    + Tugas
                </button>
                <button onclick="convertInboxItem('${item.id}', 'note')" class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-border rounded-lg transition-colors whitespace-nowrap dark:text-gray-400 dark:bg-[#09090b] dark:hover:bg-[#27272a] dark:border-[#27272a]">
                    + Catatan
                </button>
                <button onclick="deleteInboxItem('${item.id}')" class="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        </div>
    `).join('');
}

async function addInboxItem() {
    const input = document.getElementById('inbox-input');
    const content = input.value.trim();
    if (!content) return;

    const newItem = {
        id: 'inbox_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        content: content,
        type: 'text',
        createdAt: new Date().toISOString()
    };

    try {
        await db.inbox.put(newItem);
        input.value = '';
        await loadInbox();
    } catch(e) {
        console.error('Failed to add inbox', e);
    }
}

async function deleteInboxItem(id) {
    try {
        await db.inbox.delete(id);
        await loadInbox();
    } catch(e) {
        console.error('Failed to delete', e);
    }
}

async function convertInboxItem(id, type) {
    const item = inboxItems.find(i => i.id === id);
    if (!item) return;

    try {
        if (type === 'task') {
            // Check tasks format
            const savedCols = localStorage.getItem('task_columns');
            let cols = savedCols ? JSON.parse(savedCols) : [];
            let defaultCol = cols.length > 0 ? cols[0] : { id: 'col_1', title: 'Akan Dikerjakan' };
            
            const task = {
                id: 'task_' + Date.now(),
                title: item.content.split('\n')[0],
                desc: item.content,
                status: defaultCol.title,
                colId: defaultCol.id,
                priority: 'Normal',
                deadline: '',
                timeStart: '',
                timeEnd: '',
                subtasks: [],
                projectId: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await db.tasks.put(task);
            if(window.showToast) window.showToast('Berhasil dibuat sebagai Tugas!', 'success');
        } else if (type === 'note') {
            const note = {
                id: 'note_' + Date.now(),
                title: item.content.split('\n')[0] || 'Catatan Baru',
                content: item.content,
                folder: 'Personal',
                isPinned: false,
                projectId: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await db.notes.put(note);
            if(window.showToast) window.showToast('Berhasil dibuat sebagai Catatan!', 'success');
        }
        
        // Remove from inbox after converting
        await deleteInboxItem(id);
    } catch (e) {
        console.error('Conversion failed', e);
    }
}

function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return diffMins + ' menit yang lalu';
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return diffHrs + ' jam yang lalu';
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return 'Kemarin';
    return diffDays + ' hari yang lalu';
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {
    loadInbox();
});
