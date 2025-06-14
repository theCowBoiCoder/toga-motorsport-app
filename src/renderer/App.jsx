import React, { useState, useEffect } from 'react';
import DiscordLogin from './components/DiscordLogin';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    checkAuthStatus();
    getAppVersion();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const result = await window.discord.getUser();

      if (result.success && result.user) {
        setUser(result.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const getAppVersion = async () => {
    try {
      const version = await window.app.getVersion();
      setAppVersion(version);
    } catch (error) {
      console.error('Failed to get app version:', error);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      const result = await window.discord.logout();
      if (result.success) {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="uppercase text-center text-4xl font-bold text-orange font-montserrat">
        Toga Motorsport App</h1>
        <p className="text-white text-sm mb-8 text-center">Version {appVersion}</p>
      
        {isLoggedIn ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome back!</h2>
            <div className="flex items-center space-x-4">
              <img 
                src={user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : ''}
                alt="Avatar" 
                className="w-16 h-16 rounded-full"
              />
              <div>
                <p className="text-lg font-medium">{user?.username}</p>
                <p className="text-gray-600">{user?.email || 'No email provided'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <DiscordLogin onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
}

export default App;