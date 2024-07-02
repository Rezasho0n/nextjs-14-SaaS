'use client';

import React, { useState } from "react";
import { listTodos } from "@/graphql/queries";
import { client } from '@/amplify-config';
import { ListTodosQuery, Todo } from '@/API';  // Make sure to import Todo type
import { GraphQLResult } from '@aws-amplify/api';

function isGraphQLResult(result: any): result is GraphQLResult<ListTodosQuery> {
  return 'data' in result;
}

const FetchTodoButton: React.FC = () => {
  const [todos, setTodos] = useState<(Todo | null)[]>([]);

  const fetchTodos = async () => {
    try {
      const result = await client.graphql({
        query: listTodos
      });

      if (isGraphQLResult(result)) {
        const fetchedTodos = result.data.listTodos?.items || [];
        setTodos(fetchedTodos);
        console.log('All todos:', fetchedTodos);
      } else {
        console.error('Unexpected result type');
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  return (
    <>
      <button 
        onClick={fetchTodos}
        className="mb-6 inline-block rounded-md bg-white px-8 py-3 text-base font-semibold text-primary transition duration-300 ease-in-out hover:bg-opacity-90 hover:shadow-signUp"
      >
        Click here
      </button>
      {todos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Fetched Todos:</h2>
          <ul className="text-white">
            {todos.map((todo, index) => (
              <li key={todo?.id || index}>
                {todo?.name || 'Unnamed Todo'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default FetchTodoButton;