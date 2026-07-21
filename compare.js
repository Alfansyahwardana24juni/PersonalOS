const fs = require('fs');
['index.html', 'finance.html', 'tasks.html', 'calendar.html', 'notes.html'].forEach(f => {
    const html = fs.readFileSync('D:/PersonalOS/' + f, 'utf8');
    const match = html.match(/id=\"profile-menu-container\"[^>]*>([\s\S]*?)<\/div>\s*<!-- Dropdown -->/);
    if (match) {
        console.log(f + ': found container! onclick is:');
        const onclick = match[1].match(/onclick=\"([^\"]+)\"/);
        console.log(onclick ? onclick[1] : 'NONE');
    } else {
        console.log(f + ': not found');
    }
});
