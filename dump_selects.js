const fs = require('fs');
let html = fs.readFileSync('D:/PersonalOS/finance.html', 'utf8');

// I need to see the exact structure of the tx-category, tx-account, and tx-goal selects.
const lines = html.split('\n');
lines.forEach((line, i) => {
    if (line.includes('tx-category') || line.includes('tx-account') || line.includes('tx-goal') || line.includes('lbl-tx-account') || line.includes('Sumber Rekening')) {
        console.log(`Line ${i}:`, line.trim());
    }
});
