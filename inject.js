const fs = require('fs');
const files = ['dashboard.html', 'inbox.html', 'tasks.html', 'notes.html', 'finance.html', 'calendar.html', 'profile.html', 'settings.html', 'index.html'];

files.forEach(file => {
    if (fs.existsSync('D:/PersonalOS/' + file)) {
        let content = fs.readFileSync('D:/PersonalOS/' + file, 'utf8');
        
        // Add projects link to sidebar if it doesn't exist
        if (!content.includes('projects.html')) {
            content = content.replace(
                /<a href="finance\.html"[\s\S]*?<\/a>/,
                `$&
                <a href="projects.html" class="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#27272a] hover:text-brand rounded-xl transition-colors font-medium">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                    </svg>
                    Projects
                </a>`
            );
        }
        
        // Add dexie and db.js right before the main app script
        if (!content.includes('dexie.js')) {
            content = content.replace(
                /<script src="js\/(tasks_app|notes_app|finance_app|calendar_app|dashboard_app|inbox_app)\.js"><\/script>/,
                '<script src="https://unpkg.com/dexie/dist/dexie.js"></script>\n    <script src="js/db.js"></script>\n    $&'
            );
        }
        
        fs.writeFileSync('D:/PersonalOS/' + file, content);
        console.log('Updated ' + file);
    }
});
