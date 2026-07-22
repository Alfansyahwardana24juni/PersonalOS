const fs = require('fs');
let code = fs.readFileSync('D:/PersonalOS/js/tasks_app.js', 'utf8');

const nlpCode = `

// --- NLP Quick Add ---
function handleQuickAddTask() {
    const input = document.getElementById('quick-add-task');
    const text = input.value.trim();
    if (!text) return;
    
    let priority = 'Normal';
    let cleanText = text;
    if (cleanText.match(/!p1/i)) priority = 'Tinggi';
    else if (cleanText.match(/!p2/i)) priority = 'Sedang';
    else if (cleanText.match(/!p3/i)) priority = 'Rendah';
    cleanText = cleanText.replace(/!p[1-3]/i, '').trim();
    
    let deadline = '';
    let timeStart = '';
    
    const today = new Date();
    if (cleanText.match(/besok|esok/i)) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        deadline = \`\${year}-\${month}-\${day}\`;
        cleanText = cleanText.replace(/besok|esok/i, '').trim();
    } else if (cleanText.match(/hari ini|today/i)) {
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        deadline = \`\${year}-\${month}-\${day}\`;
        cleanText = cleanText.replace(/hari ini|today/i, '').trim();
    }
    
    const timeMatch = cleanText.match(/\\b([01]?\\d|2[0-3]):([0-5]\\d)\\b/);
    if (timeMatch) {
        timeStart = timeMatch[0];
        cleanText = cleanText.replace(timeMatch[0], '').trim();
    }
    
    const projMatch = cleanText.match(/#(\\w+)/);
    if (projMatch) {
        cleanText = cleanText.replace(projMatch[0], '').trim();
    }
    
    const newTask = {
        id: generateId(),
        title: cleanText,
        priority: priority,
        status: 'Todo',
        deadline: deadline,
        timeStart: timeStart,
        timeEnd: '',
        desc: '',
        subtasks: []
    };
    
    if (boardData.columns.length > 0) {
        boardData.columns[0].tasks.unshift(newTask);
        saveData();
        renderBoard();
        if(typeof renderList === 'function') renderList();
    }
    
    input.value = '';
    if(window.showToast) window.showToast('Tugas baru ditambahkan (NLP)', 'success');
}
`;

if(!code.includes('handleQuickAddTask')) {
    fs.appendFileSync('D:/PersonalOS/js/tasks_app.js', nlpCode);
    console.log('NLP added.');
} else {
    console.log('NLP already exists.');
}
