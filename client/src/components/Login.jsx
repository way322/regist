import { useState } from 'react';
import { useLoginMutation } from '../app/api';
import { useNavigate } from 'react-router-dom';
import b from './access.module.css';
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password }).unwrap();
      localStorage.setItem('token', response.token);
      navigate('/todos');
    } catch (err) {
      alert('Login failed: ' + (err.data?.error || 'Unknown error'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={b.container}>
    <h2 className={b.textz}>Вход</h2>
      <input
        className={b.input}
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className={b.input}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" className={b.button}>Login</button>
    </form>
  );
}