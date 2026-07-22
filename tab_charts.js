const fs = require('fs');

let html = fs.readFileSync('D:/PersonalOS/index.html', 'utf8');

const oldChartsRegex = /<!-- Weekly Trends \(Replaces Quick Actions\) -->[\s\S]*?<!-- Today's Tasks -->/;

const newChartsHtml = `<!-- Weekly Trends (Tabbed for Space Efficiency) -->
                    <div class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 dark:bg-surface dark:border-[#27272a] col-span-1 lg:col-span-2">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-bold text-sm text-gray-900 dark:text-white" id="trend-title">Task Velocity (7 Days)</h3>
                            <div class="flex bg-gray-100 p-1 rounded-lg dark:bg-[#18181b] gap-1">
                                <button onclick="switchTrendTab('velocity')" id="tab-velocity" class="px-3 py-1 text-[10px] md:text-xs font-semibold rounded-md transition-all bg-white shadow-sm text-brand dark:bg-surface dark:text-brand">Tasks</button>
                                <button onclick="switchTrendTab('expense')" id="tab-expense" class="px-3 py-1 text-[10px] md:text-xs font-semibold rounded-md transition-all text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Expenses</button>
                            </div>
                        </div>
                        
                        <div id="view-velocity" class="h-40 w-full transition-opacity duration-300">
                            <canvas id="chart-task-velocity"></canvas>
                        </div>
                        
                        <div id="view-expense" class="h-40 w-full hidden transition-opacity duration-300">
                            <canvas id="chart-daily-expense"></canvas>
                        </div>
                    </div>

                    <script>
                        function switchTrendTab(tab) {
                            const vTab = document.getElementById('tab-velocity');
                            const eTab = document.getElementById('tab-expense');
                            const vView = document.getElementById('view-velocity');
                            const eView = document.getElementById('view-expense');
                            const title = document.getElementById('trend-title');
                            
                            const activeClass = 'bg-white shadow-sm text-brand dark:bg-surface dark:text-brand';
                            const inactiveClass = 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-transparent shadow-none';

                            if (tab === 'velocity') {
                                vTab.className = \`px-3 py-1 text-[10px] md:text-xs font-semibold rounded-md transition-all \${activeClass}\`;
                                eTab.className = \`px-3 py-1 text-[10px] md:text-xs font-semibold rounded-md transition-all \${inactiveClass}\`;
                                eView.classList.add('hidden');
                                vView.classList.remove('hidden');
                                title.textContent = 'Task Velocity (7 Days)';
                            } else {
                                eTab.className = \`px-3 py-1 text-[10px] md:text-xs font-semibold rounded-md transition-all \${activeClass}\`;
                                vTab.className = \`px-3 py-1 text-[10px] md:text-xs font-semibold rounded-md transition-all \${inactiveClass}\`;
                                vView.classList.add('hidden');
                                eView.classList.remove('hidden');
                                title.textContent = 'Daily Expenses (7 Days)';
                            }
                        }
                    </script>

                    <!-- Today's Tasks -->`;

html = html.replace(oldChartsRegex, newChartsHtml);
fs.writeFileSync('D:/PersonalOS/index.html', html);
console.log('Replaced trend charts with tabbed interface');
