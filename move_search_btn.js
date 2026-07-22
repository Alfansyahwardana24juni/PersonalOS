const fs = require('fs');

// 1. Remove floating button from command_palette.js
let code = fs.readFileSync('D:/PersonalOS/js/command_palette.js', 'utf8');
code = code.replace(/<!-- Floating Search Button -->[\s\S]*?<\/button>/, '');
fs.writeFileSync('D:/PersonalOS/js/command_palette.js', code);
console.log('Removed floating button from command_palette.js');

// 2. Add search button to topbar in all HTML files
const files = fs.readdirSync('D:/PersonalOS').filter(f => f.endsWith('.html'));
for (const file of files) {
    let content = fs.readFileSync('D:/PersonalOS/' + file, 'utf8');
    
    // Check if search button is already there
    if (!content.includes('id="topbar-search-btn"')) {
        const searchBtnHtml = `
<button id="topbar-search-btn" onclick="if(typeof window.openCommandPalette === 'function') window.openCommandPalette()" class="relative p-2 text-gray-400 hover:text-primary transition-colors bg-gray-100 dark:bg-[#27272a] rounded-full hidden md:flex items-center gap-2" title="Cari (Ctrl+K)">
    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 pr-1">Ctrl K</span>
</button>
<button onclick="if(typeof window.openCommandPalette === 'function') window.openCommandPalette()" class="md:hidden relative p-2 text-gray-400 hover:text-primary transition-colors" title="Cari">
    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
</button>`;
        
        // Insert right after <div class="flex items-center space-x-4 ml-4"> or <div class="flex items-center space-x-3 ml-4">
        content = content.replace(/(<div class="flex items-center space-x-[34] ml-4">)/, '$1\n' + searchBtnHtml);
        fs.writeFileSync('D:/PersonalOS/' + file, content);
    }
}
console.log('Added search button to topbar in all HTML files');
