const fs = require('fs');
let html = fs.readFileSync('D:/PersonalOS/calendar.html', 'utf8');

const target = 'onclick="window.toggleProfileMenu(event)"';
const replacement = `onclick="const d = document.getElementById('profile-dropdown'); if(d){ d.classList.toggle('opacity-0'); d.classList.toggle('invisible'); d.classList.toggle('scale-95'); d.classList.toggle('scale-100'); } event.stopPropagation();"`;

html = html.replace(target, replacement);

fs.writeFileSync('D:/PersonalOS/calendar.html', html);
console.log('Reverted to direct inline onclick in calendar.html');
