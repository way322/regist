import React, { useState } from 'react';
import { useGetTodosQuery, useAddTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation } from '../app/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Добавляем импорт
import { api } from '../app/api';
import a from './TodoList.module.css';

export default function TodoList() {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Получаем dispatch
    const [newTodo, setNewTodo] = useState({ description: '', done: false });
    const [editTodo, setEditTodo] = useState(null);

  const { data: todos = [], isLoading, error } = useGetTodosQuery();
  const [addTodo] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation({
    onError: (err) => alert('Update failed: ' + err.data?.error),
  });
  const [deleteTodo] = useDeleteTodoMutation({
    onError: (err) => alert('Delete failed: ' + err.data?.error),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTodo(newTodo).unwrap();
      setNewTodo({ description: '', done: false });
    } catch (err) {
      console.error('Ошибка создания:', err);
    }
  };

  const handleUpdate = async (id, updatedTodo) => {
    if (!updatedTodo.description.trim()) {
      alert('Task description cannot be empty');
      return;
    }
    
    try {
      await updateTodo({
        id,
        description: updatedTodo.description,
        done: updatedTodo.done
      }).unwrap();
      setEditTodo(null);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id).unwrap();
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(api.util.resetApiState()); // Сбрасываем кэш RTK Query
    navigate('/login');
  };


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={a.App}>
      <div className={a.header}>
        <h1 className={a.zagalovok}>Менеджер задач</h1>
        <button onClick={handleLogout} className={a.logoutButton}>Выйти</button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
          placeholder="Новая задача"
          required
          className={a.input}
        />
        <button type="submit" className={a.button1}>Добавить</button>
      </form>

      <div className={a.todosList}>
        {todos
          .slice() 
          .sort((a, b) => b.id  - a.id) 
          .map((todo) => (
            <div key={todo.id} className={a.todoItem}>
              {editTodo?.id === todo.id ? (
                <input
                  className={a.inizmen}
                  value={editTodo.description}
                  onChange={(e) => setEditTodo({ ...editTodo, description: e.target.value })}
                />
              ) : (
                <span className={`${a.text} ${todo.done ? a.done : ''}`}>
                  {todo.description}
                </span>
              )}

              <div className={a.actions}>
                <input
                  type="checkbox"
                  className={a.check}
                  checked={todo.done}
                  onChange={() => handleUpdate(todo.id, { ...todo, done: !todo.done })}
                />
              
              {editTodo?.id === todo.id ? (
                <button
                  className={a.knopka}
                  onClick={() => handleUpdate(todo.id, editTodo)}
                >
                  Сохранить
                </button>
              ) : (
                <button
                  className={a.knopka}
                  onClick={() => setEditTodo(todo)}
                >
                  Редактировать
                </button>
              )}
              
              <button
                className={a.knopka}
                onClick={() => handleDelete(todo.id)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}