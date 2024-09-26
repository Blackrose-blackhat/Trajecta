import React from 'react';
import Image from 'next/image';
import {Avatar} from './avatar'; // Adjust the import path as necessary
import { AvatarFallback } from './avatar'; // Adjust the import path as necessary

interface Person {
  id: string;
  name: string;
  image?: string;
}

interface AvatarGroupProps {
  people: Person[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ people }) => {
  const displayedPeople = people?.slice(0, 10);
  const remainingCount = people?.length - 10;

  return (
    <div className="flex -space-x-2">
      {displayedPeople?.map((person) => (
        <Avatar key={person.id}>
          {person?.image ? (
            <Image src={person?.image} alt={person?.name} width={40} height={40} />
          ) : (
            <AvatarFallback>{person?.name.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <div className="flex items-center justify-center border w-10 h-10 bg-transparent rounded-full text-sm font-medium text-neutral-200">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;