// finance_app.js

let transactions = JSON.parse(localStorage.getItem('finance_transactions')) || [];
let accounts = JSON.parse(localStorage.getItem('finance_accounts')) || [];
let goals = JSON.parse(localStorage.getItem('finance_goals')) || [];

let currentTxType = 'pengeluaran';
let currentEditId = null;

function initDefaultData() {
    let changed = false;
    if (accounts.length === 0) {
        accounts = [
            { id: 'acc1', name: 'BCA Utama', balance: 8250000, color: 'bg-blue-500' },
            { id: 'acc2', name: 'GoPay', balance: 1150000, color: 'bg-green-500' },
            { id: 'acc3', name: 'Dompet Tunai', balance: 450000, color: 'bg-gray-900' }
        ];
        changed = true;
    }
    if (goals.length === 0) {
        goals = [
            { id: 'goal1', name: 'Laptop Baru', target: 15000000, collected: 10000000 }
        ];
        changed = true;
    }
    if (transactions.length === 0) {
        transactions = [
            { id: 'tx1', type: 'pengeluaran', amount: 850000, notes: 'Belanja Bulanan', account: 'acc1', date: new Date().toISOString() },
            { id: 'tx2', type: 'pemasukan', amount: 2500000, notes: 'Transfer Klien', account: 'acc1', date: new Date(Date.now() - 86400000).toISOString() }
        ];
        changed = true;
    }
    if (changed) {
        saveData();
    }
}

function saveData() {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    localStorage.setItem('finance_accounts', JSON.stringify(accounts));
    localStorage.setItem('finance_goals', JSON.stringify(goals));
}

function notify(msg, type='success') {
    if (typeof window.showToast === 'function') {
        window.showToast(msg, type);
    } else {
        alert(msg);
    }
}

// ----------------------------------------------------
// UI Render Functions
// ----------------------------------------------------


window.populateSelects = function() {
    const accHtml = accounts.map(a => `<option value="${a.id}">${a.name} (Rp ${a.balance.toLocaleString('id-ID')})</option>`).join('');
    const txAcc = document.getElementById('tx-account');
    const editTxAcc = document.getElementById('edit-tx-account');
    if (txAcc) txAcc.innerHTML = accHtml;
    if (editTxAcc) editTxAcc.innerHTML = accHtml;
    
    const goalHtml = '<option value="">-- Tidak ada --</option>' + goals.map(g => `<option value="${g.id}">Target: ${g.name}</option>`).join('');
    const txGoal = document.getElementById('tx-goal');
    if (txGoal) txGoal.innerHTML = goalHtml;
};

function renderTransactions() {
    const container = document.getElementById('tx-list-container');
    if (!container) return;
    
    let fromDate = document.getElementById('date-from') ? document.getElementById('date-from').value : '';
    let toDate = document.getElementById('date-to') ? document.getElementById('date-to').value : '';
    let filterMonth = document.getElementById('filter-month') ? document.getElementById('filter-month').value : 'all';
    
    let filtered = transactions;
    if (fromDate) {
        filtered = filtered.filter(t => new Date(t.date) >= new Date(fromDate));
    }
    if (toDate) {
        // toDate is end of day
        let to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        filtered = filtered.filter(t => new Date(t.date) <= to);
    }
    
    if (filterMonth !== 'all') {
        const targetMonth = parseInt(filterMonth);
        filtered = filtered.filter(t => new Date(t.date).getMonth() === targetMonth);
    }
    
    // Sort desc
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '<div class="bg-surface border border-border rounded-xl overflow-hidden shadow-sm dark:bg-surface dark:border-[#27272a]">';
    if (filtered.length === 0) {
        html += '<div class="p-4 text-center text-sm text-gray-500">Tidak ada transaksi</div>';
    } else {
        filtered.forEach(tx => {
            const acc = accounts.find(a => a.id === tx.account);
            const accName = acc ? acc.name : 'Unknown';
            const isInc = tx.type === 'pemasukan';
            const color = isInc ? 'green' : 'red';
            const sign = isInc ? '+' : '-';
            const icon = isInc ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>' : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l7 7m7 7V3"></path>';
            
            const dateStr = new Date(tx.date).toLocaleDateString('id-ID');
            
            html += `
            <div onclick="openEditTxModal('${tx.id}')" class="flex items-center justify-between p-4 border-b border-border hover:bg-gray-50 cursor-pointer transition-colors group dark:border-[#27272a] dark:hover:bg-[#27272a]">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-${color}-50 flex items-center justify-center shrink-0 dark:bg-${color}-500/10 dark:border-${color}-500/20">
                        <svg class="w-5 h-5 text-${color}-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">${icon}</svg>
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold text-primary">${tx.notes}</h4>
                        <p class="text-xs text-gray-500 mt-0.5 dark:text-gray-400">${dateStr} &bull; ${accName}${tx.category ? ' &bull; ' + tx.category : ''}</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-sm font-semibold text-${color}-500">${sign} Rp ${tx.amount.toLocaleString('id-ID')}</span>
                    <button onclick="event.stopPropagation(); openDeleteConfirmModal('tx', '${tx.id}')" class="p-1.5 text-gray-400 hover:text-danger opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity" title="Hapus">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </div>`;
        });
    }
    html += '</div>';
    container.innerHTML = html;
    
    renderChart(filtered);
}

let financeChartInstance = null;
function renderChart(filteredData) {
    const ctx = document.getElementById('finance-chart');
    if (!ctx) return;
    
    // Group transactions by date (last 7 days if no filter, but here we just use filteredData)
    // To make it simple, let's group all filteredData by Date string
    let grouped = {};
    filteredData.forEach(t => {
        let dStr = new Date(t.date).toLocaleDateString('id-ID');
        if (!grouped[dStr]) grouped[dStr] = { income: 0, expense: 0 };
        if (t.type === 'pemasukan') grouped[dStr].income += t.amount;
        else if (t.type === 'pengeluaran') grouped[dStr].expense += t.amount;
    });
    
    // Sort keys by date
    let labels = Object.keys(grouped).sort((a,b) => {
        let pa = a.split('/'); let pb = b.split('/');
        let da = new Date(pa[2], pa[1]-1, pa[0]);
        let db = new Date(pb[2], pb[1]-1, pb[0]);
        return da - db;
    });
    
    // If more than 7, take last 7
    if (labels.length > 7) {
        labels = labels.slice(-7);
    }
    
    let incData = labels.map(l => grouped[l].income);
    let expData = labels.map(l => grouped[l].expense);
    
    if (financeChartInstance) {
        financeChartInstance.destroy();
    }
    
    financeChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Pemasukan',
                    data: incData,
                    backgroundColor: '#3b82f6', // blue
                    borderRadius: 4
                },
                {
                    label: 'Pengeluaran',
                    data: expData,
                    backgroundColor: '#ef4444', // red
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { callback: function(val) { return 'Rp' + (val/1000) + 'k'; } } }
            },
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12 } }
            }
        }
    });
}

function renderAccounts() {
    const container = document.getElementById('tab-content-banks');
    if (!container) return;
    
    let html = '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">';
    accounts.forEach(acc => {
        html += `
        <div onclick="openBankDetailModal('${acc.name}', 'Rp ${acc.balance.toLocaleString('id-ID')}')" class="bg-surface border border-border rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow group dark:bg-surface dark:border-[#27272a]">
            <div class="flex items-center justify-between mb-6">
                <span class="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                    <div class="w-4 h-4 rounded-full ${acc.color}"></div>
                    ${acc.name}
                </span>
                <div class="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="event.stopPropagation(); openEditBankModal('${acc.id}')" class="p-1.5 text-gray-400 hover:text-primary transition-colors" title="Edit">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button onclick="event.stopPropagation(); openDeleteConfirmModal('bank', '${acc.id}')" class="p-1.5 text-gray-400 hover:text-danger transition-colors" title="Hapus">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </div>
            <div class="text-sm text-gray-500 mb-1 dark:text-gray-400">Saldo</div>
            <h3 class="text-xl font-bold text-primary">Rp ${acc.balance.toLocaleString('id-ID')}</h3>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
    populateAccountSelects();
}

function renderGoals() {
    const container = document.getElementById('tab-content-goals');
    if (!container) return;
    
    let html = '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">';
    goals.forEach(goal => {
        let pct = 0;
        if (goal.target > 0) {
            pct = Math.min(100, Math.round((goal.collected / goal.target) * 100));
        }
        
        html += `
        <div class="bg-surface border border-border rounded-xl p-5 hover:shadow-md transition-shadow group dark:bg-surface dark:border-[#27272a]">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center dark:bg-[#18181b]">
                        <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold text-primary">${goal.name}</h4>
                        <p class="text-xs text-gray-500 uppercase tracking-wide mt-0.5 dark:text-gray-400">Target: Rp ${goal.target.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                <div class="flex items-center gap-1">
                    <div class="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mr-1">
                        <button onclick="openEditGoalModal('${goal.id}')" class="p-1.5 text-gray-400 hover:text-primary transition-colors" title="Edit">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </button>
                        <button onclick="openDeleteConfirmModal('goal', '${goal.id}')" class="p-1.5 text-gray-400 hover:text-danger transition-colors" title="Hapus">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                    <span class="text-sm font-bold text-success bg-green-50 px-2 py-1 rounded-md dark:bg-green-500/10 dark:border-green-500/20">${pct}%</span>
                </div>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2 mb-2 dark:bg-[#18181b]">
                <div class="bg-success h-2 rounded-full" style="width: ${pct}%"></div>
            </div>
            <p class="text-xs text-gray-400">Terkumpul: <span class="font-semibold text-gray-700 dark:text-gray-300">Rp ${goal.collected.toLocaleString('id-ID')}</span></p>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
    populateGoalSelects();
}

function updateSummaryCards() {
    let totalWealth = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    let income = transactions.filter(t => t.type === 'pemasukan').reduce((sum, t) => sum + t.amount, 0);
    let expense = transactions.filter(t => t.type === 'pengeluaran').reduce((sum, t) => sum + t.amount, 0);
    
    const wealthEl = document.getElementById('summary-wealth');
    const incomeEl = document.getElementById('summary-income');
    const expenseEl = document.getElementById('summary-expense');
    if (wealthEl) wealthEl.innerText = 'Rp ' + totalWealth.toLocaleString('id-ID');
    if (incomeEl) incomeEl.innerText = 'Rp ' + income.toLocaleString('id-ID');
    if (expenseEl) expenseEl.innerText = 'Rp ' + expense.toLocaleString('id-ID');
}


function populateAccountSelects() {
    let opts = accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
    
    let txAcc = document.getElementById('tx-account');
    if (txAcc) txAcc.innerHTML = opts;
    
    let editTxAcc = document.getElementById('edit-tx-account');
    if (editTxAcc) editTxAcc.innerHTML = opts;
}

function populateGoalSelects() {
    let opts = '<option value="">-- Tidak ada --</option>' + goals.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
    
    let txGoal = document.getElementById('tx-goal');
    if (txGoal) txGoal.innerHTML = opts;
}

// ----------------------------------------------------
// Modals Open/Close Overrides
// ----------------------------------------------------

window.openTransactionModal = function() {
    switchTxType('pengeluaran');
    const modal = document.getElementById('tx-modal');
    modal.querySelectorAll('input[type="number"]')[0].value = '';
    modal.querySelectorAll('input[type="text"]')[0].value = '';
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('tx-modal-content').classList.remove('scale-95', 'opacity-0');
        document.getElementById('tx-modal-content').classList.add('scale-100', 'opacity-100');
    }, 10);
};
window.closeTransactionModal = function() {
    const content = document.getElementById('tx-modal-content');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => document.getElementById('tx-modal').classList.add('hidden'), 200);
};

window.openEditTxModal = function(id) {
    currentEditId = id;
    const tx = transactions.find(t => t.id === id);
    if(!tx) return;
    
    const modal = document.getElementById('edit-tx-modal');
    // type span
    modal.querySelector('.mb-4 span').innerText = tx.type.charAt(0).toUpperCase() + tx.type.slice(1);
    modal.querySelectorAll('input[type="number"]')[0].value = tx.amount;
    modal.querySelectorAll('input[type="text"]')[0].value = tx.notes;
    let selects = modal.querySelectorAll('select');
    if(selects.length > 0) selects[0].value = tx.account;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('edit-tx-modal-content').classList.remove('scale-95', 'opacity-0');
        document.getElementById('edit-tx-modal-content').classList.add('scale-100', 'opacity-100');
    }, 10);
};
window.closeEditTxModal = function() {
    const content = document.getElementById('edit-tx-modal-content');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => document.getElementById('edit-tx-modal').classList.add('hidden'), 200);
};

window.openBankModal = function() {
    const modal = document.getElementById('bank-modal');
    if(!modal) return;
    modal.querySelectorAll('input[type="text"]')[0].value = '';
    modal.querySelectorAll('input[type="number"]')[0].value = '';
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('bank-modal-content').classList.remove('scale-95', 'opacity-0');
        document.getElementById('bank-modal-content').classList.add('scale-100', 'opacity-100');
    }, 10);
};
window.closeBankModal = function() {
    const content = document.getElementById('bank-modal-content');
    if(!content) return;
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => document.getElementById('bank-modal').classList.add('hidden'), 200);
};

window.openEditBankModal = function(id) {
    currentEditId = id;
    const acc = accounts.find(a => a.id === id);
    if(!acc) return;
    
    
    const modal = document.getElementById('edit-bank-modal');
    modal.querySelectorAll('input[type="text"]')[0].value = acc.name;
    modal.querySelectorAll('input[type="number"]')[0].value = acc.balance;
    window.editBankColor = acc.color || 'bg-blue-500';
    
    // Trigger color selection visually
    const colorCircles = modal.querySelectorAll('.w-8.h-8.rounded-full');
    colorCircles.forEach(c => {
        if (c.className.includes(window.editBankColor)) {
            window.selectBankColor(c, window.editBankColor);
        }
    });

    
    modal.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('edit-bank-modal-content').classList.remove('scale-95', 'opacity-0');
        document.getElementById('edit-bank-modal-content').classList.add('scale-100', 'opacity-100');
    }, 10);
};
window.closeEditBankModal = function() {
    const content = document.getElementById('edit-bank-modal-content');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => document.getElementById('edit-bank-modal').classList.add('hidden'), 200);
};

window.openGoalModal = function() {
    const modal = document.getElementById('goal-modal');
    if(!modal) return;
    modal.querySelectorAll('input[type="text"]')[0].value = '';
    modal.querySelectorAll('input[type="number"]')[0].value = '';
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('goal-modal-content').classList.remove('scale-95', 'opacity-0');
        document.getElementById('goal-modal-content').classList.add('scale-100', 'opacity-100');
    }, 10);
};
window.closeGoalModal = function() {
    const content = document.getElementById('goal-modal-content');
    if(!content) return;
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => document.getElementById('goal-modal').classList.add('hidden'), 200);
};

window.openEditGoalModal = function(id) {
    currentEditId = id;
    const goal = goals.find(g => g.id === id);
    if(!goal) return;
    
    const modal = document.getElementById('edit-goal-modal');
    modal.querySelectorAll('input[type="text"]')[0].value = goal.name;
    modal.querySelectorAll('input[type="number"]')[0].value = goal.target;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('edit-goal-modal-content').classList.remove('scale-95', 'opacity-0');
        document.getElementById('edit-goal-modal-content').classList.add('scale-100', 'opacity-100');
    }, 10);
};
window.closeEditGoalModal = function() {
    const content = document.getElementById('edit-goal-modal-content');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => document.getElementById('edit-goal-modal').classList.add('hidden'), 200);
};

// Override switchTxType
window.switchTxType = function(type) {
    currentTxType = type;
    const btnPengeluaran = document.getElementById('tx-type-pengeluaran');
    const btnPemasukan = document.getElementById('tx-type-pemasukan');
    const btnNabung = document.getElementById('tx-type-nabung');
    
    const inactiveClass = "flex-1 px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-primary transition-all";
    if(btnPengeluaran) btnPengeluaran.className = inactiveClass;
    if(btnPemasukan) btnPemasukan.className = inactiveClass;
    if(btnNabung) btnNabung.className = inactiveClass;
    
    const activeClass = "flex-1 px-2 py-1.5 text-xs font-semibold bg-white dark:bg-surface shadow-sm rounded-md text-primary transition-all";
    if (type === 'pengeluaran' && btnPengeluaran) btnPengeluaran.className = activeClass;
    if (type === 'pemasukan' && btnPemasukan) btnPemasukan.className = activeClass;
    if (type === 'nabung' && btnNabung) btnNabung.className = activeClass;

    // Toggle fields based on type
    const categoryWrapper = document.getElementById('wrapper-tx-category');
    const goalWrapper = document.getElementById('wrapper-tx-goal');
    const accountLabel = document.getElementById('lbl-tx-account');
    const categorySelect = document.getElementById('tx-category');
    
    if (categoryWrapper && goalWrapper && accountLabel && categorySelect) {
        if (type === 'pengeluaran') {
            categoryWrapper.style.display = 'block';
            goalWrapper.style.display = 'none';
            accountLabel.innerText = 'Sumber Rekening';
            categorySelect.innerHTML = `
                <option value="Food & Drink">Food & Drink</option>
                <option value="Transport">Transport</option>
                <option value="Belanja">Belanja</option>
                <option value="Hosting/Domain">Hosting/Domain</option>
                <option value="Tagihan">Tagihan</option>
                <option value="Lainnya" selected>Lainnya</option>
            `;
        } else if (type === 'pemasukan') {
            categoryWrapper.style.display = 'block';
            goalWrapper.style.display = 'none';
            accountLabel.innerText = 'Tujuan Rekening';
            categorySelect.innerHTML = `
                <option value="Gaji/Salary">Gaji/Salary</option>
                <option value="Bonus">Bonus</option>
                <option value="Investasi">Investasi</option>
                <option value="Pemberian">Pemberian</option>
                <option value="Lainnya" selected>Lainnya</option>
            `;
        } else if (type === 'nabung') {
            categoryWrapper.style.display = 'none';
            goalWrapper.style.display = 'block';
            accountLabel.innerText = 'Sumber Rekening (Dipotong)';
        }
    }
};

// ----------------------------------------------------
// Save / Edit / Delete Functions
// ----------------------------------------------------

window.saveTransaction = function() {
    const modal = document.getElementById('tx-modal');
    const amount = parseFloat(modal.querySelectorAll('input[type="number"]')[0].value);
    const notes = modal.querySelectorAll('input[type="text"]')[0].value;
    
    const accountEl = document.getElementById('tx-account');
    const goalEl = document.getElementById('tx-goal');
    const categoryEl = document.getElementById('tx-category');
    
    const accountId = accountEl ? accountEl.value : '';
    const goalId = (goalEl && currentTxType === 'nabung') ? goalEl.value : '';
    const category = (categoryEl && currentTxType !== 'nabung') ? categoryEl.value : (currentTxType === 'nabung' ? 'Tabungan' : 'Lainnya');
    
    if (!amount || !notes || !accountId) {
        notify('Mohon isi jumlah, catatan, dan rekening', 'error');
        return;
    }
    
    const acc = accounts.find(a => a.id === accountId);
    if (acc) {
        if (currentTxType === 'pengeluaran') acc.balance -= amount;
        else if (currentTxType === 'pemasukan') acc.balance += amount;
        else if (currentTxType === 'nabung') {
            acc.balance -= amount;
            if (goalId) {
                let g = goals.find(g => g.id === goalId);
                if (g) g.collected += amount;
            }
        }
    }
    
    transactions.push({
        id: 'tx' + Date.now(),
        type: currentTxType,
        amount: amount,
        notes: notes,
        account: accountId,
        category: category,
        date: new Date().toISOString()
    });
    
    saveData();
    renderTransactions();
    renderAccounts();
    if(typeof populateSelects === "function") populateSelects();
    renderGoals();
    updateSummaryCards();
    closeTransactionModal();
    notify('Transaksi berhasil ditambahkan');
};


window.saveEditTransaction = function() {
    const modal = document.getElementById('edit-tx-modal');
    const amount = parseFloat(modal.querySelectorAll('input[type="number"]')[0].value);
    const notes = modal.querySelectorAll('input[type="text"]')[0].value;
    const selects = modal.querySelectorAll('select');
    const accountId = selects[0].value;
    
    const tx = transactions.find(t => t.id === currentEditId);
    if (!tx || !amount || !notes || !accountId) return;
    
    // Reverse old transaction from account
    const oldAcc = accounts.find(a => a.id === tx.account);
    if (oldAcc) {
        if (tx.type === 'pengeluaran') oldAcc.balance += tx.amount;
        else if (tx.type === 'pemasukan') oldAcc.balance -= tx.amount;
        else if (tx.type === 'nabung') oldAcc.balance += tx.amount; // not restoring goal for simplicity
    }
    
    // Apply new
    tx.amount = amount;
    tx.notes = notes;
    tx.account = accountId;
    
    const newAcc = accounts.find(a => a.id === tx.account);
    if (newAcc) {
        if (tx.type === 'pengeluaran') newAcc.balance -= tx.amount;
        else if (tx.type === 'pemasukan') newAcc.balance += tx.amount;
        else if (tx.type === 'nabung') newAcc.balance -= tx.amount;
    }
    
    saveData();
    renderTransactions();
    renderAccounts();
    if(typeof populateSelects === "function") populateSelects();
    updateSummaryCards();
    closeEditTxModal();
    notify('Transaksi diperbarui');
};


window.selectBankColor = function(el, color) {
    // Determine which modal we are in
    const modal = el.closest('.relative'); // gets the modal content div
    
    // reset rings
    const circles = el.parentElement.querySelectorAll('.w-8.h-8.rounded-full');
    circles.forEach(c => {
        c.className = c.className.replace(/ring-2 ring-offset-1 ring-[a-z]+-[0-9]+|ring-2 ring-offset-1 ring-primary/g, '');
        // re-add hover rings if it's not selected
        if (!c.className.includes('hover:ring-2')) {
            c.className += ' hover:ring-2';
        }
    });
    
    // set selected ring
    el.className = el.className.replace('hover:ring-2', ''); // remove hover so it doesn't duplicate
    if (color === 'bg-gray-900') {
        el.className += ' ring-2 ring-offset-1 ring-primary';
    } else {
        el.className += ' ring-2 ring-offset-1 ring-' + color.split('-')[1] + '-500';
    }
    
    // Store in hidden input or global
    if (modal.id === 'bank-modal-content') {
        window.newBankColor = color;
    } else {
        window.editBankColor = color;
    }
};

window.saveBank = function() {
    const modal = document.getElementById('bank-modal');
    if(!modal) return;
    const name = modal.querySelectorAll('input[type="text"]')[0].value;
    const balance = parseFloat(modal.querySelectorAll('input[type="number"]')[0].value) || 0;
    
    if (!name) return notify('Nama rekening harus diisi', 'error');
    
    accounts.push({
        id: 'acc' + Date.now(),
        name: name,
        balance: balance,
        color: window.newBankColor || 'bg-blue-500'
    });
    
    saveData();
    renderAccounts();
    if(typeof populateSelects === "function") populateSelects();
    updateSummaryCards();
    closeBankModal();
    notify('Rekening berhasil ditambahkan');
};

window.saveEditBank = function() {
    const modal = document.getElementById('edit-bank-modal');
    const name = modal.querySelectorAll('input[type="text"]')[0].value;
    const balance = parseFloat(modal.querySelectorAll('input[type="number"]')[0].value) || 0;
    
    const acc = accounts.find(a => a.id === currentEditId);
    if (!acc || !name) return;
    
    acc.name = name;
    acc.balance = balance;
    acc.color = window.editBankColor || acc.color;
    
    saveData();
    renderAccounts();
    if(typeof populateSelects === "function") populateSelects();
    renderTransactions();
    updateSummaryCards();
    closeEditBankModal();
    notify('Rekening diperbarui');
};

window.saveGoal = function() {
    const modal = document.getElementById('goal-modal');
    if(!modal) return;
    const name = modal.querySelectorAll('input[type="text"]')[0].value;
    const target = parseFloat(modal.querySelectorAll('input[type="number"]')[0].value) || 0;
    
    if (!name || target <= 0) return notify('Data target tidak valid', 'error');
    
    goals.push({
        id: 'goal' + Date.now(),
        name: name,
        target: target,
        collected: 0
    });
    
    saveData();
    renderGoals();
    closeGoalModal();
    notify('Target berhasil dibuat');
};

window.saveEditGoal = function() {
    const modal = document.getElementById('edit-goal-modal');
    const name = modal.querySelectorAll('input[type="text"]')[0].value;
    const target = parseFloat(modal.querySelectorAll('input[type="number"]')[0].value) || 0;
    
    const goal = goals.find(g => g.id === currentEditId);
    if (!goal || !name || target <= 0) return;
    
    goal.name = name;
    goal.target = target;
    
    saveData();
    renderGoals();
    closeEditGoalModal();
    notify('Target diperbarui');
};

// ----------------------------------------------------
// Delete Logic
// ----------------------------------------------------

let pendingDelete = { type: null, id: null };

window.openDeleteConfirmModal = function(type, id) {
    pendingDelete = { type, id };
    const modal = document.getElementById('delete-confirm-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        const content = document.getElementById('delete-confirm-modal-content');
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
};

window.closeDeleteConfirmModal = function() {
    const content = document.getElementById('delete-confirm-modal-content');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => document.getElementById('delete-confirm-modal').classList.add('hidden'), 200);
    pendingDelete = { type: null, id: null };
};

window.executeDelete = function() {
    if (pendingDelete.type === 'tx') {
        const tx = transactions.find(t => t.id === pendingDelete.id);
        if (tx) {
            const acc = accounts.find(a => a.id === tx.account);
            if (acc) {
                if (tx.type === 'pengeluaran') acc.balance += tx.amount;
                else if (tx.type === 'pemasukan') acc.balance -= tx.amount;
                else if (tx.type === 'nabung') acc.balance += tx.amount;
            }
        }
        transactions = transactions.filter(t => t.id !== pendingDelete.id);
        renderTransactions();
        renderAccounts();
        if(typeof populateSelects === "function") populateSelects();
        updateSummaryCards();
        notify('Transaksi dihapus');
    } else if (pendingDelete.type === 'bank') {
        accounts = accounts.filter(a => a.id !== pendingDelete.id);
        renderAccounts();
        if(typeof populateSelects === "function") populateSelects();
        updateSummaryCards();
        notify('Rekening dihapus');
    } else if (pendingDelete.type === 'goal') {
        goals = goals.filter(g => g.id !== pendingDelete.id);
        renderGoals();
        if(typeof populateSelects === "function") populateSelects();
        notify('Target dihapus');
    }
    saveData();
    closeDeleteConfirmModal();
    closeEditTxModal();
    if (typeof closeEditBankModal === "function") closeEditBankModal();
    if (typeof closeEditGoalModal === "function") closeEditGoalModal();
};

window.filterByDate = function() {
    renderTransactions();
};

document.addEventListener('DOMContentLoaded', () => {
    initDefaultData();
    
    let fromDate = document.getElementById('date-from');
    let toDate = document.getElementById('date-to');
    let fMonth = document.getElementById('filter-month');
    if (fromDate) fromDate.addEventListener('change', filterByDate);
    if (toDate) toDate.addEventListener('change', filterByDate);
    
    // Default month to current
    if (fMonth) {
        fMonth.value = "all";
    }
    
    renderTransactions();
    renderAccounts();
    if(typeof populateSelects === "function") populateSelects();
    renderGoals();
    updateSummaryCards();
    
    if (typeof window.switchFinanceTab === 'function') {
        window.switchFinanceTab('log');
    }
});
