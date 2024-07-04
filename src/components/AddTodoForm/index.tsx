'use client';

import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createTodo } from '@/graphql/mutations';
import { CreateTodoInput } from '@/API';
import { useAuth } from '@/contexts/AuthContext';


const client = generateClient();

interface AddTodoFormProps {
  onTodoAdded?: () => void;  // Make this prop optional
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onTodoAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuth();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      if (!user) {
        console.error('User not authenticated');
        return;
      }
      const input: CreateTodoInput = { name, description,
        owner: user.username // Add the owner field
       };
      const result = await client.graphql({
        query: createTodo,
        variables: { input }
      });
      console.log('Todo created:', result);
      // Clear form after successful submission
      setName('');
      setDescription('');
      // Call the onTodoAdded function if it's provided
      if (onTodoAdded) {
        onTodoAdded();
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={!user}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Todo
      </button>
    </form>
  );
};

export default AddTodoForm;