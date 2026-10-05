const { exec } = require('child_process');
exec('npx vite build', (err, stdout, stderr) => {
    console.log(\"STDOUT:\", stdout);
  console.log(\"STDERR:\", stderr);
});
