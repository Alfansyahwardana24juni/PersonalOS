const fs = require('fs');

let c = fs.readFileSync('D:/PersonalOS/index.html', 'utf8');

// Replace the horizontal scroll container with a 2-column grid
c = c.replace(
    '<div class="flex overflow-x-auto pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 gap-4 hide-scrollbar snap-x">',
    '<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">'
);

// Remove snap-center and fixed width from the cards, reduce padding on mobile
c = c.replace(/snap-center shrink-0 w-72 lg:w-auto /g, '');
c = c.replace(/p-6 shadow-sm/g, 'p-4 lg:p-6 shadow-sm');
// Adjust fonts so they fit in the 2-column layout on small phones
c = c.replace(/text-2xl font-bold/g, 'text-lg lg:text-2xl font-bold'); // Make the big numbers smaller on mobile
c = c.replace(/text-sm font-medium text-gray-500/g, 'text-[10px] lg:text-sm font-medium text-gray-500 truncate');

// Rebuild index.html with new cache buster
fs.writeFileSync('D:/PersonalOS/index.html', c);

// Bust cache by replacing ?v=...
let newV = Date.now();
c = fs.readFileSync('D:/PersonalOS/index.html', 'utf8');
c = c.replace(/js\/dashboard_app\.js\?v=\d+/, 'js/dashboard_app.js?v=' + newV);
fs.writeFileSync('D:/PersonalOS/index.html', c);

console.log('Fixed mobile layout to 2x2 grid');
