import React, { useState } from 'react';
import confetti from 'canvas-confetti'; // Install with: npm install canvas-confetti
import Wheel from './components/Wheel'; // Assuming this is your wheel visualization component

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [assignedNumber, setAssignedNumber] = useState(null);
  const [status, setStatus] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = async (event) => {
    event.preventDefault();
    if (!name || !email) {
      setStatus('Please enter your name and email.');
      return;
    }

    setStatus('Spinning...');
    setIsSpinning(true);

    try {
      const response = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: name, userEmail: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.message || 'An error occurred.');
        if (data.number) setAssignedNumber(data.number); // Show existing number if already spun
      } else {
        setAssignedNumber(data.number);
        setStatus('Congratulations!');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (error) {
      setStatus('Failed to connect to the server. Please try again.');
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <div className="App" style={{ textAlign: 'center', padding: '20px' }}>
      <h1>SIB Spin The Wheel </h1>
      <p>Enter your details and spin to get a unique number!</p>
      <p>**You can do this only once**</p>

      <form onSubmit={handleSpin}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
          style={{ margin: '10px', padding: '8px', width: '200px' }}
        />
        <br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          required
          style={{ margin: '10px', padding: '8px', width: '200px' }}
        />
        <br />
        <button type="submit" disabled={isSpinning} style={{ padding: '10px 20px', fontSize: '16px' }}>
          {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
        </button>
      </form>

      {isSpinning && (
        <div style={{ margin: '20px auto', width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(45deg, #ff0, #f00)', animation: 'spin 1s linear infinite' }}>
          {/* Simple CSS spinner */}
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {status && <p style={{ color: assignedNumber ? 'green' : 'red', marginTop: '20px' }}>{status}</p>}

      {/* Render the Wheel component if needed for additional visualization */}
      <Wheel assignedNumber={assignedNumber} onSpinComplete={() => setIsSpinning(false)} /> {/* Adapt props as per your Wheel; e.g., pass [assignedNumber] if it visualizes the result */}
    </div>
  );
}


export default App;
