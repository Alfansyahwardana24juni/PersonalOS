const fs = require('fs');
let html = fs.readFileSync('D:/PersonalOS/finance.html', 'utf8');
const lines = html.split('\n');
let modified = false;

for (let i = 0; i < lines.length; i++) {
    // Inject id="tx-account" if missing in the Sumber Rekening block
    if (lines[i].includes('<label id="lbl-tx-account"')) {
        if (!lines[i].includes('id="tx-account"')) {
            lines[i] = lines[i].replace('<select class="', '<select id="tx-account" class="');
            modified = true;
        }
    }
    // Inject id="tx-goal" if missing in the Hubungkan ke Target block
    if (lines[i].includes('<div id="wrapper-tx-goal">')) {
        if (!lines[i].includes('id="tx-goal"')) {
            lines[i] = lines[i].replace('<select class="', '<select id="tx-goal" class="');
            modified = true;
        }
    }
}

if (modified) {
    fs.writeFileSync('D:/PersonalOS/finance.html', lines.join('\n'));
    console.log('finance.html updated with select IDs');
} else {
    console.log('No modifications needed');
}
