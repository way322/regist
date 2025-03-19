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
    register: builder.mutation({
      query: (credentials) => ({
        url: '/register',
        method: 'POST',
        body: credentials,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    getTodos: builder.query({
        query: () => '/todos',
        providesTags: ['Todos'],
        transformErrorResponse: (response) => {
          return { message: response.data?.error || 'Failed to fetch todos' };
        },
    }),
      

    addTodo: builder.mutation({
        query: (todo) => ({
          url: '/todos',
          method: 'POST',
          body: { 
            description: todo.description,
            done: todo.done || false 
          },
        }),
        invalidatesTags: ['Todos'],
      }),

    updateTodo: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/todos/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Todos'],
    }),

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