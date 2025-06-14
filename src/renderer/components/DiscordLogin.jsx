import React, { useState } from 'react';

function DiscordLogin({ onLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await window.discord.login();
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        alert(`Login failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center font-montserrat">
      <h2 className="text-2xl font-semibold mb-6">Login Required</h2>
      <p className="text-gray-600 mb-6">
        Please login with Discord to access the application.
      </p>
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        {isLoading ? 'Logging in...' : 'Login with Discord'}
      </button>
    </div>
  );
}

export default DiscordLogin;