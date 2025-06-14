// const information = document.getElementById('info')
// //information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`


// const func = async () => {
//   const response = await window.versions.ping()
//   console.log(response) // prints out 'pong'
// }

// func()

// Add this to your renderer JS file



document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('discord-login-button');
  const userProfile = document.getElementById('user-profile');
  const userAvatar = document.getElementById('user-avatar');
  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  
  if (loginButton) {
    loginButton.addEventListener('click', async () => {
      // Show loading state
      loginButton.textContent = 'Logging in...';
      loginButton.disabled = true;
      
      try {
        // Call the login function
        const result = await window.discord.login();
        console.log('Login result:', result);
        if (result.success) {
          // Display user info
          const user = result.user;
          userAvatar.src = user.avatar 
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
            : 'https://cdn.discordapp.com/embed/avatars/0.png';
          userName.textContent = user.username;
          userEmail.textContent = user.email || 'No email provided';
          
          // Show profile, hide button
          userProfile.style.display = 'block';
          loginButton.style.display = 'none';
          
          // Store user data for session
          localStorage.setItem('discord_user', JSON.stringify(user));
        } else {
          // Show error
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

  const logoutButton = document.getElementById('discord-logout-button');
  
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        // Call the logout function
        const result = await window.discord.logout();
        
        if (result.success) {
          // Clear user data from localStorage
          localStorage.removeItem('discord_user');
          
          // Update UI to show logged out state
          const userProfile = document.getElementById('user-profile');
          const loginButton = document.getElementById('discord-login-button');
          
          if (userProfile) userProfile.style.display = 'none';
          if (loginButton) {
            loginButton.style.display = 'block';
            loginButton.disabled = false;
          }
          
          // Optionally show a message
          alert('You have been logged out successfully');
        } else {
          console.error('Logout failed:', result.error);
          alert(`Logout failed: ${result.error}`);
        }
      } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout');
      }
    });
  }
  
  // Check if user is already logged in
  const savedUser = localStorage.getItem('discord_user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      userAvatar.src = user.avatar 
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : 'https://cdn.discordapp.com/embed/avatars/0.png';
      userName.textContent = user.username;
      userEmail.textContent = user.email || 'No email provided';
      
      // Show profile, hide button
      userProfile.style.display = 'block';
      loginButton.style.display = 'none';
    } catch (e) {
      localStorage.removeItem('discord_user');
    }
  }
});

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

// Check auth status when app starts
document.addEventListener('DOMContentLoaded', checkAuthStatus);