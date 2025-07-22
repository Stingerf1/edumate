import React, { useState } from 'react';


const PasswordScreen = ({ onAccess }) => {
    const [input, setInput] = useState('');

    const handleSubmit = () => {
        if (input === process.env.REACT_APP_PASSWORD) onAccess(); // Cambia '1234' por tu contraseña deseada
        else alert('Contraseña incorrecta');
    };

    return (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#000000',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
        padding: '1rem',
        color: '#ffffff'
    }}>
        <div style={{
            backgroundColor: '#111111',
            padding: '2.5rem 2rem',
            borderRadius: '16px',
            boxShadow: '0 0 20px rgba(255, 153, 0, 0.1)',
            width: '100%',
            maxWidth: '360px',
            textAlign: 'center',
            border: '1px solid #222'
        }}>
            <h2 style={{
                fontSize: '1.6rem',
                marginBottom: '1.5rem',
                color: '#ff9900',
                fontWeight: '700',
                letterSpacing: '0.3px'
            }}>
                🔐 Acceso Privado
            </h2>

            <input
                type="password"
                placeholder="Contraseña"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                    width: '100%',
                    padding: '0.85rem',
                    fontSize: '1rem',
                    borderRadius: '10px',
                    border: '1px solid #444',
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    marginBottom: '1.25rem',
                    outline: 'none',
                    transition: 'border 0.3s',
                    boxSizing: 'border-box'
                }}
            />

            <button
                onClick={handleSubmit}
                style={{
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: '#ff9900',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#e58300'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#ff9900'}
            >
                Acceder
            </button>
        </div>
    </div>
);
}
export default PasswordScreen;
