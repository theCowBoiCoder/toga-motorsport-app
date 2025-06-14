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
    <div className="bg-gray-900 rounded-lg shadow-md p-8 text-center font-montserrat">
      <h2 className="text-2xl font-semibold mb-6 text-white uppercase">Login Required</h2>
      <p className="text-orange mb-6">
        Please login with Discord to access the application.
      </p>
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="bg-orange font-medium text-white px-6 py-3 rounded-lg hover:bg-white hover:text-orange disabled:opacity-50"
      >
        {isLoading ? 'Logging in...' : 'Login with Discord'}
      </button>
    </div>
  );
}

export default DiscordLogin;