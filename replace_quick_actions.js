const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('D:/PersonalOS/index.html', 'utf8');

const oldQuickActionsRegex = /<!-- Quick Actions -->[\s\S]*?<!-- Today's Tasks -->/;

const newChartsHtml = `<!-- Weekly Trends (Replaces Quick Actions) -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 dark:bg-surface dark:border-[#27272a]">
                            <h3 class="font-bold text-sm text-gray-900 dark:text-white mb-4">Task Velocity (7 Days)</h3>
                            <div class="h-32 w-full">
                                <canvas id="chart-task-velocity"></canvas>
                            </div>
                        </div>
                        <div class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 dark:bg-surface dark:border-[#27272a]">
                            <h3 class="font-bold text-sm text-gray-900 dark:text-white mb-4">Daily Expenses (7 Days)</h3>
                            <div class="h-32 w-full">
                                <canvas id="chart-daily-expense"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Today's Tasks -->`;

html = html.replace(oldQuickActionsRegex, newChartsHtml);
fs.writeFileSync('D:/PersonalOS/index.html', html);


// 2. Update dashboard_app.js
let js = fs.readFileSync('D:/PersonalOS/js/dashboard_app.js', 'utf8');

// I need to add logic to loadProductivityStats and loadFinancialStats to populate these charts, but I can also just create a dedicated function initTrendCharts()
const newJsFunction = `
async function loadTrendCharts() {
    if (typeof OS_DB === 'undefined' || typeof Chart === 'undefined') return;
    
    const tasks = await OS_DB.getTasks();
    const finances = await OS_DB.getFinances();

    // Prepare last 7 days array
    const last7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        last7Days.push(d.toISOString().slice(0, 10)); // YYYY-MM-DD
    }
    
    const displayLabels = last7Days.map(d => {
        const dateObj = new Date(d);
        return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    });

    // 1. Task Velocity
    const taskData = last7Days.map(dateStr => {
        return tasks.filter(t => t.completed && t.updatedAt && t.updatedAt.startsWith(dateStr)).length;
    });

    const vCtx = document.getElementById('chart-task-velocity');
    if (vCtx) {
        if (charts['velocity']) charts['velocity'].destroy();
        charts['velocity'] = new Chart(vCtx, {
            type: 'line',
            data: {
                labels: displayLabels,
                datasets: [{
                    label: 'Tasks Done',
                    data: taskData,
                    borderColor: '#8B5CF6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    }

    // 2. Daily Expenses
    const expData = last7Days.map(dateStr => {
        return finances.filter(f => f.type === 'expense' && f.date && f.date.startsWith(dateStr))
                       .reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
    });

    const dxCtx = document.getElementById('chart-daily-expense');
    if (dxCtx) {
        if (charts['daily-exp']) charts['daily-exp'].destroy();
        charts['daily-exp'] = new Chart(dxCtx, {
            type: 'bar',
            data: {
                labels: displayLabels,
                datasets: [{
                    label: 'Expense',
                    data: expData,
                    backgroundColor: '#EF4444',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { display: false, beginAtZero: true }
                }
            }
        });
    }
}

// Call loadTrendCharts at the end of initDashboard
`;

// Inject into initDashboard
js = js.replace('await loadUpcoming();', 'await loadUpcoming();\n    await loadTrendCharts();');

// Append new function
js = js + '\n' + newJsFunction;

fs.writeFileSync('D:/PersonalOS/js/dashboard_app.js', js);
console.log('Replaced Quick Actions with Trend Charts');
