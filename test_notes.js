const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");

const html = fs.readFileSync("notes.html", "utf-8");

const dom = new JSDOM(html, {
    url: "http://localhost/notes.html",
    runScripts: "dangerously"
});

// If there's a syntax error, JSDOM will throw it to virtual console or global
dom.window.onerror = function(msg, source, lineno, colno, error) {
    console.error("Syntax Error:", msg, "at line", lineno);
};

// Check if deleteActiveNote is defined
setTimeout(() => {
    if (typeof dom.window.deleteActiveNote === 'function') {
        console.log("deleteActiveNote is defined");
    } else {
        console.log("deleteActiveNote is NOT defined");
    }
}, 500);
