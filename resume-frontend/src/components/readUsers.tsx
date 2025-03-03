import { useCollection, useQuery } from '@squidcloud/react';

type User = { id: string; email: string; age: number };

export default function ReadUsers() {
  const collection = useCollection<User>('users');
  /** The list of users will be streamed to the client and kept up-to-date */
  const users = useQuery(collection.query());

  return (
    <ul style={{ listStyle: 'none', paddingLeft: '0px' }}>
      {users.data.map((user) => (
        <li key={user.data.id}>
          {user.data.email} - {user.data.age}
        </li>
      ))}
    </ul>
  );
}