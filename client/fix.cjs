const fs = require('fs');
const path = require('path');

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        const p = path.join(dir, file);
        if (fs.statSync(p).isDirectory()) {
            if (file !== 'node_modules') {
                walk(p);
            }
        } else if (p.endsWith('.jsx') || p.endsWith('.js') || p.endsWith('.css') || p.endsWith('.html')) {
            let content = fs.readFileSync(p, 'utf8');
            if (content.includes('\\\\\"')) {
                content = content.replace(/\\\\\"/g, '\"');
                fs.writeFileSync(p, content);
            }
        }
    });
}
walk('.');
