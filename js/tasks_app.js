// tasks_app.js - Complete rewrite fixing all issues
// 1. Drag & drop cards between columns ✓
// 2. Drag & drop reorder columns/lists ✓
// 3. Edit list titles (contenteditable) ✓
// 4. List view checkbox persistence ✓
// 5. Task detail popup with edit capability ✓
// 6. "Tambah Daftar Baru" position (top, beside last column) ✓
// 7-8. Theme is consistent (data stored as JSON, not HTML) ✓

// =============================================
// DATA MODEL - JSON-based, not HTML-based
// =============================================

let boardData = {
    columns: [
        { id: 'col-todo', title: 'Akan Dikerjakan', color: 'bg-gray-400', tasks: [] },
        { id: 'col-inprogress', title: 'Sedang Dikerjakan', color: 'bg-yellow-400', tasks: [] },
        { id: 'col-done', title: 'Selesai', color: 'bg-green-500', tasks: [] }
    ]
};

let currentEditTaskId = null;
let currentEditColumnId = null;

function generateId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function saveData() {
    localStorage.setItem('tasks_board_v2', JSON.stringify(boardData));
}

function loadData() {
    const saved = localStorage.getItem('tasks_board_v2');
    if (saved) {
        try {
            boardData = JSON.parse(saved);
        } catch(e) {
            console.warn('Failed to parse tasks data, using defaults');
        }
    } else {
        // Default sample tasks
        boardData.columns[0].tasks = [
            { id: generateId(), title: 'Review Dokumen Proyek Baru', priority: 'Rendah', status: 'Todo', deadline: '', desc: '', subtasks: [] },
        ];
        boardData.columns[1].tasks = [
            { id: generateId(), title: 'Selesaikan Desain UI untuk Dasbor', priority: 'Tinggi', status: 'In Progress', deadline: '', desc: 'Membuat tampilan yang modern dan responsif untuk halaman dasbor.', subtasks: [
                { id: generateId(), text: 'Buat HTML untuk halaman Index', done: true },
                { id: generateId(), text: 'Desain halaman Tasks & Panel', done: false }
            ] },
        ];
        saveData();
    }
}

// =============================================
// RENDER BOARD
// =============================================

function renderBoard() {
    const container = document.getElementById('board-container');
    if (!container) return;

    container.innerHTML = '';

    boardData.columns.forEach(col => {
        const colEl = document.createElement('div');
        colEl.className = 'w-72 shrink-0 flex flex-col';
        colEl.dataset.colId = col.id;

        const taskCount = col.tasks.length;
        colEl.innerHTML = `
            <div class="flex items-center justify-between mb-3 px-1 col-header" style="cursor:grab">
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full ${col.color}"></div>
                    <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 outline-none cursor-text col-title" 
                        contenteditable="true" 
                        spellcheck="false"
                        data-col-id="${col.id}"
                        onblur="saveColTitle(this)"
                        onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur()}"
                        >${escapeHtml(col.title)}</h3>
                    <span class="text-gray-400 font-normal text-xs col-count">${taskCount}</span>
                </div>
                <div class="flex items-center gap-1">
                    <button onclick="openTaskDetail(null, '${col.id}')" class="text-gray-400 hover:text-primary transition-colors p-1 hover:bg-gray-100 rounded dark:hover:bg-[#27272a]" title="Tambah tugas">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                    <button onclick="deleteColumn('${col.id}')" class="text-gray-400 hover:text-danger transition-colors p-1 hover:bg-red-50 rounded dark:hover:bg-red-500/10" title="Hapus daftar">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            </div>
            <div class="space-y-2 min-h-[120px] task-drop-zone flex-1" data-col-id="${col.id}">
                ${col.tasks.map(task => renderTaskCard(task, col.id)).join('')}
            </div>
        `;
        container.appendChild(colEl);
    });

    // "Tambah Daftar Baru" — inline, beside last column
    const addColEl = document.createElement('div');
    addColEl.className = 'w-60 shrink-0 flex flex-col ignore-sort pt-0';
    addColEl.innerHTML = `
        <button onclick="addNewColumn()" class="w-full mt-0 py-3 px-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm font-medium hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 dark:border-[#27272a] dark:text-gray-500 dark:hover:border-gray-500 dark:hover:text-gray-300 h-fit">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Tambah Daftar Baru
        </button>
    `;
    container.appendChild(addColEl);

    initSortable();
    updateListView();
}

function renderTaskCard(task, colId) {
    const priorityBadge = getPriorityBadge(task.priority);
    const deadlineStr = task.deadline ? formatDeadline(task.deadline) : '';
    const subtaskDone = task.subtasks ? task.subtasks.filter(s => s.done).length : 0;
    const subtaskTotal = task.subtasks ? task.subtasks.length : 0;

    return `
        <div class="bg-white dark:bg-surface border border-gray-100 dark:border-[#27272a] rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer group task-card" 
             data-task-id="${task.id}" 
             data-col-id="${colId}"
             onclick="openTaskDetail('${task.id}', '${colId}')">
            <h4 class="text-sm font-medium text-primary mb-2.5 line-clamp-2 leading-snug">${escapeHtml(task.title)}</h4>
            ${subtaskTotal > 0 ? `
            <div class="w-full bg-gray-100 dark:bg-[#27272a] rounded-full h-1 mb-2.5">
                <div class="bg-success h-1 rounded-full transition-all" style="width:${subtaskTotal > 0 ? Math.round(subtaskDone/subtaskTotal*100) : 0}%"></div>
            </div>` : ''}
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                    ${priorityBadge}
                </div>
                ${deadlineStr ? `<span class="text-[10px] font-medium text-gray-400 dark:text-gray-500">${deadlineStr}</span>` : ''}
            </div>
        </div>
    `;
}

function getPriorityBadge(priority) {
    const map = {
        'Tinggi': 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
        'Sedang': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
        'Rendah': 'bg-gray-100 text-gray-500 dark:bg-[#27272a] dark:text-gray-400'
    };
    const cls = map[priority] || map['Rendah'];
    return `<span class="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${cls}">${priority || 'Rendah'}</span>`;
}

function formatDeadline(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hari ini';
    if (diff === 1) return 'Besok';
    if (diff === -1) return 'Kemarin';
    if (diff < 0) return `${Math.abs(diff)} hari lalu`;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// =============================================
// INIT SORTABLE (Drag & Drop)
// =============================================

let sortableInstances = [];

function initSortable() {
    if (typeof Sortable === 'undefined') return;

    // Destroy existing instances
    sortableInstances.forEach(s => { try { s.destroy(); } catch(e) {} });
    sortableInstances = [];

    // 1. Make task cards sortable within/between columns
    document.querySelectorAll('.task-drop-zone').forEach(zone => {
        const s = Sortable.create(zone, {
            group: 'tasks',
            animation: 150,
            ghostClass: 'opacity-40',
            delay: 100, // delay to prevent accidental drags on click
            delayOnTouchOnly: true,
            onEnd: function(evt) {
                const taskId = evt.item.dataset.taskId;
                const fromColId = evt.from.dataset.colId;
                const toColId = evt.to.dataset.colId;
                const newIndex = evt.newIndex;

                // Move task in data model
                const fromCol = boardData.columns.find(c => c.id === fromColId);
                const toCol = boardData.columns.find(c => c.id === toColId);
                if (!fromCol || !toCol) return;

                const taskIdx = fromCol.tasks.findIndex(t => t.id === taskId);
                if (taskIdx === -1) return;

                const [task] = fromCol.tasks.splice(taskIdx, 1);
                toCol.tasks.splice(newIndex, 0, task);

                saveData();
                renderBoard(); // Re-render to update counts
            }
        });
        sortableInstances.push(s);
    });

    // 2. Make columns reorderable
    const boardContainer = document.getElementById('board-container');
    if (boardContainer) {
        const s = Sortable.create(boardContainer, {
            animation: 200,
            handle: '.col-header',
            draggable: '[data-col-id]',
            filter: '.ignore-sort',
            ghostClass: 'opacity-30',
            onEnd: function(evt) {
                // Reorder boardData.columns based on new DOM order
                const newOrder = [];
                boardContainer.querySelectorAll('[data-col-id]').forEach(el => {
                    const colId = el.dataset.colId;
                    const col = boardData.columns.find(c => c.id === colId);
                    if (col) newOrder.push(col);
                });
                boardData.columns = newOrder;
                saveData();
                renderBoard();
            }
        });
        sortableInstances.push(s);
    }
}

// =============================================
// COLUMN MANAGEMENT
// =============================================

function saveColTitle(el) {
    const colId = el.dataset.colId;
    const col = boardData.columns.find(c => c.id === colId);
    if (col) {
        col.title = el.innerText.trim() || 'Daftar Baru';
        el.innerText = col.title;
        saveData();
        updateListView();
    }
}

function addNewColumn() {
    const col = {
        id: 'col_' + Date.now(),
        title: 'Daftar Baru',
        color: 'bg-blue-400',
        tasks: []
    };
    boardData.columns.push(col);
    saveData();
    renderBoard();

    // Auto-focus the title of the new column
    setTimeout(() => {
        const titles = document.querySelectorAll('.col-title');
        const lastTitle = titles[titles.length - 1];
        if (lastTitle) {
            lastTitle.focus();
            document.execCommand('selectAll', false, null);
        }
    }, 100);
}

function deleteColumn(colId) {
    const col = boardData.columns.find(c => c.id === colId);
    if (!col) return;
    if (col.tasks.length > 0 && !confirm(`Hapus daftar "${col.title}" beserta ${col.tasks.length} tugas di dalamnya?`)) return;
    boardData.columns = boardData.columns.filter(c => c.id !== colId);
    saveData();
    renderBoard();
    if (window.showToast) window.showToast('Daftar berhasil dihapus', 'success');
}

// =============================================
// TASK DETAIL MODAL
// =============================================

function openTaskDetail(taskId, colId) {
    currentEditTaskId = taskId;
    currentEditColumnId = colId;

    const modal = document.getElementById('task-detail-modal');
    if (!modal) return;

    let task = null;
    if (taskId) {
        const col = boardData.columns.find(c => c.id === colId);
        if (col) task = col.tasks.find(t => t.id === taskId);
    }

    // Populate dynamic status dropdown
    const statusSelect = document.getElementById('td-status');
    if (statusSelect) {
        const targetColId = colId || (boardData.columns[0] ? boardData.columns[0].id : '');
        statusSelect.innerHTML = boardData.columns.map(c => `<option value="${c.id}" ${c.id === targetColId ? 'selected' : ''}>${escapeHtml(c.title)}</option>`).join('');
    }

    // Fill form
    document.getElementById('td-title').value = task ? task.title : '';
    document.getElementById('td-desc').value = task ? (task.desc || '') : '';
    document.getElementById('td-priority').value = task ? (task.priority || 'Rendah') : 'Rendah';
    document.getElementById('td-deadline').value = task ? (task.deadline || '') : '';
    document.getElementById('td-modal-title').textContent = task ? 'Detail Tugas' : 'Tugas Baru';

    // Render subtasks
    renderSubtasks(task ? task.subtasks || [] : []);

    // Show/hide delete button
    const deleteBtn = document.getElementById('td-delete-btn');
    if (deleteBtn) deleteBtn.style.display = task ? 'flex' : 'none';

    // Show modal
    modal.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('task-detail-modal-content').classList.remove('scale-95', 'opacity-0');
        document.getElementById('task-detail-modal-content').classList.add('scale-100', 'opacity-100');
        if (!task) document.getElementById('td-title').focus();
    }, 10);
}

function closeTaskDetail() {
    const modal = document.getElementById('task-detail-modal');
    const content = document.getElementById('task-detail-modal-content');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 200);
    currentEditTaskId = null;
    currentEditColumnId = null;
}

function saveTaskDetail() {
    const title = document.getElementById('td-title').value.trim();
    if (!title) {
        if (window.showToast) window.showToast('Judul tugas tidak boleh kosong', 'warning');
        return;
    }
    const desc = document.getElementById('td-desc').value.trim();
    const priority = document.getElementById('td-priority').value;
    const newColId = document.getElementById('td-status').value;
    const deadline = document.getElementById('td-deadline').value;

    // Get subtasks from DOM
    const subtasks = [];
    document.querySelectorAll('#td-subtasks-list .subtask-item').forEach(item => {
        const text = item.querySelector('.subtask-text').value.trim();
        const done = item.querySelector('.subtask-check').checked;
        if (text) subtasks.push({ id: generateId(), text, done });
    });

    if (currentEditTaskId) {
        // Update existing
        const col = boardData.columns.find(c => c.id === currentEditColumnId);
        if (col) {
            const taskIdx = col.tasks.findIndex(t => t.id === currentEditTaskId);
            if (taskIdx > -1) {
                const task = col.tasks[taskIdx];
                task.title = title;
                task.desc = desc;
                task.priority = priority;
                task.deadline = deadline;
                task.subtasks = subtasks;
                
                // If user changed status in dropdown, move to new column
                if (newColId && newColId !== currentEditColumnId) {
                    col.tasks.splice(taskIdx, 1);
                    const targetCol = boardData.columns.find(c => c.id === newColId);
                    if (targetCol) {
                        targetCol.tasks.push(task);
                    } else {
                        col.tasks.push(task); // fallback if not found
                    }
                }
            }
        }
        if (window.showToast) window.showToast('Tugas berhasil diperbarui!', 'success');
    } else {
        // New task
        const targetColId = newColId || currentEditColumnId;
        const col = boardData.columns.find(c => c.id === targetColId) || boardData.columns[0];
        if (col) {
            col.tasks.unshift({
                id: generateId(),
                title, desc, priority, deadline, subtasks
            });
        }
        if (window.showToast) window.showToast('Tugas baru berhasil ditambahkan!', 'success');
        if (window.logActivity) window.logActivity('task', 'Tugas dibuat: ' + title);
    }

    saveData();
    closeTaskDetail();
    renderBoard();
}

function deleteCurrentTask() {
    if (!currentEditTaskId || !currentEditColumnId) return;
    const col = boardData.columns.find(c => c.id === currentEditColumnId);
    if (!col) return;

    // Custom confirm via modal-style or showToast approach
    if (!confirm('Hapus tugas ini?')) return;
    col.tasks = col.tasks.filter(t => t.id !== currentEditTaskId);
    saveData();
    closeTaskDetail();
    renderBoard();
    if (window.showToast) window.showToast('Tugas berhasil dihapus', 'danger');
}

// =============================================
// SUBTASKS
// =============================================

function renderSubtasks(subtasks) {
    const list = document.getElementById('td-subtasks-list');
    if (!list) return;
    list.innerHTML = subtasks.map(s => createSubtaskHTML(s.text, s.done)).join('');
}

function createSubtaskHTML(text = '', done = false) {
    return `
        <div class="subtask-item flex items-center gap-2 group">
            <input type="checkbox" class="subtask-check w-4 h-4 rounded border-gray-300 text-primary cursor-pointer dark:border-[#3f3f46] shrink-0" ${done ? 'checked' : ''} onchange="this.closest('.subtask-item').querySelector('.subtask-text').classList.toggle('line-through', this.checked); this.closest('.subtask-item').querySelector('.subtask-text').classList.toggle('text-gray-400', this.checked);">
            <input type="text" class="subtask-text flex-1 bg-transparent border-none text-sm focus:outline-none text-primary ${done ? 'line-through text-gray-400' : ''}" value="${escapeHtml(text)}" placeholder="Teks subtugas...">
            <button onclick="this.closest('.subtask-item').remove()" class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-danger transition-all p-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
    `;
}

function addSubtask() {
    const list = document.getElementById('td-subtasks-list');
    if (!list) return;
    list.insertAdjacentHTML('beforeend', createSubtaskHTML());
    const inputs = list.querySelectorAll('.subtask-text');
    const last = inputs[inputs.length - 1];
    if (last) last.focus();
}

// =============================================
// LIST VIEW (synced from board data)
// =============================================

function updateListView() {
    const listView = document.getElementById('view-list');
    if (!listView) return;

    const container = listView.querySelector('.max-w-4xl');
    if (!container) return;

    let html = '';
    boardData.columns.forEach(col => {
        if (col.tasks.length === 0) return;
        const colorDot = col.color || 'bg-gray-400';
        html += `
            <div>
                <div class="flex items-center gap-2 mb-3 px-1 border-b border-border pb-2 dark:border-[#27272a]">
                    <div class="w-2 h-2 rounded-full ${colorDot}"></div>
                    <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">${escapeHtml(col.title)} <span class="text-gray-400 font-normal ml-1 text-xs">${col.tasks.length}</span></h3>
                </div>
                <div class="space-y-2">
                    ${col.tasks.map(task => renderListTaskItem(task, col.id)).join('')}
                </div>
            </div>
        `;
    });

    if (!html) {
        html = '<p class="text-sm text-gray-400 text-center py-12">Belum ada tugas. Tambah dari tampilan Board.</p>';
    }

    container.innerHTML = html;

    // Re-attach checkbox listeners
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', function() {
            const taskId = this.dataset.taskId;
            const colId = this.dataset.colId;
            const col = boardData.columns.find(c => c.id === colId);
            if (col) {
                const task = col.tasks.find(t => t.id === taskId);
                if (task) {
                    task.status = this.checked ? 'Done' : 'Todo';
                    saveData();
                    // Visual update
                    const titleEl = this.closest('.list-task-item').querySelector('.task-list-title');
                    if (titleEl) {
                        titleEl.classList.toggle('line-through', this.checked);
                        titleEl.classList.toggle('text-gray-400', this.checked);
                    }
                }
            }
        });
    });
}

function renderListTaskItem(task, colId) {
    const isDone = task.status === 'Done';
    const priorityBadge = getPriorityBadge(task.priority);
    const deadline = task.deadline ? formatDeadline(task.deadline) : '';

    return `
        <div class="list-task-item bg-white dark:bg-surface border border-border dark:border-[#27272a] rounded-xl p-3.5 flex items-center justify-between gap-3 hover:shadow-sm transition-shadow">
            <div class="flex items-center gap-3 flex-1 min-w-0">
                <input type="checkbox" 
                    ${isDone ? 'checked' : ''} 
                    data-task-id="${task.id}" 
                    data-col-id="${colId}"
                    onclick="event.stopPropagation()"
                    class="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer shrink-0 dark:border-[#3f3f46]">
                <div class="min-w-0 cursor-pointer" onclick="openTaskDetail('${task.id}', '${colId}')">
                    <h4 class="task-list-title text-sm font-medium text-primary truncate ${isDone ? 'line-through text-gray-400' : ''}">${escapeHtml(task.title)}</h4>
                    ${task.desc ? `<p class="text-xs text-gray-400 truncate mt-0.5">${escapeHtml(task.desc)}</p>` : ''}
                </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                ${priorityBadge}
                ${deadline ? `<span class="text-xs text-gray-400 whitespace-nowrap">${deadline}</span>` : ''}
            </div>
        </div>
    `;
}

// =============================================
// VIEW SWITCHER
// =============================================

function switchView(view) {
    const listBtn = document.getElementById('btn-view-list');
    const boardBtn = document.getElementById('btn-view-board');
    const listView = document.getElementById('view-list');
    const boardView = document.getElementById('view-board');

    if (!listView || !boardView) return;

    const activeClasses = ['font-semibold', 'bg-white', 'dark:bg-surface', 'shadow-sm', 'text-primary'];
    const inactiveClasses = ['font-medium', 'text-gray-500', 'dark:text-gray-400'];

    if (view === 'list') {
        listView.classList.remove('hidden');
        boardView.classList.add('hidden');
        listBtn.classList.add(...activeClasses);
        listBtn.classList.remove(...inactiveClasses);
        boardBtn.classList.remove(...activeClasses);
        boardBtn.classList.add(...inactiveClasses);
        updateListView();
    } else {
        boardView.classList.remove('hidden');
        listView.classList.add('hidden');
        boardBtn.classList.add(...activeClasses);
        boardBtn.classList.remove(...inactiveClasses);
        listBtn.classList.remove(...activeClasses);
        listBtn.classList.add(...inactiveClasses);
    }
    localStorage.setItem('tasks_view', view);
}

// =============================================
// TOAST (kept for backward compat)
// =============================================

function showToast(message, type = 'success') {
    if (window.showToast && window.showToast !== showToast) {
        window.showToast(message, type);
        return;
    }
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-24 right-4 z-[9999] flex flex-col gap-2';
        document.body.appendChild(container);
    }
    const colorMap = { success: 'text-success', danger: 'text-danger', warning: 'text-warning' };
    const toast = document.createElement('div');
    toast.className = 'flex items-center gap-3 p-4 rounded-xl border border-border shadow-lg bg-white dark:bg-surface transform translate-x-full transition-all duration-300 ease-out';
    toast.innerHTML = `<p class="text-sm font-medium text-primary ${colorMap[type] || ''}">${message}</p>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('translate-x-full'));
    setTimeout(() => { toast.classList.add('translate-x-full', 'opacity-0'); setTimeout(() => toast.remove(), 300); }, 3000);
}
window.showToast = showToast;

// =============================================
// INIT
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderBoard();

    // Restore last view
    const lastView = localStorage.getItem('tasks_view') || 'board';
    switchView(lastView);

    // Search
    const searchInput = document.getElementById('task-search-input');
    const searchResults = document.getElementById('task-search-results');
    const resultsList = document.getElementById('search-results-list');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 1) { searchResults.classList.add('hidden'); return; }

            const matches = [];
            boardData.columns.forEach(col => {
                col.tasks.forEach(task => {
                    if (task.title.toLowerCase().includes(query) || (task.desc || '').toLowerCase().includes(query)) {
                        matches.push({ task, colId: col.id, colTitle: col.title });
                    }
                });
            });

            if (matches.length > 0) {
                resultsList.innerHTML = matches.map((m, i) => `
                    <li class="p-3 hover:bg-gray-50 dark:hover:bg-[#27272a] cursor-pointer border-b border-border dark:border-[#27272a] last:border-0" data-index="${i}">
                        <p class="text-sm font-medium text-primary line-clamp-1">${escapeHtml(m.task.title)}</p>
                        <p class="text-xs text-gray-400 mt-0.5">${escapeHtml(m.colTitle)} • ${m.task.priority || 'Rendah'}</p>
                    </li>
                `).join('');
                searchResults.classList.remove('hidden');
                resultsList.querySelectorAll('li').forEach(li => {
                    li.addEventListener('click', () => {
                        const m = matches[parseInt(li.dataset.index)];
                        searchResults.classList.add('hidden');
                        searchInput.value = '';
                        openTaskDetail(m.task.id, m.colId);
                    });
                });
            } else {
                resultsList.innerHTML = '<li class="p-3 text-sm text-gray-400">Tidak ada tugas ditemukan</li>';
                searchResults.classList.remove('hidden');
            }
        });
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.add('hidden');
            }
        });
    }
});
