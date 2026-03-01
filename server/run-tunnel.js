const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

console.log('Starting SSH Tunnel (localhost.run) for Express on port 3000...');

// Run SSH tunnel
const tunnelProcess = spawn('ssh', ['-o', 'StrictHostKeyChecking=no', '-R', '80:localhost:3000', 'nokey@localhost.run'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true
});

let urlFound = false;

// SSH prints the URL to stdout
tunnelProcess.stdout.on('data', (data) => {
  const output = data.toString();
  const match = output.match(/(https:\/\/[a-zA-Z0-9-]+\.lhr\.life)/);
  
  if (match && !urlFound) {
    urlFound = true;
    const tunnelUrl = match[1];
    console.log(`\n✅ SSH Tunnel is live at: ${tunnelUrl}\n`);

    // Read the current .env
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update WEB_APP_URL in .env
    if (envContent.includes('WEB_APP_URL=')) {
      envContent = envContent.replace(/WEB_APP_URL=.*/, `WEB_APP_URL=${tunnelUrl}`);
    } else {
      envContent += `\nWEB_APP_URL=${tunnelUrl}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env with new WEB_APP_URL');

    // Start the Express Server
    console.log('\nStarting Backend Server...\n');
    const server = spawn('npm', ['run', 'start'], {
      stdio: 'inherit',
      cwd: __dirname,
      shell: true
    });

    server.on('close', (code) => {
      console.log(`Server exited with code ${code}`);
      tunnelProcess.kill();
    });
  } else if (!urlFound) {
     console.log('Tunnel output:', output.trim());
  }
});

tunnelProcess.stderr.on('data', (data) => {
  // Ignore standard ssh warnings
});

tunnelProcess.on('error', (err) => {
  console.error('Failed to start Tunnel:', err);
});

tunnelProcess.on('close', (code) => {
  console.log(`Tunnel exited with code ${code}`);
});

process.on('SIGINT', () => {
    tunnelProcess.kill('SIGINT');
    process.exit();
});
