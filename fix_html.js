const fs = require('fs');
const files = fs.readdirSync('D:/PersonalOS').filter(f => f.endsWith('.html'));
for (const file of files) {
    let content = fs.readFileSync('D:/PersonalOS/' + file, 'utf8');
    // Remove all occurrences
    content = content.replace(/<script src="js\/command_palette\.js"><\/script>\n?/g, '');
    content = content.replace(/<script src="js\/command_palette\.js"><\/script>/g, '');
    
    // Add exactly one right before </body>
    content = content.replace('</body>', '    <script src="js/command_palette.js"></script>\n</body>');
    fs.writeFileSync('D:/PersonalOS/' + file, content);
}
console.log('Fixed double injection in HTML files');
