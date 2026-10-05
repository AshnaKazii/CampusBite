import fs from 'fs';
import path from 'path';

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        const p = path.join(dir, file);
        if (fs.statSync(p).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                walk(p);
            }
        } else if (p.endsWith('.jsx') || p.endsWith('.js') || p.endsWith('.css') || p.endsWith('.html')) {
            let content = fs.readFileSync(p, 'utf8');
            if (content.includes('\\\"')) {
                content = content.split('\\\"').join('\"');
                fs.writeFileSync(p, content);
            }
        }
    });
}
walk('.');
