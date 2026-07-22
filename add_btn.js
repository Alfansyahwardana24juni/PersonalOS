const fs = require('fs');
let code = fs.readFileSync('D:/PersonalOS/js/command_palette.js', 'utf8');

const floatingBtnHtml = `
    <!-- Floating Search Button -->
    <button onclick="openCommandPalette()" class="fixed bottom-24 right-6 md:bottom-6 md:right-6 w-14 h-14 bg-primary text-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all z-[9900] flex flex-col items-center justify-center dark:bg-white dark:text-black border border-border dark:border-[#27272a]" title="Cari (Ctrl+K)">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <span class="text-[8px] font-bold mt-0.5 opacity-80 uppercase tracking-widest">Cari</span>
    </button>
`;

if (!code.includes('Floating Search Button')) {
    code = code.replace('<!-- Quick Add Modal -->', floatingBtnHtml + '\n    <!-- Quick Add Modal -->');
}

// Ensure Cmd+K works (Mac support) and catch any case for Windows
code = code.replace(/if \(e\.ctrlKey && e\.key\.toLowerCase\(\) === 'k'\)/g, "if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')");

fs.writeFileSync('D:/PersonalOS/js/command_palette.js', code);
console.log('Added floating search button');
