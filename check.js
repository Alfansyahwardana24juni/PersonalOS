const fs = require('fs');
['finance.html', 'tasks.html', 'calendar.html', 'notes.html'].forEach(f => {
    const html = fs.readFileSync('D:/PersonalOS/' + f, 'utf8');
    const matches = html.match(/id=\"profile-dropdown\"/g);
    console.log(f, matches ? matches.length : 0);
});
