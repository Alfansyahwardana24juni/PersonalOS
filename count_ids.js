const fs = require('fs');
const html = fs.readFileSync('D:/PersonalOS/finance.html', 'utf8');

console.log('tx-category count:', html.split('id="tx-category"').length - 1);
console.log('tx-account count:', html.split('id="tx-account"').length - 1);
console.log('tx-goal count:', html.split('id="tx-goal"').length - 1);
