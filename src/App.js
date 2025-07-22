import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import PasswordScreen from './components/PasswordScreen';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

const config = {
    loader: { load: ['[tex]/ams'] },
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['\\[', '\\]']],
    },
};

const App = () => {
    const [hasAccess, setHasAccess] = useState(false);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setOutput('');

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    stream: true,
                    messages: [
                        {
                            role: 'system',
                            content: `
                                Resuelve ecuaciones diferenciales ordinarias usando el método de series infinitas cuando sea aplicable. Presenta el desarrollo como lo haría un profesor universitario en una pizarra: con pasos en secuencia vertical, sin explicaciones, sin comentarios, sin conectores ni texto entre líneas.

                                No uses encabezados ni subtítulos, excepto cuando sea estrictamente necesario, como:
                                - "Primeros términos"
                                - "Solución en serie"

                                Comienza por la ecuación original. Luego muestra:
                                1. La suposición en serie centrada en 0.
                                2. Las derivadas de y', y''.
                                3. La sustitución en la ecuación.
                                4. El desarrollo y reorganización.
                                5. La unificación en una sola sumatoria en potencias de x.
                                6. La igualdad de coeficientes a cero.
                                7. La fórmula de recurrencia.
                                8. Los primeros coeficientes (a₂, a₃...).
                                9. La serie parcial.
                                10. La solución final factorizada en función de a₀ como C₁ si aplica.

                                En formato LaTeX.
                                No uses frases como “supongamos”, “entonces”, “reindexamos”, “finalmente”, ni explicaciones. Si la ecuación no puede resolverse por series, usa el método más adecuado, pero sigue el mismo estilo vertical sin texto.
                            `.trim(),
                        },
                        {
                            role: 'user',
                            content: input,
                        },
                    ],
                })

            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            let receivedText = false;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                const lines = buffer.split('\n').filter(line => line.trim().startsWith('data:'));
                buffer = buffer.slice(buffer.lastIndexOf('\n'));

                for (const line of lines) {
                    const json = line.replace('data: ', '');
                    if (json === '[DONE]') break;

                    const parsed = JSON.parse(json);
                    const text = parsed.choices?.[0]?.delta?.content;
                    if (text) {
                        receivedText = true;
                        setOutput(prev => prev + text);
                    }
                }
            }

            setLoading(false);
            setDisplayText('');
            setIsCompleted(receivedText);
        } catch (err) {
            console.error(err);
            setOutput('Error al conectar con la API.');
        }

        setIsCompleted(true);
        setLoading(false);
        setDisplayText(''); // limpia animación
    };

    const handleReset = () => {
        setInput('');
        setOutput('');
        setDisplayText('');
        setIsCompleted(false);
    };

    useEffect(() => {
        if (loading && output === '') {
            setDisplayText('Resolviendo');
            const dotsInterval = setInterval(() => {
                setDisplayText(prev => {
                    if (prev.endsWith("...")) return "Resolviendo";
                    else return prev + ".";
                });
            }, 500);
            return () => clearInterval(dotsInterval);
        }
    }, [loading, output]);

    if (!hasAccess) return <PasswordScreen onAccess={() => setHasAccess(true)} />;

    return (
        <MathJaxContext version={3} config={config}>
        <div style={{
            backgroundColor: '#000000',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Segoe UI, sans-serif',
            padding: '1rem',
            color: '#ffffff'
        }}>
            <div style={{
                backgroundColor: '#111111',
                padding: '2rem',
                borderRadius: '16px',
                boxShadow: '0 0 12px rgba(255, 153, 0, 0.15)',
                width: '100%',
                maxWidth: '720px',
                border: '1px solid #222'
            }}>
                <h1 style={{
                    textAlign: 'left',
                    marginBottom: '1.5rem',
                    fontSize: '1.8rem',
                    color: '#ff9900',
                    fontWeight: '700',
                    letterSpacing: '0.5px'
                }}>
                    Resolver Ecuaciones Diferenciales
                </h1>

                <textarea
                    rows={6}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ej: y'' + 4y' + 13y = 0"
                    style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1rem',
                        borderRadius: '10px',
                        border: '1px solid #444',
                        backgroundColor: '#1a1a1a',
                        color: '#fff',
                        resize: 'none',
                        boxSizing: 'border-box',
                        marginBottom: '1rem',
                        fontFamily: 'inherit'
                    }}
                />

                <button
                    onClick={isCompleted ? handleReset : handleSend}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '0.85rem',
                        fontSize: '1rem',
                        backgroundColor: loading ? '#444' : '#ff9900',
                        color: '#000',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {isCompleted ? 'Nuevo Problema' : 'Resolver'}
                </button>

                <div style={{
                    marginTop: '2rem',
                    backgroundColor: '#1e1e1e',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #333',
                    minHeight: '120px',
                    color: '#ffffff',
                    fontSize: '1rem',
                }}>
                    <strong style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#ff9900',
                        fontSize: '1.05rem'
                    }}>
                        Resultado:
                    </strong>
                    <MathJax inline dynamic>
                        <div key={output}>{output || displayText}</div>
                    </MathJax>
                </div>
            </div>
        </div>
    </MathJaxContext>

    );
};

export default App;