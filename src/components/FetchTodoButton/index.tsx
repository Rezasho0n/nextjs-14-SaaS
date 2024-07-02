'use client';

import { useState } from "react";
import { generateClient } from "aws-amplify/api";
import { listTodos } from "@/graphql/queries";

const client = generateClient();

const FetchTodoButton = () => {
  const [todos, setTodos] = useState<any[]>([]);

  const fetchTodos = async () => {
    try {
      const response = await client.graphql({
        query: listTodos
      });
      const fetchedTodos = response.data.listTodos?.items || [];
      setTodos(fetchedTodos);
      console.log('All todos:', fetchedTodos);
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
            {todos.map((todo) => (
              <li key={todo.id}>{todo.name}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default FetchTodoButton;
