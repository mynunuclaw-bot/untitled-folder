const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

const head = lines.slice(0, 113).join('\n');
const foot = lines.slice(568, 668).join('\n');
const simpleFoot = lines.slice(568, 634).join('\n') + '\n</body>\n</html>\n';

const pages = {
    'index.html': { start: 114, end: 303 },
    'shop.html': { start: 304, end: 382 },
    'product.html': { start: 383, end: 385 },
    'about.html': { start: 386, end: 454 },
    'reviews.html': { start: 455, end: 475 },
    'blogs.html': { start: 476, end: 489 },
    'contact.html': { start: 490, end: 567 }
};

for (const [page, bounds] of Object.entries(pages)) {
    let content = lines.slice(bounds.start, bounds.end).join('\n');
    content = content.replace('class="page"', 'class="page active"');
    
    let footer = page === 'index.html' ? foot : simpleFoot;
    fs.writeFileSync(page, head + '\n' + content + '\n' + footer);
}
console.log('Split complete!');
