const localtunnel = require('localtunnel');

(async () => {
    try {
        const tunnel = await localtunnel({ port: 3000, subdomain: 'jaskuyb2026' });
        console.log(`🚀 Tunnel running at: ${tunnel.url}`);

        tunnel.on('close', () => {
            console.log('Tunnel closed naturally. PM2 will revive it.');
            process.exit(1);
        });

        tunnel.on('error', (err) => {
            console.error('Tunnel error:', err);
            process.exit(1);
        });
    } catch (err) {
        console.error('Failed to start tunnel:', err);
        process.exit(1);
    }
})();
