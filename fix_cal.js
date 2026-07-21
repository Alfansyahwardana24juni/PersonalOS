const fs = require('fs');
let html = fs.readFileSync('D:/PersonalOS/calendar.html', 'utf8');

// The problematic onclick is:
// onclick="if(typeof window.toggleProfileMenu === 'function') { window.toggleProfileMenu(event); } else { document.getElementById('profile-dropdown').classList.toggle('opacity-0'); document.getElementById('profile-dropdown').classList.toggle('invisible'); document.getElementById('profile-dropdown').classList.toggle('scale-95'); document.getElementById('profile-dropdown').classList.toggle('scale-100'); event.stopPropagation(); }"

html = html.replace(/onclick="if\(typeof window\.toggleProfileMenu[^"]*"/, 'onclick="window.toggleProfileMenu(event)"');

fs.writeFileSync('D:/PersonalOS/calendar.html', html);
console.log('Fixed onclick in calendar.html');
