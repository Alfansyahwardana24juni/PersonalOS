const fs = require('fs');

const files = fs.readdirSync('D:/PersonalOS').filter(f => f.endsWith('.html'));

const regex = /<a href="projects\.html"[\s\S]*?<\/a>/g;

for (const file of files) {
    let content = fs.readFileSync('D:/PersonalOS/' + file, 'utf8');
    if (content.match(regex)) {
        content = content.replace(regex, '');
        fs.writeFileSync('D:/PersonalOS/' + file, content);
    }
}

// Check mobile navigation bar for projects link as well
const mobileRegex = /<a href="projects\.html"[\s\S]*?<\/a>/g;
for (const file of files) {
    let content = fs.readFileSync('D:/PersonalOS/' + file, 'utf8');
    if (content.match(mobileRegex)) {
        content = content.replace(mobileRegex, '');
        fs.writeFileSync('D:/PersonalOS/' + file, content);
    }
}

// Delete the actual files
if (fs.existsSync('D:/PersonalOS/projects.html')) {
    fs.unlinkSync('D:/PersonalOS/projects.html');
}
if (fs.existsSync('D:/PersonalOS/js/projects_app.js')) {
    fs.unlinkSync('D:/PersonalOS/js/projects_app.js');
}

console.log('Successfully removed Projects menu and files.');
