'use client';

import React, { useState } from "react";
import { listTodos } from "@/graphql/queries";
import { client } from '@/amplify-config';
import { ListTodosQuery, Todo } from '@/API';
import { GraphQLResult } from '@aws-amplify/api';
import { useAuth } from '@/contexts/AuthContext';

function isGraphQLResult(result: any): result is GraphQLResult<ListTodosQuery> {
  return 'data' in result;
}

const FetchTodoButton: React.FC = () => {
  const [todos, setTodos] = useState<(Todo | null)[]>([]);
  const { user } = useAuth();

  const fetchTodos = async () => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      const result = await client.graphql({
        query: listTodos,
        variables: {
          filter: {
            owner: { eq: user.username }
          }
        }
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
    <div className="p-4">
      <button 
        onClick={fetchTodos}
        disabled={!user}
        className="mb-6 inline-block rounded-md bg-blue-500 px-8 py-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-lg"
      >
        Fetch My Data
      </button>
      {todos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Data:</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Description</th>
                </tr>
              </thead>
              <tbody>
                {todos.map((todo, index) => (
                  <tr key={todo?.id || index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{todo?.id || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{todo?.name || 'Unnamed Todo'}</td>
                    <td className="py-2 px-4 border-b">{todo?.description || 'No description'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchTodoButton;