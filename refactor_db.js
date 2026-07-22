const fs = require('fs');

// 1. Refactor tasks_app.js
let tasksCode = fs.readFileSync('D:/PersonalOS/js/tasks_app.js', 'utf8');

const loadDataRegex = /function loadData\(\) \{[\s\S]*?\n\}/;
const saveDataRegex = /function saveData\(\) \{[\s\S]*?\n\}/;

const newLoadData = `async function loadData() {
    try {
        const savedCols = localStorage.getItem('task_columns');
        if (savedCols) {
            boardData.columns = JSON.parse(savedCols);
            boardData.columns.forEach(c => c.tasks = []);
        } else {
            // Default columns
            boardData.columns = [
                { id: 'col_1', title: 'Akan Dikerjakan', color: 'bg-gray-400', tasks: [] },
                { id: 'col_2', title: 'Sedang Dikerjakan', color: 'bg-warning', tasks: [] },
                { id: 'col_3', title: 'Selesai', color: 'bg-success', tasks: [] }
            ];
        }

        const dbTasks = await db.tasks.toArray(); // Assuming db is global from db.js
        if (dbTasks.length > 0) {
            dbTasks.forEach(task => {
                let col = boardData.columns.find(c => c.id === task.colId);
                if (!col && task.status) col = boardData.columns.find(c => c.title === task.status);
                if (!col) col = boardData.columns[0];
                if (col) col.tasks.push(task);
            });
        }
        
        renderBoard();
    } catch(e) {
        console.error('Error loading tasks from IndexedDB', e);
    }
}`;

const newSaveData = `async function saveData() {
    try {
        const colsMeta = boardData.columns.map(c => ({ id: c.id, title: c.title, color: c.color }));
        localStorage.setItem('task_columns', JSON.stringify(colsMeta));

        let allTasks = [];
        boardData.columns.forEach(col => {
            col.tasks.forEach(t => {
                t.colId = col.id;
                t.status = col.title;
                allTasks.push(t);
            });
        });

        await db.tasks.clear();
        await db.tasks.bulkPut(allTasks);
    } catch(e) {
        console.error('Error saving tasks to IndexedDB', e);
    }
}`;

tasksCode = tasksCode.replace(loadDataRegex, newLoadData);
tasksCode = tasksCode.replace(saveDataRegex, newSaveData);
fs.writeFileSync('D:/PersonalOS/js/tasks_app.js', tasksCode);
console.log('Migrated tasks_app.js');

// 2. Refactor finance_app.js
let financeCode = fs.readFileSync('D:/PersonalOS/js/finance_app.js', 'utf8');
const saveFinanceRegex = /function saveFinanceData\(\) \{[\s\S]*?\n\}/;
const newSaveFinance = `async function saveFinanceData() {
    try {
        localStorage.setItem('finance_accounts', JSON.stringify(accounts));
        localStorage.setItem('finance_goals', JSON.stringify(goals));
        
        await db.finances.clear();
        await db.finances.bulkPut(transactions);
    } catch(e) {
        console.error('Error saving finance to IndexedDB', e);
    }
}`;
financeCode = financeCode.replace(saveFinanceRegex, newSaveFinance);

// Update initialization to load from DB
const initFinanceRegex = /document\.addEventListener\('DOMContentLoaded', \(\) => \{[\s\S]*?renderDashboard\(\);\n\}\);/;
const newInitFinance = `document.addEventListener('DOMContentLoaded', async () => {
    try {
        const dbTransactions = await db.finances.toArray();
        if (dbTransactions && dbTransactions.length > 0) {
            transactions = dbTransactions;
        }
    } catch(e) {
        console.error('Error loading finances', e);
    }
    renderDashboard();
});`;
financeCode = financeCode.replace(initFinanceRegex, newInitFinance);
fs.writeFileSync('D:/PersonalOS/js/finance_app.js', financeCode);
console.log('Migrated finance_app.js');

// 3. Refactor notes in notes.html
let notesHtml = fs.readFileSync('D:/PersonalOS/notes.html', 'utf8');
const saveNotesRegex = /function saveNotes\(\) \{[\s\S]*?localStorage\.setItem\('personal_os_notes', JSON\.stringify\(notes\)\);\n\s*localStorage\.setItem\('user_notes', JSON\.stringify\(notes\)\);\n\s*updateSidebar\(\);\n\s*\}/;
const newSaveNotes = `async function saveNotes() {
            try {
                await db.notes.clear();
                await db.notes.bulkPut(notes);
            } catch(e) {
                console.error(e);
            }
            updateSidebar();
        }`;
notesHtml = notesHtml.replace(saveNotesRegex, newSaveNotes);

// We need to intercept the init function for notes to load from DB
const notesInitRegex = /const savedNotes = localStorage\.getItem\('personal_os_notes'\) \|\| localStorage\.getItem\('user_notes'\);\n\s*if \(savedNotes\) \{\n\s*notes = JSON\.parse\(savedNotes\);\n\s*\} else \{\n\s*notes = \[/;
const newNotesInit = `const savedNotes = localStorage.getItem('personal_os_notes'); // keep old code string so we can inject properly, but we'll load async`;
// Let's do a more robust regex replacement for notes initialization
const oldInitBlock = `        function initNotes() {
            // Muat catatan dari LocalStorage jika ada, jika tidak pakai default
            const savedNotes = localStorage.getItem('personal_os_notes') || localStorage.getItem('user_notes');
            if (savedNotes) {
                notes = JSON.parse(savedNotes);
            } else {
                notes = [`;
                
const newInitBlock = `        async function initNotes() {
            try {
                const dbNotes = await db.notes.toArray();
                if (dbNotes && dbNotes.length > 0) {
                    notes = dbNotes;
                } else {
                    notes = [`;
notesHtml = notesHtml.replace(oldInitBlock, newInitBlock);

// Replace "document.addEventListener('DOMContentLoaded', () => { initNotes(); });" with "initNotes();" if needed, wait, it's inside DOMContentLoaded
notesHtml = notesHtml.replace(/document\.addEventListener\('DOMContentLoaded', \(\) => \{\n\s*initNotes\(\);/, "document.addEventListener('DOMContentLoaded', async () => {\n            await initNotes();");

fs.writeFileSync('D:/PersonalOS/notes.html', notesHtml);
console.log('Migrated notes.html');
