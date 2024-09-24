import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './avatar'; // Adjust the import path as necessary
import Image from 'next/image';

interface Person {
  id: string;
  name: string;
  image?: string;
}

interface AvatarGroupProps {
  people: Person[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ people }) => {
 
  return (
    <div className="flex -space-x-2">
      {people?.map((person) => (
        <Avatar key={person.id}>
          {person.image ? (
           <Image src={person.image} alt={person.name.charAt(0)} width={40} height={40} />
          ) : (
            <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
      ))}
    </div>
  );
};

export default AvatarGroup;