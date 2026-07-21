const fs = require('fs');
let html = fs.readFileSync('D:/PersonalOS/finance.html', 'utf8');

// The HTML contains these blocks:
// 1. Kategori wrapper
let count = 0;
html = html.replace(/<div>\s*<label class=\"block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300\">Kategori<\/label>/, function(match) {
    count++;
    return `<div id=\"wrapper-tx-category\">\n<label class=\"block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300\">Kategori</label>`;
});

// 2. Account label
html = html.replace(/<label class=\"block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300\">Sumber Rekening<\/label>/, function(match) {
    count++;
    return `<label id=\"lbl-tx-account\" class=\"block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300\">Sumber Rekening</label>`;
});

// 3. Goal wrapper
html = html.replace(/<div>\s*<label class=\"block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300\">Hubungkan ke Target \(Opsional\)<\/label>/, function(match) {
    count++;
    return `<div id=\"wrapper-tx-goal\">\n<label class=\"block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300\">Hubungkan ke Target (Opsional)</label>`;
});

fs.writeFileSync('D:/PersonalOS/finance.html', html);
console.log('Replaced', count, 'items');
