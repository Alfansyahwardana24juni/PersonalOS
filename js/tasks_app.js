// tasks_app.js - Handles complex task board logic (Sortable, Search, Modal Integration, New Lists)

let currentTaskCard = null;
let targetListForNewTask = null;

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Load Board State & Init Sortable ---
    const boardContainer = document.getElementById('board-container'); // Need to make sure it has this ID
    if (boardContainer) {
        const savedBoard = localStorage.getItem('state_board_full');
        if (savedBoard) {
            boardContainer.innerHTML = savedBoard;
        }
    }

        // Failsafe: Re-inject "Tambah Daftar Baru" if it was wiped by old localStorage
        if (boardContainer && !boardContainer.querySelector('.ignore-sort')) {
            const addBtnHtml = `
            <div class="w-80 shrink-0 flex flex-col ignore-sort">
                <button onclick="addNewList()" class="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 font-medium hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 dark:border-[#27272a] dark:text-gray-400 dark:hover:border-primary dark:hover:text-primary">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    Tambah Daftar Baru
                </button>
            </div>`;
            boardContainer.insertAdjacentHTML('beforeend', addBtnHtml);
        }


        
        // Failsafe: if the loaded state from an older version is missing the sortable-list class or contenteditable, add it!
        const cols = [
            document.getElementById('board-todo'),
            document.getElementById('board-inprogress'),
            document.getElementById('board-done')
        ];
        cols.forEach(col => {
            if (col) {
                if (!col.classList.contains('sortable-list')) col.classList.add('sortable-list');
                const titleEl = col.parentElement.querySelector('h3');
                if (titleEl && !titleEl.hasAttribute('contenteditable')) {
                    titleEl.setAttribute('contenteditable', 'true');
                    titleEl.setAttribute('onblur', 'saveFullBoardState()');
                }
            }
        });
        
        // Also check any dynamically added lists in the board container
        if (boardContainer) {
            boardContainer.querySelectorAll('.w-80.shrink-0.flex.flex-col:not(.ignore-sort)').forEach(colContainer => {
                const titleEl = colContainer.querySelector('h3');
                if (titleEl && !titleEl.hasAttribute('contenteditable')) {
                    titleEl.setAttribute('contenteditable', 'true');
                    titleEl.setAttribute('onblur', 'saveFullBoardState()');
                }
                const sortList = colContainer.querySelector('.space-y-3.min-h-\[150px\]');
                if (sortList && !sortList.classList.contains('sortable-list')) {
                    sortList.classList.add('sortable-list');
                }
            });
        }


    
    initSortable();

    // Set up MutationObserver to save full board state whenever it changes
    // But since Sortable dragging triggers changes, we explicitly save on end.
    
    
    // --- 3. List View Checkbox Persistence ---
    const viewList = document.getElementById('view-list');
    if (viewList) {
        // Load state
        const savedList = localStorage.getItem('state_view_list');
        if (savedList) {
            viewList.innerHTML = savedList;
        }
        
        // Save state on change
        viewList.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                if (e.target.checked) {
                    e.target.setAttribute('checked', 'checked');
                } else {
                    e.target.removeAttribute('checked');
                }
                setTimeout(() => {
                    localStorage.setItem('state_view_list', viewList.innerHTML);
                }, 50);
            }
        });
    }

    // --- 2. Search Functionality ---
    const searchInput = document.getElementById('task-search-input');
    const searchResults = document.getElementById('task-search-results');
    const resultsList = document.getElementById('search-results-list');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length < 2) {
                searchResults.classList.add('hidden');
                return;
            }
            
            // Find all task cards
            const cards = document.querySelectorAll('.sortable-list > div[onclick="toggleTaskPanel(this)"], .sortable-list > div.group');
            let matches = [];
            
            cards.forEach(card => {
                const titleEl = card.querySelector('h4');
                const title = titleEl ? titleEl.innerText : '';
                if (title.toLowerCase().includes(query)) {
                    // Extract priority or status if available
                    const priorityEl = card.querySelector('.ring-1.ring-inset');
                    const priority = priorityEl ? priorityEl.innerText : 'Normal';
                    const priorityClass = priorityEl ? priorityEl.className : '';
                    matches.push({ title, priority, priorityClass, element: card });
                }
            });
            
            if (matches.length > 0) {
                resultsList.innerHTML = matches.map((m, i) => `
                    <li class="p-3 hover:bg-gray-50 cursor-pointer border-b border-border last:border-0 dark:hover:bg-[#27272a]" data-index="${i}">
                        <p class="text-sm font-medium text-primary line-clamp-1">${m.title}</p>
                        <span class="mt-1 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ${m.priorityClass}">${m.priority}</span>
                    </li>
                `).join('');
                searchResults.classList.remove('hidden');
                
                // Add click events
                resultsList.querySelectorAll('li').forEach(li => {
                    li.addEventListener('click', function() {
                        const idx = this.getAttribute('data-index');
                        const cardEl = matches[idx].element;
                        searchResults.classList.add('hidden');
                        searchInput.value = '';
                        toggleTaskPanel(cardEl);
                    });
                });
            } else {
                resultsList.innerHTML = '<li class="p-3 text-sm text-gray-500">Tidak ada tugas ditemukan</li>';
                searchResults.classList.remove('hidden');
            }
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.add('hidden');
            }
        });
    }
});

// --- Core Functions ---


function initSortable() {
    const lists = document.querySelectorAll('.sortable-list');
    if(typeof Sortable !== 'undefined') {
        lists.forEach(list => {
            // Check if Sortable instance exists in JS memory instead of DOM class
            if (!Sortable.get(list)) {
                Sortable.create(list, {
                    group: 'tasks',
                    animation: 150,
                    ghostClass: 'opacity-50',
                    dragClass: 'cursor-grabbing',
                    onEnd: function() {
                        saveFullBoardState();
                    }
                });
                
            }
        });
        
        // Make the columns themselves sortable
        const boardContainer = document.getElementById('board-container');
        if (boardContainer && !Sortable.get(boardContainer)) {
            Sortable.create(boardContainer, {
                animation: 150,
                draggable: '.w-80:not(.ignore-sort)',
                filter: '.ignore-sort', // Don't drag the Add List button
                onEnd: function() {
                    saveFullBoardState();
                }
            });
            
        }
    }

    
    // Also attach click events to cards if they don't have it
    document.querySelectorAll('.sortable-list > div.group').forEach(card => {
        card.setAttribute('onclick', 'toggleTaskPanel(this)');
    });
}

function saveFullBoardState() {
    const boardContainer = document.getElementById('board-container');
    if (boardContainer) {
        localStorage.setItem('state_board_full', boardContainer.innerHTML);
    }
}

// Ensure the container has the ID
document.addEventListener('DOMContentLoaded', () => {
    const inlineFlex = document.querySelector('.inline-flex.gap-6.min-w-max.pb-6');
    if (inlineFlex && !inlineFlex.id) {
        inlineFlex.id = 'board-container';
    }
});

function toggleTaskPanel(cardOrNew = false, listId = null) {
    const panel = document.getElementById('task-panel');
    const isClosed = panel.classList.contains('translate-x-full');
    
    if (isClosed) {
        if (cardOrNew === true) {
            // New Task
            currentTaskCard = null;
            targetListForNewTask = listId;
            document.getElementById('panel-state-title').innerText = 'Buat Tugas Baru';

            document.getElementById('task-title-input').value = '';
            document.getElementById('task-desc-input').value = '';
            document.getElementById('task-status-input').value = 'Todo';
            document.getElementById('task-priority-input').value = 'Sedang';
            if(document.getElementById('task-note-input')) document.getElementById('task-note-input').value = '';
            if(document.getElementById('task-finance-input')) document.getElementById('task-finance-input').value = '';
            if(document.getElementById('task-url-input')) document.getElementById('task-url-input').value = '';
            
            setTimeout(() => { document.getElementById('task-title-input').focus(); }, 300);
        } else {
            // Existing Task
            currentTaskCard = cardOrNew; // Store reference to clicked card
            document.getElementById('panel-state-title').innerText = 'Detail Tugas';
            
            // Extract data from card
            const title = cardOrNew.querySelector('h4').innerText;
            document.getElementById('task-title-input').value = title;
            
            // Look for priority
            const priorityEl = cardOrNew.querySelector('.ring-1.ring-inset');
            if (priorityEl) {
                document.getElementById('task-priority-input').value = priorityEl.innerText;
            }
        }
        panel.classList.remove('translate-x-full');
    } else {
        panel.classList.add('translate-x-full');
        
        // If they clicked "Simpan Tugas" (we can tell if we are closing from the save button)
        // Actually, we should handle save explicitly. 
    }
}

function openNewTask() {
    const panel = document.getElementById('task-panel');
    if (!panel.classList.contains('translate-x-full')) {
        panel.classList.add('translate-x-full');
        setTimeout(() => { toggleTaskPanel(true); }, 300);
    } else {
        toggleTaskPanel(true);
    }
}

// Override Save Task logic
document.addEventListener('DOMContentLoaded', () => {

    // --- Subtasks Logic ---
    const addSubtaskBtn = document.querySelector('#task-subtasks-area button');
    const subtaskList = document.getElementById('task-subtasks-list');
    if (addSubtaskBtn && subtaskList) {
        // Clear dummy data when adding first subtask to a new task? 
        // No, let's just make the button add a new editable subtask
        
        addSubtaskBtn.addEventListener('click', () => {
            const subtaskHtml = `
            <label class="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" class="mt-0.5 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer dark:border-[#3f3f46]">
                <span class="text-sm text-primary group-hover:text-gray-900 transition-colors" contenteditable="true" onblur="if(this.innerText.trim()==='') this.parentElement.remove()">Subtugas baru...</span>
            </label>
            `;
            subtaskList.insertAdjacentHTML('beforeend', subtaskHtml);
            
            // Focus the newly added text
            const newSpan = subtaskList.lastElementChild.querySelector('span');
            if (newSpan) {
                newSpan.focus();
                // Select all text
                document.execCommand('selectAll', false, null);
            }
        });
        
        // Add event delegation for checkbox strikethrough effect
        subtaskList.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const span = e.target.nextElementSibling;
                if (e.target.checked) {
                    span.classList.add('line-through', 'text-gray-400');
                    span.classList.remove('text-primary');
                } else {
                    span.classList.remove('line-through', 'text-gray-400');
                    span.classList.add('text-primary');
                }
            }
        });
    }

    // Delete Task Logic
    const delBtn = document.getElementById('btn-delete-task');
    if (delBtn) {
        delBtn.addEventListener('click', () => {
            if (currentTaskCard) {
                if (confirm('Apakah anda yakin ingin menghapus tugas ini?')) {
                    currentTaskCard.remove();
                    saveFullBoardState();
                    toggleTaskPanel(); // Close panel
                    showToast('Tugas berhasil dihapus secara permanen.', 'danger');
                }
            } else {
                // If it's a new task, just close the panel
                toggleTaskPanel();
            }
        });
    }

    // Find the save button in the panel
    const saveBtns = document.querySelectorAll('#task-panel button');
    let saveBtn = null;
    saveBtns.forEach(b => {
        if ((b.textContent || b.innerText || '').includes('Simpan Tugas')) saveBtn = b;
    });
    
    if (saveBtn) {
        // Remove old onclick
        saveBtn.removeAttribute('onclick');
        saveBtn.addEventListener('click', () => {
            const title = document.getElementById('task-title-input').value || 'Tugas Tanpa Judul';
            const priority = document.getElementById('task-priority-input').value;
            
            // Map priority to CSS classes
            let badgeClass = 'bg-gray-50 text-gray-500 ring-gray-500/10 dark:bg-[#09090b] dark:text-gray-400'; // Rendah
            if (priority === 'Tinggi') badgeClass = 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20';
            if (priority === 'Sedang') badgeClass = 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-500/10 dark:text-yellow-300 dark:ring-yellow-500/20';
            
            if (currentTaskCard) {
                // Update existing
                currentTaskCard.querySelector('h4').innerText = title;
                const pBadge = currentTaskCard.querySelector('.ring-1.ring-inset');
                if (pBadge) {
                    pBadge.className = `inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${badgeClass}`;
                    pBadge.innerText = priority;
                }
            } else {
                // Create new card HTML
                const newCard = document.createElement('div');
                newCard.className = 'bg-surface p-4 rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group border-l-[3px] border-l-primary dark:bg-surface dark:border-[#27272a]';
                newCard.setAttribute('onclick', 'toggleTaskPanel(this)');
                newCard.innerHTML = `
                    <h4 class="text-sm font-medium text-primary mb-3 line-clamp-2">${title}</h4>
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center gap-2">
                            <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-[#18181b] dark:text-gray-400">Personal OS</span>
                            <span class="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${badgeClass}">${priority}</span>
                        </div>
                        <span class="text-[10px] font-medium text-primary">Baru</span>
                    </div>
                `;
                // Add to the targeted list, or fallback to the first list
                let targetList = document.querySelector('.sortable-list');
                if (targetListForNewTask) {
                    const specificList = document.getElementById(targetListForNewTask);
                    if (specificList) targetList = specificList;
                }
                
                if (targetList) {
                    targetList.prepend(newCard);
                }
            }
            
            saveFullBoardState();
            toggleTaskPanel(); // Close panel
            showToast('Perubahan pada tugas berhasil disimpan!', 'success');
        });
    }
});

function addNewList() {
    const listName = prompt("Masukkan nama daftar baru:");
    if (listName && listName.trim() !== "") {
        const boardContainer = document.getElementById('board-container');
        const listId = 'board-' + Date.now();
        const newListHtml = `
        <div class="w-80 shrink-0 flex flex-col">
            <div class="flex items-center justify-between mb-3 px-1">
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-brand"></div>
                    <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300" contenteditable="true" onblur="saveFullBoardState()">${listName}</h3>
                </div>
                <button onclick="openNewTask(this)" class="text-gray-400 hover:text-primary transition-colors p-1 hover:bg-gray-100 rounded dark:hover:bg-[#27272a]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </button>
            </div>
            <div id="${listId}" class="space-y-3 min-h-[150px] sortable-list">
            </div>
        </div>
        `;
        
        // Insert before the "Tambah Daftar Baru" button
        const addBtnContainer = boardContainer.lastElementChild;
        addBtnContainer.insertAdjacentHTML('beforebegin', newListHtml);
        
        initSortable();
        saveFullBoardState();
    }
}

// View switcher implementation (since the old one is replaced or buggy)
function switchView(view) {
    const listBtn = document.getElementById('btn-view-list');
    const boardBtn = document.getElementById('btn-view-board');
    const listView = document.getElementById('view-list');
    const boardView = document.getElementById('view-board');
    
    if (!listView || !boardView) return;

    const activeClasses = ['font-semibold', 'bg-white', 'dark:bg-surface', 'shadow-sm', 'text-primary'];
    const inactiveClasses = ['font-medium', 'text-gray-500', 'dark:text-gray-400', 'hover:text-primary', 'cursor-pointer'];
    
    if (view === 'list') {
        listView.classList.remove('hidden');
        boardView.classList.add('hidden');
        boardView.classList.remove('block');
        
        listBtn.classList.add(...activeClasses);
        listBtn.classList.remove(...inactiveClasses);
        boardBtn.classList.add(...inactiveClasses);
        boardBtn.classList.remove(...activeClasses);
    } else if (view === 'board') {
        boardView.classList.remove('hidden');
        listView.classList.add('hidden');
        listView.classList.remove('block');
        
        boardBtn.classList.add(...activeClasses);
        boardBtn.classList.remove(...inactiveClasses);
        listBtn.classList.add(...inactiveClasses);
        listBtn.classList.remove(...activeClasses);
    }
}


// --- Custom Toast Notification ---
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-24 right-4 z-[9999] flex flex-col gap-2';
        document.body.appendChild(container);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    
    // Icon based on type
    let icon = '';
    let bgColor = 'bg-surface dark:bg-surface border-border dark:border-[#27272a]';
    let textColor = 'text-primary';
    let iconColor = 'text-success';
    
    if (type === 'success') {
        icon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    } else if (type === 'danger') {
        iconColor = 'text-danger';
        icon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`;
    } else if (type === 'warning') {
        iconColor = 'text-warning';
        icon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
    }
    
    toast.className = `flex items-center gap-3 p-4 rounded-xl border shadow-lg ${bgColor} transform translate-x-full transition-all duration-300 ease-out`;
    toast.innerHTML = `
        <div class="shrink-0 ${iconColor}">
            ${icon}
        </div>
        <p class="text-sm font-medium ${textColor}">${message}</p>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full');
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        toast.classList.add('opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
