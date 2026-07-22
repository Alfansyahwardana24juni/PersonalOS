const fs = require('fs');
let content = fs.readFileSync('D:/PersonalOS/tasks.html', 'utf8');

const quickAddHtml = `
            <!-- Quick Add Bar -->
            <div class="px-6 py-3 border-b border-border bg-gray-50/30 dark:bg-black/20 dark:border-[#27272a]">
                <div class="relative max-w-4xl mx-auto flex items-center">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    <input type="text" id="quick-add-task" class="block w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand shadow-sm transition-all dark:bg-[#18181b] dark:border-[#27272a] dark:text-white" placeholder="Ketik tugas baru (misal: Rapat klien esok 14:00 !p1) lalu tekan Enter..." onkeydown="if(event.key==='Enter') handleQuickAddTask()">
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none gap-1">
                        <span class="px-1.5 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-500 rounded dark:bg-[#27272a] dark:text-gray-400">Enter</span>
                        <span class="px-1.5 py-0.5 text-[10px] font-medium bg-brand/10 text-brand rounded dark:bg-brand/20">NLP</span>
                    </div>
                </div>
            </div>
`;

if (!content.includes('id="quick-add-task"')) {
    content = content.replace(/<!-- List View \(Hidden by default\) -->/, quickAddHtml + '\n<!-- List View (Hidden by default) -->');
    fs.writeFileSync('D:/PersonalOS/tasks.html', content);
    console.log("Quick Add injected.");
} else {
    console.log("Already injected.");
}
