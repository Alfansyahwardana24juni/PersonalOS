const fs = require('fs');
let html = fs.readFileSync('D:/PersonalOS/notes.html', 'utf8');
html = html.split('<button onclick="document.execCommand').join('<button onmousedown="event.preventDefault();" onclick="document.execCommand');
fs.writeFileSync('D:/PersonalOS/notes.html', html);
console.log('Added preventDefault');
