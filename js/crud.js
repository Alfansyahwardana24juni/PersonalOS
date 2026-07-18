// crud.js - Handles LocalStorage Persistence for UI prototypes

function showNotification(msg) {
    if (typeof window.showToast === 'function') {
        window.showToast(msg, 'success');
    } else {
        alert(msg);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Inject showToast globally
    if (typeof window.showToast !== 'function') {
        window.showToast = function(message, type = 'success') {
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.className = 'fixed bottom-24 right-4 z-[9999] flex flex-col gap-2 pointer-events-none';
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
            toast.className = `flex items-center gap-3 p-4 rounded-xl border shadow-lg bg-surface dark:bg-[#18181b] border-border dark:border-[#27272a] transform translate-x-full transition-all duration-300 ease-out pointer-events-auto`;
            toast.innerHTML = `<div class="shrink-0 ${iconColor}">${icon}</div><p class="text-sm font-medium text-primary">${message}</p>`;
            container.appendChild(toast);
            requestAnimationFrame(() => toast.classList.remove('translate-x-full'));
            setTimeout(() => {
                toast.classList.add('translate-x-full', 'opacity-0');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        };
    }

    // Inject showConfirmModal globally
    if (typeof window.showConfirmModal !== 'function') {
        window.showConfirmModal = function(message, onConfirm) {
            let container = document.getElementById('global-confirm-modal');
            if (!container) {
                container = document.createElement('div');
                container.id = 'global-confirm-modal';
                container.className = 'fixed inset-0 z-[99999] flex items-center justify-center hidden';
                container.innerHTML = `
                    <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity opacity-0" id="global-confirm-backdrop"></div>
                    <div class="relative bg-surface rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden border border-border flex flex-col transform scale-95 opacity-0 transition-all duration-200 dark:bg-surface dark:border-[#27272a]" id="global-confirm-content">
                        <div class="px-5 py-4 border-b border-border bg-gray-50/50 dark:border-[#27272a] dark:bg-[#09090b]/50">
                            <h3 class="text-sm font-semibold text-primary">Konfirmasi</h3>
                        </div>
                        <div class="p-5">
                            <p class="text-sm text-gray-600 dark:text-gray-400" id="global-confirm-msg"></p>
                        </div>
                        <div class="px-5 py-4 bg-gray-50 flex justify-end gap-2 border-t border-border dark:bg-[#09090b] dark:border-[#27272a]">
                            <button id="global-confirm-no" class="px-4 py-2 text-xs font-medium text-gray-600 hover:text-primary bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:text-gray-400 dark:bg-surface dark:border-[#3f3f46] dark:hover:bg-[#27272a]">Tidak</button>
                            <button id="global-confirm-yes" class="px-4 py-2 text-xs font-medium text-white bg-danger rounded-lg hover:bg-red-700 transition-colors">Iyyah</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(container);
            }
            
            document.getElementById('global-confirm-msg').innerText = message;
            const modal = container;
            const backdrop = document.getElementById('global-confirm-backdrop');
            const content = document.getElementById('global-confirm-content');
            
            modal.classList.remove('hidden');
            // trigger reflow
            void modal.offsetWidth;
            
            backdrop.classList.remove('opacity-0');
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
            
            const cleanup = () => {
                backdrop.classList.add('opacity-0');
                content.classList.remove('scale-100', 'opacity-100');
                content.classList.add('scale-95', 'opacity-0');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 200);
            };
            
            document.getElementById('global-confirm-yes').onclick = () => {
                cleanup();
                if (onConfirm) onConfirm();
            };
            document.getElementById('global-confirm-no').onclick = cleanup;
            backdrop.onclick = cleanup;
        };
    }

    // 1. Setup PWA
    let deferredPrompt;
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js');
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const installBtns = document.querySelectorAll('#install-pwa-btn');
      installBtns.forEach(btn => btn.classList.remove('hidden'));
      
      if (!localStorage.getItem('pwaPromptShown')) {
        setTimeout(() => {
            if (typeof window.showConfirmModal === 'function') {
                window.showConfirmModal('Ingin install aplikasi Personal OS ini di perangkat Anda?', () => {
                    installPWA();
                });
            } else if(confirm('Ingin install aplikasi Personal OS ini di perangkat Anda?')) {
                installPWA();
            }
            localStorage.setItem('pwaPromptShown', 'true');
        }, 2000);
      }
    });

    function installPWA() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          deferredPrompt = null;
          const installBtns = document.querySelectorAll('#install-pwa-btn');
          installBtns.forEach(btn => btn.classList.add('hidden'));
        });
      }
    }

    const installBtns = document.querySelectorAll('#install-pwa-btn');
    installBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            installPWA();
        });
    });

    // 2. Generic Delete Confirmation
    document.body.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('button[title="Hapus"]') || e.target.closest('button[title="Hapus Tugas"]');
        if (deleteBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            window.showConfirmModal('Apakah Anda yakin ingin menghapus data tersebut?', () => {
                let item = deleteBtn.closest('.group');
                if(!item) item = deleteBtn.parentElement.parentElement;
                
                if (item) {
                    item.remove();
                    saveState();
                    showNotification('Data berhasil dihapus.');
                }
            });
        }
    });

    // 3. Generic Save Logic
    document.body.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' && (e.target.innerText.includes('Simpan') || e.target.innerText.includes('Simpan Tugas') || e.target.innerText.includes('Simpan Target'))) {
            setTimeout(() => {
                saveState();
            }, 100);
        }
    });

    // 4. Persistence of lists
    const containers = [
        'dashboard-tasks', // tasks board
        'task-subtasks-list', // tasks subtasks
        'tab-content-log', 'tab-content-banks', 'tab-content-goals', // finance tabs
    ];

    function saveState() {
        containers.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                localStorage.setItem('state_' + id, el.innerHTML);
            }
        });
    }

    function loadState() {
        containers.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const saved = localStorage.getItem('state_' + id);
                if (saved) {
                    el.innerHTML = saved;
                }
            }
        });
    }

    loadState();
    
    document.body.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            if (e.target.checked) {
                e.target.setAttribute('checked', 'checked');
            } else {
                e.target.removeAttribute('checked');
            }
            setTimeout(saveState, 50);
        }
    });
});
