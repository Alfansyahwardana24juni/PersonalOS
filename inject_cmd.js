const fs = require('fs');
const files = fs.readdirSync('D:/PersonalOS').filter(f => f.endsWith('.html'));
let count = 0;
for (const file of files) {
    let content = fs.readFileSync('D:/PersonalOS/' + file, 'utf8');
    if (!content.includes('command_palette.js')) {
        content = content.replace('</body>', '    <script src="js/command_palette.js"></script>\n</body>');
        fs.writeFileSync('D:/PersonalOS/' + file, content);
        count++;
    }
}
console.log('Injected command_palette.js into ' + count + ' files');
