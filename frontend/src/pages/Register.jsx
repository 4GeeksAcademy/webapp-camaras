// ✅ React Register.jsx frontend page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('operator');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role })
      });

      if (res.ok) {
        alert('✅ Usuario registrado correctamente');
        navigate('/login');
      } else {
        const error = await res.json();
        alert(`❌ Error: ${error.msg || error.error}`);
      }
    } catch (err) {
      console.error('Error al registrar:', err);
      alert('❌ Error de conexión');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Registrar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="operator">Operador</option>
          <option value="admin">Admin</option>
        </select>
        <br />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Register;
