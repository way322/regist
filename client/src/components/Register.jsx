import React, { useState } from 'react';
import { useRegisterMutation } from '../app/api';
import { useNavigate } from 'react-router-dom';
import b from './access.module.css';
export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ username, password, email }).unwrap();
      alert('Регистрация успешна! Теперь вы можете войти.');
      navigate('/login');
    } catch (err) {
      alert('Ошибка регистрации: ' + (err.data?.error || 'Неизвестная ошибка'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={b.container}>
      <h2 className={b.textz}>Регистрация</h2>
      <input
        className={b.input}
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Имя пользователя"
        required
      />
      <input
        className={b.input}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        className={b.input}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        required
      />
      <button type="submit" className={b.button}>Зарегистрироваться</button>
      <p className={b.text}>
        Уже есть аккаунт? <a href="/login" className={b.href}>Войти</a>
      </p>
    </form>
  );
}