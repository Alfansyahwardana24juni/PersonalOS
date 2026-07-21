const fs = require('fs');
let js = fs.readFileSync('D:/PersonalOS/js/main.js', 'utf8');

const func = `
// Global toggle for profile dropdown
window.toggleProfileMenu = function(event) {
    const dropdown = document.getElementById('profile-dropdown');
    if(dropdown) {
        dropdown.classList.toggle('opacity-0');
        dropdown.classList.toggle('invisible');
        dropdown.classList.toggle('scale-95');
        dropdown.classList.toggle('scale-100');
    }
    if(event) event.stopPropagation();
};

`;

if(!js.includes('window.toggleProfileMenu')) {
    fs.writeFileSync('D:/PersonalOS/js/main.js', func + js);
    console.log("Updated main.js");
}
