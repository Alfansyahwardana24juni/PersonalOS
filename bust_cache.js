const fs = require('fs');
const files = fs.readdirSync('D:/PersonalOS').filter(f => f.endsWith('.html'));
const ts = Date.now();
files.forEach(f => {
    let html = fs.readFileSync('D:/PersonalOS/' + f, 'utf8');
    if (html.includes('js/main.js')) {
        html = html.replace(/src=\"js\/main\.js(\?v=[0-9]+)?\"/g, 'src="js/main.js?v=' + ts + '"');
        fs.writeFileSync('D:/PersonalOS/' + f, html);
        console.log('Updated', f);
    }
});
