const fs = require('fs');

const OLD_ONCLICK = `onclick="document.getElementById('profile-dropdown').classList.toggle('opacity-0'); document.getElementById('profile-dropdown').classList.toggle('invisible'); document.getElementById('profile-dropdown').classList.toggle('scale-95'); document.getElementById('profile-dropdown').classList.toggle('scale-100'); event.stopPropagation();"`;
const NEW_ONCLICK = `onclick="if(typeof window.toggleProfileMenu === 'function') { window.toggleProfileMenu(event); } else { document.getElementById('profile-dropdown').classList.toggle('opacity-0'); document.getElementById('profile-dropdown').classList.toggle('invisible'); document.getElementById('profile-dropdown').classList.toggle('scale-95'); document.getElementById('profile-dropdown').classList.toggle('scale-100'); event.stopPropagation(); }"`;

['finance.html', 'tasks.html', 'calendar.html', 'notes.html', 'index.html', 'inbox.html'].forEach(f => {
    let html = fs.readFileSync('D:/PersonalOS/' + f, 'utf8');
    if (html.includes(OLD_ONCLICK)) {
        html = html.split(OLD_ONCLICK).join(NEW_ONCLICK);
        fs.writeFileSync('D:/PersonalOS/' + f, html);
        console.log("Updated", f);
    } else {
        console.log("Not found in", f);
    }
});
