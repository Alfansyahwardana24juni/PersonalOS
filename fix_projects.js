const fs = require('fs');

let layout = fs.readFileSync('D:/PersonalOS/settings.html', 'utf8');

// Find the header text to verify
layout = layout.replace(/<h1 class="text-xl font-bold text-primary">Pengaturan<\/h1>/, '<h1 class="text-xl font-bold text-primary">Proyek</h1>');

// Change active nav
layout = layout.replace(/bg-brand\/10 text-brand/g, 'text-gray-600 dark:text-gray-400 hover:bg-gray-50');

const projectsContent = `
            <div class="p-6">
                <!-- Header -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Daftar Proyek</h2>
                        <p class="text-gray-500 text-sm mt-1 dark:text-gray-400">Pusat seluruh tugas, catatan, dan keuangan Anda.</p>
                    </div>
                    <button onclick="openProjectModal()" class="bg-brand hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Proyek Baru
                    </button>
                </div>
                
                <!-- Filters -->
                <div class="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    <button onclick="filterProjects('All')" class="filter-btn active px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium whitespace-nowrap dark:bg-white dark:text-gray-900">Semua</button>
                    <button onclick="filterProjects('Active')" class="filter-btn px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium whitespace-nowrap dark:bg-surface dark:border-[#27272a] dark:text-gray-300">Aktif</button>
                    <button onclick="filterProjects('Completed')" class="filter-btn px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium whitespace-nowrap dark:bg-surface dark:border-[#27272a] dark:text-gray-300">Selesai</button>
                </div>

                <!-- Projects Grid -->
                <div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Cards will be rendered here -->
                </div>
            </div>

            <!-- Add/Edit Project Modal -->
            <div id="project-modal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[9999] hidden flex items-center justify-center">
                <div class="bg-white dark:bg-surface w-full max-w-md rounded-2xl shadow-xl transform scale-95 opacity-0 transition-all duration-200 m-4" id="project-modal-content">
                    <div class="p-6 border-b border-gray-100 dark:border-[#27272a] flex justify-between items-center">
                        <h3 class="text-lg font-bold text-gray-800 dark:text-white" id="modal-title">Proyek Baru</h3>
                        <button onclick="closeProjectModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    <div class="p-6 space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Nama Proyek</label>
                            <input type="text" id="project-title" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent dark:bg-[#18181b] dark:border-[#27272a] dark:text-white transition-all" placeholder="Misal: Redesign Website App">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Deskripsi (Opsional)</label>
                            <textarea id="project-desc" rows="3" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent dark:bg-[#18181b] dark:border-[#27272a] dark:text-white transition-all" placeholder="Tuliskan tujuan proyek ini..."></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Status</label>
                                <select id="project-status" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand dark:bg-[#18181b] dark:border-[#27272a] dark:text-white appearance-none">
                                    <option value="Active">Aktif</option>
                                    <option value="On Hold">Tertunda</option>
                                    <option value="Completed">Selesai</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Target Tanggal</label>
                                <input type="date" id="project-deadline" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent dark:bg-[#18181b] dark:border-[#27272a] dark:text-white transition-all">
                            </div>
                        </div>
                    </div>
                    <div class="p-6 border-t border-gray-100 dark:border-[#27272a] flex justify-between items-center bg-gray-50 dark:bg-[#18181b] rounded-b-2xl">
                        <button id="btn-delete" onclick="deleteProject()" class="text-danger hover:text-red-700 font-medium text-sm hidden">Hapus Proyek</button>
                        <div class="flex gap-3 ml-auto">
                            <button onclick="closeProjectModal()" class="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors dark:text-gray-400 dark:hover:bg-[#27272a]">Batal</button>
                            <button onclick="saveProject()" class="px-5 py-2.5 bg-brand hover:bg-brand-600 text-white font-medium rounded-xl transition-all shadow-sm shadow-brand/30">Simpan Proyek</button>
                        </div>
                    </div>
                </div>
            </div>
`;

// Replace everything inside <div class="flex-1 flex flex-col overflow-hidden">
layout = layout.replace(/<div class="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-gray-50\/50 dark:bg-\[#09090b\]\/50 p-6 md:p-8">[\s\S]*?<!-- Mobile Bottom Navigation -->/, '<div class="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-[#09090b]/50">' + projectsContent + '</div>\n<!-- Mobile Bottom Navigation -->');

// Change script tags at bottom
layout = layout.replace(/<script src="js\/settings_app\.js"><\/script>/, '<script src="js/projects_app.js"></script>');

fs.writeFileSync('D:/PersonalOS/projects.html', layout);
console.log('projects.html rewritten properly from settings.html');
