const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('tasks.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

const window = dom.window;
const document = window.document;

// Mock localStorage
window.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = v; }
};

// Mock prompt and alert
window.prompt = () => "New List";
window.alert = () => {};

// Mock Sortable
window.Sortable = {
    create: (el, opts) => {
        console.log(`Sortable created for ${el.id || el.className} with group ${opts.group || 'none'}`);
    }
};

// Load tasks_app.js
const js = fs.readFileSync('js/tasks_app.js', 'utf8');
const script = document.createElement('script');
script.textContent = js;
document.body.appendChild(script);

setTimeout(() => {
    // Trigger DOMContentLoaded
    document.dispatchEvent(new window.Event('DOMContentLoaded'));
    
    // Check if classes were applied
    console.log("board-todo classes:", document.getElementById('board-todo').className);
    
    // Test addNewList
    if (typeof window.addNewList === 'function') {
        window.addNewList();
        console.log("addNewList executed successfully");
    } else {
        console.log("addNewList is NOT defined on window");
        // Because it was declared with 'function addNewList()', it should be global in normal browsers, but in jsdom script tags, maybe it's not on window?
        // Let's try calling it via a new script
        const caller = document.createElement('script');
        caller.textContent = `addNewList(); console.log("addNewList called successfully from inline script");`;
        document.body.appendChild(caller);
    }
    
    console.log("Board container HTML length:", document.getElementById('board-container').innerHTML.length);
}, 1000);
