
function displayUserInfo(user) {
  const userAvatar = document.getElementById('user-avatar');
  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  
  if (userAvatar) {
    userAvatar.src = user.avatar 
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : 'https://cdn.discordapp.com/embed/avatars/0.png';
  }
  if (userName) userName.textContent = user.username;
  if (userEmail) userName.textContent = user.email || 'No email provided';
}

async function checkAuthStatus() {
  try {
    const userResult = await window.discord.getUser();
  
    
    if (userResult.success && userResult.user) {
      // User is logged in
      displayUserInfo(userResult.user);
      document.getElementById('discord-login-button').style.display = 'none';
      document.getElementById('user-profile').style.display = 'block';
    } else {
      // User is not logged in
      document.getElementById('discord-login-button').style.display = 'block';
      document.getElementById('user-profile').style.display = 'none';
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    // Assume not logged in if there's an error
    document.getElementById('discord-login-button').style.display = 'block';
    document.getElementById('user-profile').style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Check auth status when app starts
  checkAuthStatus();

  const loginButton = document.getElementById('discord-login-button');
  const logoutButton = document.getElementById('discord-logout-button');
  
  if (loginButton) {
    loginButton.addEventListener('click', async () => {
      loginButton.textContent = 'Logging in...';
      loginButton.disabled = true;
      
      try {
        const result = await window.discord.login();
        
        
        if (result.success) {
          displayUserInfo(result.user);
          document.getElementById('user-profile').style.display = 'block';
          loginButton.style.display = 'none';
          localStorage.setItem('discord_user', JSON.stringify(result.user));
        } else {
          alert(`Login failed: ${result.error}`);
          loginButton.textContent = 'Login with Discord';
          loginButton.disabled = false;
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Error during login');
        loginButton.textContent = 'Login with Discord';
        loginButton.disabled = false;
      }
    });
  }
  
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        const result = await window.discord.logout();
        
        if (result.success) {
          localStorage.removeItem('discord_user');
          document.getElementById('user-profile').style.display = 'none';
          document.getElementById('discord-login-button').style.display = 'block';
          alert('You have been logged out successfully');
        }
      } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout');
      }
    });
  }
});