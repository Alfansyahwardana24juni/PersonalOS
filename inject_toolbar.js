const fs = require('fs');
let html = fs.readFileSync('D:/PersonalOS/notes.html', 'utf8');

const toolbarHtml = `
                        <!-- Formatting Toolbar -->
                        <div class="flex items-center space-x-2 mb-4 p-2 bg-gray-50 rounded-lg border border-gray-100 dark:bg-[#18181b] dark:border-[#27272a] sticky top-0 z-10">
                            <button onclick="document.execCommand('formatBlock', false, 'H1');" class="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-200 rounded transition-colors dark:text-gray-400 dark:hover:bg-[#27272a]" title="Heading 1">
                                <span class="font-bold text-sm px-1">H1</span>
                            </button>
                            <button onclick="document.execCommand('formatBlock', false, 'H2');" class="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-200 rounded transition-colors dark:text-gray-400 dark:hover:bg-[#27272a]" title="Heading 2">
                                <span class="font-bold text-sm px-1">H2</span>
                            </button>
                            <button onclick="document.execCommand('formatBlock', false, 'H3');" class="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-200 rounded transition-colors dark:text-gray-400 dark:hover:bg-[#27272a]" title="Heading 3">
                                <span class="font-bold text-sm px-1">H3</span>
                            </button>
                            <div class="w-px h-5 bg-gray-300 mx-1 dark:bg-gray-700"></div>
                            <button onclick="document.execCommand('insertUnorderedList');" class="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-200 rounded transition-colors dark:text-gray-400 dark:hover:bg-[#27272a]" title="Bullet List">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16M8 6h.01M8 12h.01M8 18h.01"></path></svg>
                            </button>
                            <button onclick="document.execCommand('insertOrderedList');" class="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-200 rounded transition-colors dark:text-gray-400 dark:hover:bg-[#27272a]" title="Numbered List">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                            </button>
                            <div class="w-px h-5 bg-gray-300 mx-1 dark:bg-gray-700"></div>
                            <button onclick="document.execCommand('bold');" class="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-200 rounded transition-colors dark:text-gray-400 dark:hover:bg-[#27272a]" title="Bold">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5h5.5c1.933 0 3.5 1.567 3.5 3.5S13.433 12 11.5 12H6V5zm0 7h6.5c2.21 0 4 1.79 4 4s-1.79 4-4 4H6v-8z"></path></svg>
                            </button>
                            <button onclick="document.execCommand('italic');" class="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-200 rounded transition-colors dark:text-gray-400 dark:hover:bg-[#27272a]" title="Italic">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 5h6M8 19h6M14 5l-4 14"></path></svg>
                            </button>
                        </div>
`;

if (!html.includes('<!-- Formatting Toolbar -->')) {
    html = html.replace('<!-- Input Isi Utama -->', toolbarHtml + '\n                        <!-- Input Isi Utama -->');
    fs.writeFileSync('D:/PersonalOS/notes.html', html);
    console.log('Toolbar injected');
} else {
    console.log('Already has toolbar');
}
