import fs from 'fs';
['src/pages', 'src/layouts', 'src/components', 'src/services'].forEach(d => {
    fs.rmSync(d, { recursive: true, force: true });
    fs.mkdirSync(d, { recursive: true });
});
