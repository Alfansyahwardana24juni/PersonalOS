const fs = require('fs');

// Create projects.html based on tasks.html structure
let template = fs.readFileSync('D:/PersonalOS/tasks.html', 'utf8');

// Replace titles and active links
template = template.replace(/<title>Tasks(.*?)<\/title>/, '<title>Projects - Personal OS</title>');
template = template.replace(/<h1 class=\"text-xl font-bold text-gray-800 dark:text-white\">Tugas<\/h1>/, '<h1 class=\"text-xl font-bold text-gray-800 dark:text-white\">Proyek</h1>');

// Swap active state on the sidebar
// Remove bg-brand-50 from Tasks
template = template.replace(/<a href=\"tasks\.html\" class=\"flex items-center px-4 py-3 text-brand bg-brand-50 dark:bg-brand-900\/20 dark:text-brand-300 rounded-xl transition-colors font-medium\">/g, '<a href=\"tasks.html\" class=\"flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#27272a] hover:text-brand rounded-xl transition-colors font-medium\">');
template = template.replace(/<svg class=\"w-5 h-5 mr-3 text-brand\"/g, '<svg class=\"w-5 h-5 mr-3\"');

// Add active state to Projects link. Currently Projects link looks like:
// <a href="#" class="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#27272a] hover:text-brand rounded-xl transition-colors font-medium">
//     <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
//     </svg>
//     Projects
// </a>

// We will just use string replacement on the href="#" line if it matches Projects
template = template.replace(
    /<a href="#" class="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-\[\#27272a\] hover:text-brand rounded-xl transition-colors font-medium">\s*<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">\s*<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"><\/path>\s*<\/svg>\s*Projects\s*<\/a>/g,
    `<a href="projects.html" class="flex items-center px-4 py-3 text-brand bg-brand-50 dark:bg-brand-900/20 dark:text-brand-300 rounded-xl transition-colors font-medium">
                    <svg class="w-5 h-5 mr-3 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                    </svg>
                    Projects
                </a>`
);


// Change content area
const projectsContent = `
            <!-- Main Content Area -->
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
            <div id="project-modal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center">
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

// Inject Dexie and DB before app script
template = template.replace(/<script src="js\/tasks_app\.js"><\/script>/, '<script src="https://unpkg.com/dexie/dist/dexie.js"></script>\n    <script src="js/db.js"></script>\n    <script src="js/projects_app.js"></script>');

// Replace main content
// The regex below might fail if formatting is slightly different, let's just replace everything between 
// <div class="flex-1 p-6 md:p-8 overflow-x-auto min-h-screen pb-24 md:pb-8"> and the end of that div
template = template.replace(/<div class="flex-1 p-6 md:p-8 overflow-x-auto min-h-screen pb-24 md:pb-8">[\s\S]*?<\/div>\s*<!-- Add\/Edit Task Modal -->[\s\S]*?<\/div>\s*<\/div>/, '<div class="flex-1 overflow-y-auto min-h-screen pb-24 md:pb-8">' + projectsContent + '</div>');

fs.writeFileSync('D:/PersonalOS/projects.html', template);
console.log('projects.html created');
