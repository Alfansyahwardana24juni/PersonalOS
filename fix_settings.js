const fs = require('fs');

let settingsHtml = fs.readFileSync('D:/PersonalOS/settings.html', 'utf8');

// Inject Dexie and db.js before js/main.js
if (!settingsHtml.includes('js/db.js')) {
    settingsHtml = settingsHtml.replace(
        '<script src="js/main.js',
        '<script src="https://unpkg.com/dexie/dist/dexie.js"></script>\n<script src="js/db.js?v=' + Date.now() + '"></script>\n<script src="js/main.js'
    );
}

// Replace Export Logic
const newExport = `async function exportAllData() {
        try {
            const data = {};
            // Get from IndexedDB
            data.tasks = await OS_DB.getTasks();
            data.notes = await OS_DB.getNotes();
            data.finances = await OS_DB.getFinances();
            data.events = await OS_DB.getEvents();
            
            // Get leftovers from localStorage
            const keys = ['user_profile', 'activity_log', 'inbox_items'];
            keys.forEach(k => {
                const val = localStorage.getItem(k);
                if (val) data[k] = JSON.parse(val);
            });
            
            data._exported_at = new Date().toISOString();
            data._version = '2.0'; // IndexedDB version
            
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`personalos_backup_\${new Date().toISOString().slice(0,10)}.json\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            if (window.showToast) window.showToast('Data berhasil diexport!', 'success');
        } catch(e) {
            console.error(e);
            if(window.showToast) window.showToast('Gagal melakukan export data', 'danger');
        }
    }`;

settingsHtml = settingsHtml.replace(/function exportAllData\(\) \{[\s\S]*?if \(window\.showToast\) window\.showToast\('Data berhasil diexport!', 'success'\);\s*\}/, newExport);


// Replace Import Logic
const newImport = `function importAllData(input) {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Import into IndexedDB
                if (data.tasks) { await db.tasks.clear(); await db.tasks.bulkPut(data.tasks); }
                if (data.notes) { await db.notes.clear(); await db.notes.bulkPut(data.notes); }
                if (data.finances) { await db.finances.clear(); await db.finances.bulkPut(data.finances); }
                if (data.events) { await db.events.clear(); await db.events.bulkPut(data.events); }
                
                // Import into LocalStorage
                const keys = ['user_profile','activity_log','inbox_items'];
                keys.forEach(k => {
                    if (data[k] !== undefined) localStorage.setItem(k, JSON.stringify(data[k]));
                });
                
                if (window.showToast) window.showToast('Data berhasil diimport! Halaman akan dimuat ulang...', 'success');
                setTimeout(() => location.reload(), 1500);
            } catch(err) {
                console.error(err);
                if (window.showToast) window.showToast('File tidak valid. Pastikan file JSON dari Personal OS.', 'danger');
            }
        };
        reader.readAsText(file);
    }`;

settingsHtml = settingsHtml.replace(/function importAllData\(input\) \{[\s\S]*?reader\.readAsText\(file\);\s*\}/, newImport);

// Replace Reset Logic
const newReset = `async function confirmReset() {
        try {
            // Clear IndexedDB Tables
            await db.tasks.clear();
            await db.notes.clear();
            await db.finances.clear();
            await db.events.clear();
            await db.projects.clear();
            
            // Clear LocalStorage
            localStorage.clear();
            
            document.getElementById('reset-modal').classList.add('hidden');
            if (window.showToast) window.showToast('Semua data telah dihapus!', 'success');
            setTimeout(() => location.href = 'index.html', 1200);
        } catch(e) {
            console.error(e);
            if(window.showToast) window.showToast('Gagal menghapus data', 'danger');
        }
    }`;

settingsHtml = settingsHtml.replace(/function confirmReset\(\) \{[\s\S]*?setTimeout\(\(\) => location\.href = 'index\.html', 1200\);\s*\}/, newReset);

fs.writeFileSync('D:/PersonalOS/settings.html', settingsHtml);
console.log('Updated settings.html for IndexedDB Export/Import');
