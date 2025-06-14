const { shell } = require('electron');
const http = require('http');
const fetch = require('node-fetch');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Load config
function loadConfig() {
  try {
    const configPath = path.join(__dirname, '..', 'auth-config.json');
    const configFile = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configFile);
  } catch (error) {
    console.error('Error loading auth config:', error);
    throw new Error('Failed to load auth configuration');
  }
}

/**
 * Simple Discord login using your existing website
 */
async function login() {
  try {
    // Load configuration
    const config = loadConfig();
    const { 
      clientId, 
      redirectUri, 
      port, 
      apiUrl = 'http://togamotorsport.local//api' 
    } = config.discord;
    
    // Create a server to listen for the callback
    const server = http.createServer();
    
    // Wrap server listening in a promise
    await new Promise((resolve, reject) => {
      server.on('error', (err) => {
        if (err.code === 'EACCES') {
          reject(new Error(`Port ${port} requires elevated privileges`));
        } else {
          reject(err);
        }
      });
      
      server.listen(port, 'localhost', () => {
        console.log(`Server listening on port ${port}`);
        resolve();
      });
    });
    
    // Promise for the auth code
    const codePromise = new Promise((resolve) => {
      server.on('request', (req, res) => {
        const urlParts = url.parse(req.url, true);
        const pathname = urlParts.pathname;
        
        // Extract the path from redirectUri to match against
        const redirectPath = new URL(redirectUri).pathname;
        
        if (pathname === redirectPath) {
          const code = urlParts.query.code;
          
          // Send a success page back to the user
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <head>
                <title>Authentication Successful</title>
                <style>
                  body { font-family: Arial; text-align: center; padding-top: 50px; }
                  h2 { color: #5865F2; }
                </style>
              </head>
              <body>
                <h2>Login Successful!</h2>
                <p>You can now close this window and return to the app.</p>
                <script>window.close();</script>
              </body>
            </html>
          `);
          
          resolve(code);
        }
      });
    });
    
    // Discord OAuth URL
    const authUrl = `https://discord.com/oauth2/authorize?client_id=1091322288017784852&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%2Fauth%2Fdiscord&scope=identify+guilds`;
    
    // Open URL in default browser
    shell.openExternal(authUrl);
    
    // Wait for the code to come back
    const code = await codePromise;
    
    if (!code) {
      throw new Error('No authorization code received');
    }
    
    // Exchange code for Discord token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: config.discord.clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    });
    
    const discordTokens = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      throw new Error(`Discord token exchange failed: ${discordTokens.error}`);
    }
    
    // Send the Discord token to your Laravel backend for verification
    const verifyResponse = await fetch(`${apiUrl}/auth/verify-discord`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_token: discordTokens.access_token
      })
    });
    
    const userData = await verifyResponse.json();
    
    if (!verifyResponse.ok) {
      throw new Error(`Verification failed: ${userData.error || 'Unknown error'}`);
    }
    
    // Store the Laravel API token
    const userDataDir = path.join(__dirname, '..', '.user-data');
    if (!fs.existsSync(userDataDir)) {
      fs.mkdirSync(userDataDir, { recursive: true });
    }
    
    // Save both tokens (might need both for different operations)
    if (fs.existsSync(userDataDir)) {
  try {
    fs.writeFileSync(
      path.join(userDataDir, 'auth-tokens.json'),
      JSON.stringify({
        laravelToken: userData.token,
        discordTokens: discordTokens
      }),
      'utf8'
    );
    console.log('Auth tokens saved successfully');
  } catch (err) {
    console.error('Failed to write auth tokens file:', err);
  }
} else {
  console.error('Could not create user data directory');
}
    
    // Close server
    server.close();
    
    return {
      success: true,
      user: userData.user,
      token: userData.token
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Logout by calling Laravel logout endpoint
 */
async function logout() {
  try {
    const config = loadConfig();
    const apiUrl = config.discord.apiUrl || 'https://your-laravel-website.com/api';
    
    // Check if we have a token
    const tokensPath = path.join(__dirname, '..', '.user-data', 'auth-tokens.json');
    
    if (fs.existsSync(tokensPath)) {
      // Read stored tokens
      const storedTokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
      
      if (storedTokens.laravelToken) {
        // Call Laravel logout endpoint
        await fetch(`${apiUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${storedTokens.laravelToken}`,
            'Accept': 'application/json'
          }
        });
      }
      
      // Delete the stored tokens
      fs.unlinkSync(tokensPath);
    }
    
    return {
      success: true,
      message: "Successfully logged out"
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get current user data from Laravel
 */
async function getCurrentUser() {
  try {
    const config = loadConfig();
    const apiUrl = config.discord.apiUrl || 'https://your-laravel-website.com/api';
    
    // Check if we have a token
    const tokensPath = path.join(__dirname, '..', '.user-data', 'auth-tokens.json');
    
    // File doesn't exist yet - user hasn't logged in
    if (!fs.existsSync(tokensPath)) {
      console.log('No auth tokens file found - user is not logged in');
      return { success: false, error: 'Not logged in' };
    }
    
    // Read stored tokens
    const storedTokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
    
    if (!storedTokens || !storedTokens.laravelToken) {
      console.log('No Laravel token found in auth tokens file');
      return { success: false, error: 'Not logged in' };
    }
    
    // Rest of your function...
  } catch (error) {
    console.error('Get user error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = { login, logout, getCurrentUser };