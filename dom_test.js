const { JSDOM } = require('jsdom');
const fs = require('fs');

const fHtml = fs.readFileSync('D:/PersonalOS/finance.html', 'utf8');
const dom = new JSDOM(fHtml, { runScripts: "dangerously" });
const window = dom.window;
const document = window.document;

window.showToast = () => {};
document.dispatchEvent(new window.Event('DOMContentLoaded'));

const profileMenuContainer = document.getElementById('profile-menu-container');
const profileDropdown = document.getElementById('profile-dropdown');
const trigger = profileMenuContainer.querySelector('div[onclick]');

console.log("Classes before:", profileDropdown.className);

// Simulate a real click event which bubbles
const clickEvent = new window.MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
});
trigger.dispatchEvent(clickEvent);

console.log("Classes after trigger dispatch:", profileDropdown.className);
