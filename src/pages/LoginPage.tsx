import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';


const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email}),
            });

            if (!res.ok) {
                throw new Error('Login failed');
            }

            navigate('/search');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div>
            <div className="green-semi-circle"></div>
            <div className="green-diagonal-line"></div>
            <div className="center-wrapper" style={{ position: 'relative' }}>
                <div className="white-box">
                    <form onSubmit={handleLogin} className="column-left">
                        <img src="/fetch-logo.png" className="logo-image" alt="Fetch logo" /><br/>
                        <label htmlFor="name">Sign In to Continue</label><br />
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            placeholder="Name" 
                            className="rounded-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        /><br/>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="Email" 
                            className="rounded-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        /> <br/>
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </form>
                    <div className="column">
                        <img src="/login-puppy.jpg" className="rounded-image" alt="Boston terrier puppy running" />
                    </div>
                </div>
            </div>
            
        </div>
    );
      
};

export default LoginPage;