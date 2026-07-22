const fs = require('fs');

let code = fs.readFileSync('D:/PersonalOS/js/tasks_app.js', 'utf8');

const newDataModel = `
async function saveData() {
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

        // Use OS_DB instead of raw db
        const currentTasks = await OS_DB.getTasks();
        for (let t of currentTasks) {
            await OS_DB.deleteTask(t.id);
        }
        
        for (let t of allTasks) {
            await OS_DB.addTask(t);
        }
    } catch(e) {
        console.error('Error saving tasks to IndexedDB', e);
    }
}

async function loadData() {
    try {
        const savedCols = localStorage.getItem('task_columns');
        if (savedCols) {
            boardData.columns = JSON.parse(savedCols);
            boardData.columns.forEach(c => c.tasks = []);
        } else {
            // Default columns
            boardData.columns = [
                { id: 'col-todo', title: 'Akan Dikerjakan', color: 'bg-gray-400', tasks: [] },
                { id: 'col-inprogress', title: 'Sedang Dikerjakan', color: 'bg-warning', tasks: [] },
                { id: 'col-done', title: 'Selesai', color: 'bg-success', tasks: [] }
            ];
        }

        const dbTasks = await OS_DB.getTasks();
        if (dbTasks.length > 0) {
            dbTasks.forEach(task => {
                let col = boardData.columns.find(c => c.id === task.colId);
                if (!col && task.status) col = boardData.columns.find(c => c.title === task.status);
                // Fallback specifically for standard status if colId missing
                if (!col && task.status === 'todo') col = boardData.columns.find(c => c.id === 'col-todo');
                if (!col && task.status === 'done') col = boardData.columns.find(c => c.id === 'col-done');
                if (!col) col = boardData.columns[0];
                if (col) col.tasks.push(task);
            });
        }
        
        renderBoard();
    } catch(e) {
        console.error('Error loading tasks from IndexedDB', e);
    }
}
`;

// Replace from `async function saveData()` up to the end of `loadData()`
code = code.replace(/async function saveData\(\) \{[\s\S]*?renderBoard\(\);\s*\}\s*catch\(e\) \{\s*console\.error\('Error loading tasks from IndexedDB', e\);\s*\}\s*\}/, newDataModel.trim());

fs.writeFileSync('D:/PersonalOS/js/tasks_app.js', code);
console.log('Fixed tasks_app.js DB integration');
