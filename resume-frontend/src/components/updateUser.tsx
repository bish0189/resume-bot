import React from 'react';
import { useCollection, useQuery } from '@squidcloud/react';

type User = { id: string; email: string; age: number };
type EventObj = { value: string }; // Used for form event data access

export default function UpdateUser() {
  const collection = useCollection<User>('users');
  const users = useQuery(collection.query());

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Find the first user with the matching email
    const user = users.data.find(
      (user) =>
        user.data.email == (e.target as unknown as Array<EventObj>)[0].value
    );

    if (user) {
      user
        .update({
          age: Number((e.target as unknown as Array<EventObj>)[1].value),
        })
        .then(() => console.log('User updated successfully'))
        .catch((error) => console.error('Failed to update user', error));
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ padding: '20px' }}>
      <label htmlFor="email">Email: </label>
      <input id="email" />
      <label style={{ marginLeft: '10px' }}>Age: </label>
      <input id="age" type="number" />
      <input type="submit" value="Update age" />
    </form>
  );
}