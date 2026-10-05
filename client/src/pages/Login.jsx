import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

export default function Login() {
    const { login } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('student@laroche.local');
    const [password, setPassword] = useState('password123');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            if (['staff', 'cafe_staff', 'admin'].includes(user.role)) {
                navigate('/staff/dashboard');
            } else {
                navigate('/menu');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const autofillStaff = () => {
        setEmail('staff@laroche.local');
        setPassword('password123');
    };

    return (
        <div className="flex justify-center items-center animate-fade" style={{ minHeight: '60vh' }}>
            <div className="card" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h2 className="font-bold mb-4" style={{ fontSize: '2rem', color: 'var(--primary)' }}>LA ROCHE CAFE</h2>
                <p className="text-muted mb-4">Login to your account</p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        style={styles.input}
                        value={email} onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        style={styles.input}
                        value={password} onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary mt-2">Login</button>
                </form>

                <div className="mt-4 pt-4 text-muted" style={{ borderTop: '1px solid var(--border)' }}>
                    <button onClick={autofillStaff} style={{ fontSize: '0.8rem', textDecoration: 'underline' }}>Login as Staff instead?</button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    input: {
        padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', width: '100%'
    }
};
