const { spawn } = require('child_process');
const path = require('path');

const ngrokPath = path.join(__dirname, 'ngrok.exe');
const ngrok = spawn(ngrokPath, ['http', '3000', '--log=stdout']);

ngrok.stdout.on('data', (data) => console.log(`ngrok out: ${data}`));
ngrok.stderr.on('data', (data) => console.error(`ngrok err: ${data}`));
ngrok.on('close', (code) => {
    console.log(`ngrok exited with code ${code}`);
    process.exit(code);
});

// To keep the process alive slightly longer before exit if crash happens
setInterval(() => { }, 1000 * 60 * 60);
