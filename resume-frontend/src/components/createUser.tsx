import { useCollection } from '@squidcloud/react';

// Define your type
type User = { id: string; email: string; age: number };

export default function CreateUser() {
  const userCollection = useCollection<User>('users');
  const insert = () => {
    const userId = crypto.randomUUID();
    const email = `${userId}@email.com`;
    userCollection.doc(userId).insert({
      id: userId,
      email,
      age: Math.ceil(Math.random() * 100),
    });
  };
  return (
    <>
      <button onClick={insert}>Insert new user</button>
    </>
  );
}