// command_palette.js - Global Command Palette (Ctrl+K)

(function() {
    // Inject modal HTML
    const html = `
    <div id="cmd-palette-overlay" class="fixed inset-0 z-[9999] hidden" aria-modal="true" role="dialog">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="closeCommandPalette()"></div>
        <div class="absolute top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
            <div class="bg-white dark:bg-[#18181b] rounded-2xl shadow-2xl border border-border dark:border-[#27272a] overflow-hidden">
                <!-- Search Input -->
                <div class="flex items-center gap-3 px-4 py-3.5 border-b border-border dark:border-[#27272a]">
                    <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input 
                        id="cmd-palette-input" 
                        type="text" 
                        placeholder="Cari halaman, aksi, atau fitur..." 
                        class="flex-1 bg-transparent text-sm text-primary placeholder-gray-400 focus:outline-none dark:text-gray-200"
                        oninput="filterCommandPalette(this.value)"
                        onkeydown="handleCmdPaletteKey(event)"
                        autocomplete="off"
                    >
                    <kbd class="hidden sm:inline text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-[#27272a] text-gray-500 dark:text-gray-400 rounded border border-gray-300 dark:border-[#3f3f46]">ESC</kbd>
                </div>
                <!-- Results -->
                <div id="cmd-palette-results" class="max-h-80 overflow-y-auto py-2"></div>
                <!-- Footer -->
                <div class="px-4 py-2 border-t border-border dark:border-[#27272a] flex items-center gap-4">
                    <span class="text-[10px] text-gray-400 flex items-center gap-1"><kbd class="px-1 bg-gray-100 dark:bg-[#27272a] rounded">↑↓</kbd> navigasi</span>
                    <span class="text-[10px] text-gray-400 flex items-center gap-1"><kbd class="px-1 bg-gray-100 dark:bg-[#27272a] rounded">Enter</kbd> pilih</span>
                    <span class="text-[10px] text-gray-400 flex items-center gap-1"><kbd class="px-1 bg-gray-100 dark:bg-[#27272a] rounded">Esc</kbd> tutup</span>
                </div>
            </div>
        </div>
    </div>

    
    

    <!-- Quick Add Modal -->
    <div id="quick-add-modal" class="fixed inset-0 z-[9998] hidden">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="closeQuickAdd()"></div>
        <div class="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-md px-4">
            <div class="bg-white dark:bg-[#18181b] rounded-2xl shadow-2xl border border-border dark:border-[#27272a] overflow-hidden">
                <div class="px-5 py-4 border-b border-border dark:border-[#27272a] flex items-center justify-between">
                    <h3 class="text-sm font-bold text-primary">Tambah Cepat</h3>
                    <button onclick="closeQuickAdd()" class="text-gray-400 hover:text-primary transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <!-- Type selector -->
                <div class="p-4 border-b border-border dark:border-[#27272a]">
                    <div class="flex bg-gray-100 dark:bg-[#09090b] p-1 rounded-lg gap-1">
                        <button id="qa-type-task" onclick="switchQaType('task')" class="flex-1 px-2 py-1.5 text-xs font-semibold bg-white dark:bg-surface shadow-sm rounded-md text-primary transition-all">📋 Tugas</button>
                        <button id="qa-type-note" onclick="switchQaType('note')" class="flex-1 px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-all dark:text-gray-400">📝 Catatan</button>
                        <button id="qa-type-expense" onclick="switchQaType('expense')" class="flex-1 px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-all dark:text-gray-400">💸 Pengeluaran</button>
                        <button id="qa-type-income" onclick="switchQaType('income')" class="flex-1 px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-all dark:text-gray-400">💰 Pemasukan</button>
                    </div>
                </div>
                <div class="p-5 space-y-3">
                    <div>
                        <input id="qa-title" type="text" placeholder="Judul / Deskripsi..." 
                            class="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#09090b] border border-border dark:border-[#27272a] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            onkeydown="if(event.key==='Enter') saveQuickAdd()">
                    </div>
                    <div id="qa-amount-row" class="hidden">
                        <input id="qa-amount" type="number" placeholder="Jumlah (Rp)..." 
                            class="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#09090b] border border-border dark:border-[#27272a] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            onkeydown="if(event.key==='Enter') saveQuickAdd()">
                    </div>
                    <div id="qa-details-toggle" class="text-center pt-1">
                        <button onclick="document.getElementById('qa-details-container').classList.toggle('hidden')" class="text-xs text-brand hover:underline font-medium">Tampilkan Detail (Opsional)</button>
                    </div>
                    <div id="qa-details-container" class="hidden space-y-3 mt-2 pt-3 border-t border-border dark:border-[#27272a]">
                        <div id="qa-date-row">
                            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tanggal / Deadline</label>
                            <input id="qa-date" type="date" 
                                class="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#09090b] border border-border dark:border-[#27272a] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        </div>
                        <div id="qa-category-row">
                            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Kategori</label>
                            <select id="qa-category" 
                                class="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#09090b] border border-border dark:border-[#27272a] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="Kerja">Kerja</option>
                                <option value="Personal">Personal</option>
                                <option value="Ide">Ide</option>
                                <option value="Jurnal">Jurnal</option>
                                <option value="Makanan">Makanan</option>
                                <option value="Transportasi">Transportasi</option>
                                <option value="Gaji">Gaji</option>
                                <option value="Lainnya" selected>Lainnya</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="px-5 py-4 bg-gray-50 dark:bg-[#09090b] border-t border-border dark:border-[#27272a] flex justify-end gap-2">
                    <button onclick="closeQuickAdd()" class="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg dark:text-gray-400 dark:bg-surface dark:border-[#3f3f46]">Batal</button>
                    <button onclick="saveQuickAdd()" class="px-4 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-gray-800 dark:bg-[#FAFAFA] dark:text-[#09090b]">Simpan</button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Inject on DOM ready
    function inject() {
        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);
        buildCommandList();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }

    // -----------------------------------------------
    // Command List
    // -----------------------------------------------
    const COMMANDS = [
        // Navigation
        { type: 'nav', label: 'Dasbor', icon: '🏠', shortcut: '', action: () => { location.href = 'index.html'; } },
        { type: 'nav', label: 'Tugas', icon: '✅', shortcut: '', action: () => { location.href = 'tasks.html'; } },
        { type: 'nav', label: 'Catatan', icon: '📝', shortcut: '', action: () => { location.href = 'notes.html'; } },
        { type: 'nav', label: 'Kalender', icon: '📅', shortcut: '', action: () => { location.href = 'calendar.html'; } },
        { type: 'nav', label: 'Keuangan', icon: '💰', shortcut: '', action: () => { location.href = 'finance.html'; } },
        { type: 'nav', label: 'Inbox', icon: '📬', shortcut: '', action: () => { location.href = 'inbox.html'; } },
        { type: 'nav', label: 'Profil', icon: '👤', shortcut: '', action: () => { location.href = 'profile.html'; } },
        { type: 'nav', label: 'Pengaturan', icon: '⚙️', shortcut: '', action: () => { location.href = 'settings.html'; } },
        // Actions
        { type: 'action', label: 'Tambah Tugas Baru', icon: '➕', shortcut: 'Ctrl+N', action: () => { closeCommandPalette(); openQuickAdd('task'); } },
        { type: 'action', label: 'Tambah Catatan Baru', icon: '📄', shortcut: 'Ctrl+N', action: () => { closeCommandPalette(); openQuickAdd('note'); } },
        { type: 'action', label: 'Tambah Pengeluaran', icon: '💸', shortcut: '', action: () => { closeCommandPalette(); openQuickAdd('expense'); } },
        { type: 'action', label: 'Tambah Pemasukan', icon: '💵', shortcut: '', action: () => { closeCommandPalette(); openQuickAdd('income'); } },
        { type: 'action', label: 'Toggle Dark Mode', icon: '🌙', shortcut: '', action: () => { closeCommandPalette(); if(typeof toggleDarkMode === 'function') toggleDarkMode(); } },
        { type: 'action', label: 'Export Data', icon: '📦', shortcut: '', action: () => { closeCommandPalette(); if(typeof exportAllData === 'function') exportAllData(); else location.href = 'settings.html'; } },
    ];

    let filteredCommands = [...COMMANDS];
    let selectedIndex = 0;

    window.buildCommandList = function() {
        filteredCommands = [...COMMANDS];
        renderCommandList();
    };

    window.filterCommandPalette = function(query) {
        if (!query.trim()) {
            filteredCommands = [...COMMANDS];
        } else {
            const q = query.toLowerCase();
            filteredCommands = COMMANDS.filter(c => c.label.toLowerCase().includes(q));
        }
        selectedIndex = 0;
        renderCommandList();
    };

    function renderCommandList() {
        const container = document.getElementById('cmd-palette-results');
        if (!container) return;

        if (filteredCommands.length === 0) {
            container.innerHTML = `<div class="px-4 py-8 text-center text-sm text-gray-400">Tidak ada hasil untuk pencarian ini</div>`;
            return;
        }

        let navHtml = '';
        let actionHtml = '';

        filteredCommands.forEach((cmd, i) => {
            const isSelected = i === selectedIndex;
            const bg = isSelected ? 'bg-gray-100 dark:bg-[#27272a]' : 'hover:bg-gray-50 dark:hover:bg-[#27272a]/50';
            const item = `
                <div onclick="selectCommand(${i})" class="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${bg} group" data-cmd-index="${i}">
                    <span class="text-base w-6 text-center">${cmd.icon}</span>
                    <span class="flex-1 text-sm font-medium text-primary dark:text-gray-200">${cmd.label}</span>
                    ${cmd.shortcut ? `<kbd class="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-[#09090b] text-gray-500 rounded">${cmd.shortcut}</kbd>` : ''}
                </div>
            `;
            if (cmd.type === 'nav') navHtml += item;
            else actionHtml += item;
        });

        let html = '';
        if (navHtml) html += `<div class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Navigasi</div>${navHtml}`;
        if (actionHtml) html += `<div class="px-4 py-1.5 mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Aksi</div>${actionHtml}`;
        container.innerHTML = html;

        // Scroll selected into view
        const selectedEl = container.querySelector(`[data-cmd-index="${selectedIndex}"]`);
        if (selectedEl) selectedEl.scrollIntoView({ block: 'nearest' });
    }

    window.selectCommand = function(index) {
        if (filteredCommands[index]) {
            filteredCommands[index].action();
            closeCommandPalette();
        }
    };

    window.handleCmdPaletteKey = function(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, filteredCommands.length - 1);
            renderCommandList();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            renderCommandList();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            selectCommand(selectedIndex);
        } else if (e.key === 'Escape') {
            closeCommandPalette();
        }
    };

    window.openCommandPalette = function() {
        const overlay = document.getElementById('cmd-palette-overlay');
        if (!overlay) return;
        overlay.classList.remove('hidden');
        selectedIndex = 0;
        const input = document.getElementById('cmd-palette-input');
        if (input) { input.value = ''; input.focus(); }
        filteredCommands = [...COMMANDS];
        renderCommandList();
    };

    window.closeCommandPalette = function() {
        const overlay = document.getElementById('cmd-palette-overlay');
        if (overlay) overlay.classList.add('hidden');
    };

    // -----------------------------------------------
    // Quick Add Modal
    // -----------------------------------------------
    let currentQaType = 'task';

    window.openQuickAdd = function(type = 'task') {
        const modal = document.getElementById('quick-add-modal');
        if (!modal) return;
        modal.classList.remove('hidden');
        switchQaType(type);
        setTimeout(() => {
            const inp = document.getElementById('qa-title');
            if (inp) inp.focus();
        }, 50);
    };

    window.closeQuickAdd = function() {
        const modal = document.getElementById('quick-add-modal');
        if (modal) modal.classList.add('hidden');
    };

    window.switchQaType = function(type) {
        currentQaType = type;
        const types = ['task', 'note', 'expense', 'income'];
        types.forEach(t => {
            const btn = document.getElementById('qa-type-' + t);
            if (btn) {
                if (t === type) {
                    btn.className = 'flex-1 px-2 py-1.5 text-xs font-semibold bg-white dark:bg-surface shadow-sm rounded-md text-primary transition-all';
                } else {
                    btn.className = 'flex-1 px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-all dark:text-gray-400';
                }
            }
        });
        const amountRow = document.getElementById('qa-amount-row');
        if (amountRow) {
            if (type === 'expense' || type === 'income') {
                amountRow.classList.remove('hidden');
            } else {
                amountRow.classList.add('hidden');
            }
        }
        const titleInput = document.getElementById('qa-title');
        const placeholders = {
            task: 'Nama tugas baru...',
            note: 'Judul catatan...',
            expense: 'Keterangan pengeluaran...',
            income: 'Keterangan pemasukan...'
        };
        if (titleInput) titleInput.placeholder = placeholders[type] || 'Judul...';

        // Adjust category options based on type
        const catSelect = document.getElementById('qa-category');
        if (catSelect) {
            catSelect.innerHTML = '';
            let options = [];
            if (type === 'task') options = ['Kerja', 'Personal', 'Lainnya'];
            else if (type === 'note') options = ['Ide', 'Jurnal', 'Kerja', 'Personal', 'Lainnya'];
            else if (type === 'expense') options = ['Makanan', 'Transportasi', 'Hiburan', 'Tagihan', 'Belanja', 'Lainnya'];
            else if (type === 'income') options = ['Gaji', 'Bonus', 'Investasi', 'Lainnya'];
            
            options.forEach(opt => {
                catSelect.innerHTML += `<option value="${opt}">${opt}</option>`;
            });
            catSelect.value = options[0];
        }
    };

    window.saveQuickAdd = function() {
        const title = (document.getElementById('qa-title') || {}).value || '';
        const amount = parseFloat((document.getElementById('qa-amount') || {}).value) || 0;

        if (!title.trim()) {
            if (window.showToast) window.showToast('Judul tidak boleh kosong', 'warning');
            return;
        }

        const id = 'qa_' + Date.now();
        const now = new Date().toISOString();
        const inputDate = (document.getElementById('qa-date') || {}).value;
        const inputCategory = (document.getElementById('qa-category') || {}).value || 'Lainnya';
        const finalDate = inputDate ? new Date(inputDate).toISOString() : now;

        if (currentQaType === 'task') {
            // Check if we use tasks_board_v2 instead of quick_tasks array
            let boardData = { columns: [] };
            try {
                boardData = JSON.parse(localStorage.getItem('tasks_board_v2'));
            } catch(e) {}
            
            if (boardData && boardData.columns && boardData.columns.length > 0) {
                // Find todo column or first column
                let col = boardData.columns.find(c => c.id === 'col-todo') || boardData.columns[0];
                if (col) {
                    if (!col.tasks) col.tasks = [];
                    col.tasks.push({
                        id, 
                        title: title.trim(), 
                        status: 'Todo', 
                        priority: 'Sedang', 
                        deadline: inputDate || '', 
                        desc: '', 
                        category: inputCategory,
                        subtasks: []
                    });
                    localStorage.setItem('tasks_board_v2', JSON.stringify(boardData));
                }
            } else {
                // Fallback to old inbox
                const tasks = JSON.parse(localStorage.getItem('quick_tasks') || '[]');
                tasks.push({ id, title: title.trim(), status: 'todo', priority: 'Rendah', date: finalDate, category: inputCategory });
                localStorage.setItem('quick_tasks', JSON.stringify(tasks));
            }
            if (window.logActivity) window.logActivity('task', 'Tugas ditambahkan: ' + title.trim());
            if (window.showToast) window.showToast('Tugas berhasil ditambahkan!', 'success');

        } else if (currentQaType === 'note') {
            const notes = JSON.parse(localStorage.getItem('personal_os_notes') || localStorage.getItem('user_notes') || '[]');
            notes.unshift({ 
                id, 
                title: title.trim(), 
                content: '', 
                category: inputCategory, 
                date: new Date(finalDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) + ', ' + new Date(finalDate).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})
            });
            // Try saving to personal_os_notes first since we updated it
            localStorage.setItem('personal_os_notes', JSON.stringify(notes));
            localStorage.setItem('user_notes', JSON.stringify(notes)); // Backwards compatibility
            if (window.logActivity) window.logActivity('note', 'Catatan dibuat: ' + title.trim());
            if (window.showToast) window.showToast('Catatan berhasil disimpan!', 'success');

        } else if (currentQaType === 'expense' || currentQaType === 'income') {
            const txType = currentQaType === 'expense' ? 'pengeluaran' : 'pemasukan';
            const transactions = JSON.parse(localStorage.getItem('finance_transactions') || '[]');
            transactions.push({ id, type: txType, amount, notes: title.trim(), account: '', category: inputCategory, date: finalDate });
            localStorage.setItem('finance_transactions', JSON.stringify(transactions));
            if (window.logActivity) window.logActivity('finance', (txType === 'pengeluaran' ? 'Pengeluaran' : 'Pemasukan') + ' dicatat: ' + title.trim());
            if (window.showToast) window.showToast((txType === 'pengeluaran' ? 'Pengeluaran' : 'Pemasukan') + ' berhasil dicatat!', 'success');
        }

        closeQuickAdd();
        document.getElementById('qa-title').value = '';
        const amtEl = document.getElementById('qa-amount');
        if (amtEl) amtEl.value = '';
        const dateEl = document.getElementById('qa-date');
        if (dateEl) dateEl.value = '';
        document.getElementById('qa-details-container').classList.add('hidden');
    };

    // -----------------------------------------------
    // Activity Log Global Function
    // -----------------------------------------------
    window.logActivity = function(type, label) {
        const log = JSON.parse(localStorage.getItem('activity_log') || '[]');
        log.unshift({ type, label, time: new Date().toISOString() });
        // Keep only last 50
        localStorage.setItem('activity_log', JSON.stringify(log.slice(0, 50)));
    };

    // -----------------------------------------------
    // Global Keyboard Shortcut: Ctrl+K overrides main.js
    // -----------------------------------------------
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            e.stopPropagation();
            const overlay = document.getElementById('cmd-palette-overlay');
            if (overlay && overlay.classList.contains('hidden')) {
                openCommandPalette();
            } else {
                closeCommandPalette();
            }
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'n') {
            e.preventDefault();
            e.stopPropagation();
            const qaModal = document.getElementById('quick-add-modal');
            if (qaModal && qaModal.classList.contains('hidden')) {
                openQuickAdd('task');
            } else {
                closeQuickAdd();
            }
        }
        if (e.key === 'Escape') {
            closeCommandPalette();
            closeQuickAdd();
        }
    }, true); // capture phase to intercept before main.js

})();
