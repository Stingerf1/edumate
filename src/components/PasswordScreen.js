import React, { useState } from 'react';

const PasswordScreen = ({ onAccess }) => {
    const [input, setInput] = useState('');

    const handleSubmit = () => {
        if (input === process.env.REACT_APP_PASSWORD) onAccess(); // Cambia '1234' por tu contraseña deseada
        else alert('Contraseña incorrecta');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '30vh' }}>
            <h2>Ingresa la contraseña</h2>
            <input
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSubmit}>Acceder</button>
        </div>
    );
};

export default PasswordScreen;
