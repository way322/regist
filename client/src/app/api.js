import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    // Регистрация пользователя
    register: builder.mutation({
      query: (credentials) => ({
        url: '/register',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Авторизация пользователя
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Получение списка задач
    getTodos: builder.query({
        query: () => '/todos',
        providesTags: ['Todos'],
        // Добавляем обработку ошибок
        transformErrorResponse: (response) => {
          return { message: response.data?.error || 'Failed to fetch todos' };
        },
    }),
      

    // Добавление новой задачи
    addTodo: builder.mutation({
        query: (todo) => ({
          url: '/todos',
          method: 'POST',
          body: { 
            description: todo.description,
            done: todo.done || false 
          },
        }),
        // Автоматический рефетч после успешного добавления
        invalidatesTags: ['Todos'],
      }),

    // Обновление задачи
    updateTodo: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/todos/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Todos'],
    }),

    // Удаление задачи
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todos'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = api;