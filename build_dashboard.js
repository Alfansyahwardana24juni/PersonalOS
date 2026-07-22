const fs = require('fs');

const mainHtml = `
    <!-- Topbar -->
    <header class="h-16 bg-surface flex items-center justify-between px-6 shrink-0 z-10 dark:bg-surface dark:border-[#27272a] border-b border-border/50">
        <div class="flex-1 max-w-lg">
            <h1 class="text-xl font-bold text-primary">Dashboard</h1>
        </div> 
        <!-- Header Right Actions -->
        <div class="flex items-center space-x-4 ml-4">
            <button id="topbar-search-btn" onclick="if(typeof window.openCommandPalette === 'function') window.openCommandPalette()" class="relative p-2 text-gray-400 hover:text-primary transition-colors bg-gray-100 dark:bg-[#27272a] rounded-full hidden md:flex items-center gap-2" title="Cari (Ctrl+K)">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 pr-1">Ctrl K</span>
            </button>
            <button onclick="if(typeof window.openCommandPalette === 'function') window.openCommandPalette()" class="md:hidden relative p-2 text-gray-400 hover:text-primary transition-colors" title="Cari">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <button onclick="toggleDarkMode()" class="relative p-2 text-gray-400 hover:text-primary transition-colors" title="Ganti Tema">
                <svg class="h-5 w-5 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                <svg class="h-5 w-5 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            </button>
            <a href="inbox.html" class="relative p-2 text-gray-400 hover:text-primary transition-colors"> 
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg> 
                <span class="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-surface"></span>
            </a>
            <div class="relative" id="profile-menu-container">
                <div class="h-8 w-8 rounded-full border border-border overflow-hidden cursor-pointer hover:ring-2 hover:ring-gray-100 transition-all dark:border-[#27272a]" onclick="if(typeof window.toggleProfileMenu === 'function') { window.toggleProfileMenu(event); } else { document.getElementById('profile-dropdown').classList.toggle('opacity-0'); document.getElementById('profile-dropdown').classList.toggle('invisible'); document.getElementById('profile-dropdown').classList.toggle('scale-95'); document.getElementById('profile-dropdown').classList.toggle('scale-100'); event.stopPropagation(); }">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=F8FAFC" alt="Avatar" class="h-full w-full object-cover"> 
                </div> 
                <div id="profile-dropdown" class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible transition-all transform scale-95 origin-top-right z-50 dark:bg-surface dark:border-[#27272a]">
                    <div class="p-4 border-b border-gray-50 flex items-center gap-3 dark:border-[#27272a]">
                        <div class="h-10 w-10 rounded-full border border-gray-200 overflow-hidden shrink-0 bg-gray-50 dark:border-[#27272a] dark:bg-[#09090b]">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=F8FAFC" alt="Avatar" class="h-full w-full object-cover"> 
                        </div>
                        <div>
                            <p class="text-sm font-bold text-gray-800 dark:text-gray-200">Felix</p>
                            <p class="text-[10px] text-gray-500 dark:text-gray-400">felix@example.com</p>
                        </div>
                    </div>
                    <div class="p-2"> 
                        <a href="profile.html" class="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-xl transition-colors dark:text-gray-400 dark:hover:bg-[#27272a]">
                            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> Edit Profil 
                        </a>
                        <a href="settings.html" class="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-xl transition-colors dark:text-gray-400 dark:hover:bg-[#27272a]">
                            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Pengaturan 
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Dashboard -->
    <div class="flex-1 overflow-y-auto custom-scrollbar bg-[#F8FAFC] dark:bg-[#09090b]">
        <div class="max-w-6xl mx-auto p-6 lg:p-10 space-y-8 animate-fade-in">
            
            <!-- Welcome Header -->
            <div class="flex flex-col mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white" id="dash-greeting">Good Morning, Alfa 👋</h1>
                <p class="text-gray-500 mt-1 font-medium dark:text-gray-400" id="dash-date">Monday, 22 July 2026</p>
            </div>

            <!-- Financial Overview (Horizontal Scroll on Mobile) -->
            <div class="flex overflow-x-auto pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 gap-4 hide-scrollbar snap-x">
                
                <!-- Wealth Card -->
                <div class="snap-center shrink-0 w-72 lg:w-auto bg-white rounded-3xl p-6 shadow-sm border border-gray-100 dark:bg-surface dark:border-[#27272a] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div class="flex justify-between items-center mb-4">
                        <div class="p-2.5 bg-blue-50 text-blue-600 rounded-xl dark:bg-blue-900/20 dark:text-blue-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                        </div>
                        <span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg> 12.5%
                        </span>
                    </div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Wealth</p>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1" id="dash-total-wealth">Rp 0</h3>
                    <div class="h-10 mt-4 w-full">
                        <canvas id="chart-wealth"></canvas>
                    </div>
                </div>

                <!-- Income Card -->
                <div class="snap-center shrink-0 w-72 lg:w-auto bg-white rounded-3xl p-6 shadow-sm border border-gray-100 dark:bg-surface dark:border-[#27272a] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div class="flex justify-between items-center mb-4">
                        <div class="p-2.5 bg-green-50 text-green-600 rounded-xl dark:bg-green-900/20 dark:text-green-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        </div>
                    </div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Income This Month</p>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1" id="dash-income">Rp 0</h3>
                    <div class="h-10 mt-4 w-full">
                        <canvas id="chart-income"></canvas>
                    </div>
                </div>

                <!-- Expense Card -->
                <div class="snap-center shrink-0 w-72 lg:w-auto bg-white rounded-3xl p-6 shadow-sm border border-gray-100 dark:bg-surface dark:border-[#27272a] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div class="flex justify-between items-center mb-4">
                        <div class="p-2.5 bg-red-50 text-red-600 rounded-xl dark:bg-red-900/20 dark:text-red-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                        </div>
                    </div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Expense This Month</p>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1" id="dash-expense">Rp 0</h3>
                    <div class="h-10 mt-4 w-full">
                        <canvas id="chart-expense"></canvas>
                    </div>
                </div>

                <!-- Saving Goal Card -->
                <div class="snap-center shrink-0 w-72 lg:w-auto bg-white rounded-3xl p-6 shadow-sm border border-gray-100 dark:bg-surface dark:border-[#27272a] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div class="flex justify-between items-center mb-4">
                        <div class="p-2.5 bg-brand/10 text-brand rounded-xl dark:bg-brand/20">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                        </div>
                        <span class="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg dark:bg-[#18181b] dark:text-gray-400" id="dash-goal-pct">0%</span>
                    </div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Saving Goal</p>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-1 truncate" id="dash-goal-text">Rp 0 / 0</h3>
                    <div class="w-full bg-gray-100 rounded-full h-2 mt-6 dark:bg-[#18181b] overflow-hidden">
                        <div class="bg-brand h-2 rounded-full transition-all duration-1000 ease-out" id="dash-goal-bar" style="width: 0%"></div>
                    </div>
                </div>
            </div>

            <!-- Main Layout Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <!-- Left Column (Wider) -->
                <div class="lg:col-span-2 space-y-6">
                    
                    <!-- Quick Actions -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button onclick="if(typeof openQuickAdd === 'function') openQuickAdd('task')" class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-brand hover:text-brand transition-colors group dark:bg-surface dark:border-[#27272a] dark:hover:border-brand">
                            <div class="p-3 bg-gray-50 rounded-xl group-hover:bg-brand/10 transition-colors mb-3 dark:bg-[#09090b]">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <span class="text-xs font-semibold">New Task</span>
                        </button>
                        <button onclick="if(typeof openQuickAdd === 'function') openQuickAdd('note')" class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-brand hover:text-brand transition-colors group dark:bg-surface dark:border-[#27272a] dark:hover:border-brand">
                            <div class="p-3 bg-gray-50 rounded-xl group-hover:bg-brand/10 transition-colors mb-3 dark:bg-[#09090b]">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </div>
                            <span class="text-xs font-semibold">New Note</span>
                        </button>
                        <button onclick="if(typeof openQuickAdd === 'function') openQuickAdd('income')" class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-green-500 hover:text-green-600 transition-colors group dark:bg-surface dark:border-[#27272a] dark:hover:border-green-500">
                            <div class="p-3 bg-gray-50 rounded-xl group-hover:bg-green-50 transition-colors mb-3 dark:bg-[#09090b] dark:group-hover:bg-green-900/20">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            </div>
                            <span class="text-xs font-semibold">Add Income</span>
                        </button>
                        <button onclick="if(typeof openQuickAdd === 'function') openQuickAdd('expense')" class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-red-500 hover:text-red-600 transition-colors group dark:bg-surface dark:border-[#27272a] dark:hover:border-red-500">
                            <div class="p-3 bg-gray-50 rounded-xl group-hover:bg-red-50 transition-colors mb-3 dark:bg-[#09090b] dark:group-hover:bg-red-900/20">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                            </div>
                            <span class="text-xs font-semibold">Add Expense</span>
                        </button>
                    </div>

                    <!-- Today's Tasks -->
                    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 dark:bg-surface dark:border-[#27272a]">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white">Today's Tasks</h3>
                            <a href="tasks.html" class="text-xs font-bold text-brand hover:underline">View All</a>
                        </div>
                        <ul id="dashboard-tasks" class="space-y-3">
                            <!-- Tasks injected here -->
                            <div class="py-8 text-center text-sm text-gray-400">Loading tasks...</div>
                        </ul>
                    </div>

                    <!-- Cash Flow Chart -->
                    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 dark:bg-surface dark:border-[#27272a]">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white">Cash Flow</h3>
                        </div>
                        <div class="h-64 w-full">
                            <canvas id="chart-cashflow"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Right Column (Narrower) -->
                <div class="space-y-6">
                    
                    <!-- Productivity Summary -->
                    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 dark:bg-surface dark:border-[#27272a]">
                        <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-6">Productivity</h3>
                        <div class="flex items-center justify-center mb-6">
                            <!-- Circular Progress -->
                            <div class="relative w-32 h-32">
                                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path class="text-gray-100 dark:text-[#18181b]" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path class="text-brand transition-all duration-1000 ease-out" id="dash-prod-ring" stroke-dasharray="0, 100" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <div class="absolute inset-0 flex items-center justify-center flex-col">
                                    <span class="text-2xl font-bold text-gray-900 dark:text-white" id="dash-prod-pct">0%</span>
                                    <span class="text-[10px] text-gray-500">Done</span>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-center">
                            <div class="p-3 bg-gray-50 rounded-xl dark:bg-[#09090b]">
                                <p class="text-xl font-bold text-gray-900 dark:text-white" id="dash-prod-completed">0</p>
                                <p class="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-1">Completed</p>
                            </div>
                            <div class="p-3 bg-gray-50 rounded-xl dark:bg-[#09090b]">
                                <p class="text-xl font-bold text-gray-900 dark:text-white" id="dash-prod-pending">0</p>
                                <p class="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-1">Pending</p>
                            </div>
                        </div>
                    </div>

                    <!-- Expense Analytics -->
                    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 dark:bg-surface dark:border-[#27272a]">
                        <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-6">Expense Analytics</h3>
                        <div class="h-48 w-full flex justify-center">
                            <canvas id="chart-pie-expense"></canvas>
                        </div>
                    </div>

                    <!-- Upcoming Deadline -->
                    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 dark:bg-surface dark:border-[#27272a]">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white">Upcoming</h3>
                        </div>
                        <ul id="dashboard-upcoming" class="space-y-4">
                            <!-- Deadlines injected here -->
                            <div class="text-center text-sm text-gray-400">No upcoming deadlines</div>
                        </ul>
                    </div>

                </div>
            </div>
            
            <div class="h-24 md:h-10"></div>
        </div>
    </div>
    
    <!-- Quick Add FAB (Global) --> 
    <button id="quick-add-btn" class="absolute bottom-20 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-gray-400/30 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center group focus:outline-none focus:ring-4 focus:ring-gray-200 z-50 dark:bg-[#FAFAFA] dark:text-[#09090b]">
        <svg class="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg> 
    </button>
    
    <!-- Mobile Nav -->
    <nav class="md:hidden absolute bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-around items-center h-16 z-40 px-2 pb-safe shadow-[0_-1px_10px_rgba(0,0,0,0.02)] dark:bg-surface dark:border-[#27272a]">
        <a href="index.html" class="flex flex-col items-center justify-center w-full h-full text-brand transition-colors"> 
            <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span class="text-[10px] font-medium">Dasbor</span>
        </a>
        <a href="tasks.html" class="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-primary transition-colors"> 
            <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-[10px] font-medium">Tugas</span>
        </a>
        <a href="calendar.html" class="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-primary transition-colors"> 
            <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span class="text-[10px] font-medium">Kalender</span>
        </a>
        <a href="notes.html" class="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-primary transition-colors"> 
            <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            <span class="text-[10px] font-medium">Catatan</span>
        </a>
        <a href="finance.html" class="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-primary transition-colors"> 
            <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-[10px] font-medium">Keuangan</span>
        </a>
    </nav>
`;

let content = fs.readFileSync('D:/PersonalOS/index.html', 'utf8');

// Also inject Chart.js in header if missing
if (!content.includes('chart.js')) {
    content = content.replace('</head>', '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n</head>');
}

content = content.replace(/<header[\s\S]*?<\/nav>/, mainHtml);

fs.writeFileSync('D:/PersonalOS/index.html', content);
console.log('Replaced index.html main layout with new Dashboard');
