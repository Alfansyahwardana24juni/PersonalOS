const fs = require('fs');

const jsContent = `
// New Dashboard logic using Dexie OS_DB and Chart.js

let charts = {};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDashboard();
    } catch (error) {
        console.error('Failed to init dashboard:', error);
    }
});

async function initDashboard() {
    setGreeting();
    await loadFinancialStats();
    await loadProductivityStats();
    await loadUpcoming();
}

function setGreeting() {
    const hours = new Date().getHours();
    let greeting = 'Good Morning';
    if (hours >= 12 && hours < 17) greeting = 'Good Afternoon';
    else if (hours >= 17) greeting = 'Good Evening';

    const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    const name = profile.name ? profile.name.split(' ')[0] : 'Alfa';
    
    const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = new Date().toLocaleDateString('en-US', dateOpts);

    const greetEl = document.getElementById('dash-greeting');
    const dateEl = document.getElementById('dash-date');
    if(greetEl) greetEl.textContent = \`\${greeting}, \${name} 👋\`;
    if(dateEl) dateEl.textContent = dateStr;
}

async function loadFinancialStats() {
    if (typeof OS_DB === 'undefined' || !OS_DB.getFinances) return;
    const finances = await OS_DB.getFinances();
    
    let totalIncome = 0;
    let totalExpense = 0;
    
    // For charts
    const monthlyIncome = {};
    const monthlyExpense = {};
    const catExpense = {};

    finances.forEach(f => {
        const amt = parseFloat(f.amount) || 0;
        const d = new Date(f.date);
        const monthKey = d.toLocaleString('default', { month: 'short' });
        
        if (f.type === 'income') {
            totalIncome += amt;
            monthlyIncome[monthKey] = (monthlyIncome[monthKey] || 0) + amt;
        } else if (f.type === 'expense') {
            totalExpense += amt;
            monthlyExpense[monthKey] = (monthlyExpense[monthKey] || 0) + amt;
            catExpense[f.category || 'Other'] = (catExpense[f.category || 'Other'] || 0) + amt;
        }
    });

    const totalWealth = totalIncome - totalExpense;
    
    const wEl = document.getElementById('dash-total-wealth');
    const iEl = document.getElementById('dash-income');
    const eEl = document.getElementById('dash-expense');
    
    const fmt = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    
    if(wEl) wEl.textContent = fmt(totalWealth);
    if(iEl) iEl.textContent = fmt(totalIncome); // Simplified to all-time for demo, you can filter by current month
    if(eEl) eEl.textContent = fmt(totalExpense);

    // Saving Goal
    const goalTarget = 20000000;
    const goalCurrent = Math.max(0, totalWealth);
    let pct = Math.round((goalCurrent / goalTarget) * 100);
    if (pct > 100) pct = 100;
    
    const gPct = document.getElementById('dash-goal-pct');
    const gTxt = document.getElementById('dash-goal-text');
    const gBar = document.getElementById('dash-goal-bar');
    if(gPct) gPct.textContent = pct + '%';
    if(gTxt) gTxt.textContent = \`\${fmt(goalCurrent)} / \${fmt(goalTarget)}\`;
    if(gBar) gBar.style.width = pct + '%';

    // Init Charts
    initCharts(monthlyIncome, monthlyExpense, catExpense);
}

function initCharts(mInc, mExp, cExp) {
    if (typeof Chart === 'undefined') return;
    
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#9CA3AF';
    Chart.defaults.scale.grid.color = 'rgba(0,0,0,0.05)';

    const labels = Object.keys(mInc).length > 0 ? Object.keys(mInc) : ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const iData = labels.map(l => mInc[l] || 0);
    const eData = labels.map(l => mExp[l] || 0);

    const makeSparkline = (ctxId, color, data) => {
        const ctx = document.getElementById(ctxId);
        if(!ctx) return;
        if(charts[ctxId]) charts[ctxId].destroy();
        charts[ctxId] = new Chart(ctx, {
            type: 'line',
            data: { labels: data.map((_, i) => i), datasets: [{ data, borderColor: color, borderWidth: 2, tension: 0.4, pointRadius: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } } }
        });
    };

    makeSparkline('chart-wealth', '#3B82F6', iData.map((v, i) => v - (eData[i] || 0)));
    makeSparkline('chart-income', '#10B981', iData);
    makeSparkline('chart-expense', '#EF4444', eData);

    const cfCtx = document.getElementById('chart-cashflow');
    if(cfCtx) {
        if(charts['cf']) charts['cf'].destroy();
        charts['cf'] = new Chart(cfCtx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    { label: 'Income', data: iData, backgroundColor: '#10B981', borderRadius: 4 },
                    { label: 'Expense', data: eData, backgroundColor: '#EF4444', borderRadius: 4 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
        });
    }

    const pieCtx = document.getElementById('chart-pie-expense');
    if(pieCtx) {
        if(charts['pie']) charts['pie'].destroy();
        const pLabels = Object.keys(cExp);
        const pData = Object.values(cExp);
        charts['pie'] = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: pLabels.length ? pLabels : ['No Data'],
                datasets: [{ data: pData.length ? pData : [1], backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'], borderWidth: 0 }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'right', labels: { boxWidth: 12, usePointStyle: true } } } }
        });
    }
}

async function loadProductivityStats() {
    if (typeof OS_DB === 'undefined' || !OS_DB.getTasks) return;
    const tasks = await OS_DB.getTasks();
    
    // Sort tasks by date created or deadline, show top 5
    const today = new Date().toISOString().slice(0,10);
    const todayTasks = tasks.filter(t => !t.completed && (t.deadline === today || !t.deadline)).slice(0, 5);
    
    const taskContainer = document.getElementById('dashboard-tasks');
    if(taskContainer) {
        taskContainer.innerHTML = '';
        if (todayTasks.length === 0) {
            taskContainer.innerHTML = '<div class="py-6 text-center text-sm text-gray-500">All caught up for today! 🎉</div>';
        } else {
            todayTasks.forEach(t => {
                const li = document.createElement('li');
                li.className = 'p-4 hover:bg-gray-50 transition-colors group flex items-start cursor-pointer rounded-xl dark:hover:bg-[#18181b] border border-transparent hover:border-gray-100 dark:hover:border-[#27272a]';
                li.innerHTML = \`
                    <div class="pt-0.5">
                        <input type="checkbox" \${t.completed ? 'checked' : ''} onchange="toggleTask('\${t.id}', this.checked)" class="w-4 h-4 text-brand bg-white border-gray-300 rounded focus:ring-brand focus:ring-2 cursor-pointer transition-all">
                    </div>
                    <div class="ml-3 flex-1">
                        <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">\${t.title}</p>
                        <div class="flex items-center gap-3 mt-1.5">
                            \${t.priority ? \`<span class="inline-flex items-center rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">\${t.priority}</span>\` : ''}
                        </div>
                    </div>
                \`;
                taskContainer.appendChild(li);
            });
        }
    }

    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;
    const total = completed + pending;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

    const cEl = document.getElementById('dash-prod-completed');
    const pEl = document.getElementById('dash-prod-pending');
    const pctEl = document.getElementById('dash-prod-pct');
    const ringEl = document.getElementById('dash-prod-ring');

    if(cEl) cEl.textContent = completed;
    if(pEl) pEl.textContent = pending;
    if(pctEl) pctEl.textContent = pct + '%';
    if(ringEl) ringEl.setAttribute('stroke-dasharray', \`\${pct}, 100\`);
}

async function loadUpcoming() {
    if (typeof OS_DB === 'undefined' || !OS_DB.getEvents) return;
    const events = await OS_DB.getEvents();
    const tasks = await OS_DB.getTasks();
    
    // Combine events and tasks with deadline
    const all = [];
    events.forEach(e => all.push({ title: e.title, date: e.date, type: 'Event' }));
    tasks.filter(t => t.deadline && !t.completed).forEach(t => all.push({ title: t.title, date: t.deadline, type: 'Deadline' }));
    
    const today = new Date().toISOString().slice(0,10);
    const upcoming = all.filter(x => x.date >= today).sort((a,b) => a.date.localeCompare(b.date)).slice(0, 4);

    const cont = document.getElementById('dashboard-upcoming');
    if(cont) {
        cont.innerHTML = '';
        if(upcoming.length === 0) {
            cont.innerHTML = '<div class="text-center text-sm text-gray-400">No upcoming items</div>';
        } else {
            upcoming.forEach(u => {
                cont.innerHTML += \`
                    <li class="flex justify-between items-center p-3 bg-gray-50 rounded-xl dark:bg-[#09090b]">
                        <div>
                            <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">\${u.title}</p>
                            <p class="text-[10px] text-gray-500 font-medium mt-0.5">\${u.date}</p>
                        </div>
                        <span class="text-[10px] font-bold px-2 py-1 rounded-md \${u.type === 'Event' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'}">\${u.type}</span>
                    </li>
                \`;
            });
        }
    }
}

async function toggleTask(id, checked) {
    if (typeof OS_DB === 'undefined') return;
    const t = await OS_DB.getTasks().then(res => res.find(x => x.id === id));
    if(t) {
        t.completed = checked;
        await OS_DB.updateTask(id, t);
        loadProductivityStats();
    }
}
`;

fs.writeFileSync('D:/PersonalOS/js/dashboard_app.js', jsContent);
console.log('Written new dashboard_app.js');
