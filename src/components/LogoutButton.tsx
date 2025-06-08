import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Clear any local storage
        localStorage.clear();
        // Redirect to login page
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        position: 'fixed',
        top: '15px',
        left: '20px',
        padding: '4px 8px',
        backgroundColor: '#f0f0f0',
        color: '#666',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        transition: 'background-color 0.2s',
        zIndex: 1000
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
    >
      Logout
    </button>
  );
} 