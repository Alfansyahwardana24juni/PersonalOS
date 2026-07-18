const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('calendar.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
const window = dom.window;
const document = window.document;

window.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = v; }
};
window.alert = console.log;

const js = fs.readFileSync('js/calendar_app.js', 'utf8');
const script = document.createElement('script');
script.textContent = js;
document.body.appendChild(script);

setTimeout(() => {
    document.dispatchEvent(new window.Event('DOMContentLoaded'));
    
    // Check if grid is populated
    console.log("Calendar grid cells:", document.getElementById('calendar-grid')?.children.length);
    console.log("Header title:", document.getElementById('calendar-header-title')?.innerHTML);
    
    // Check buttons
    if (typeof window.openAddModal === 'function') {
        console.log("openAddModal is accessible globally");
    } else {
        console.log("openAddModal is NOT global");
    }
}, 1000);
