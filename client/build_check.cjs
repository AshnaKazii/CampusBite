const { exec } = require('child_process');
const fs = require('fs');
exec('npx vite build', (err, stdout, stderr) => {
    fs.writeFileSync('error_log.txt', stderr);
});
