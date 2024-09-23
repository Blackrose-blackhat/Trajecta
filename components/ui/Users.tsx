"use client"
import React, { useEffect, useState } from 'react';
import AvatarGroup from './AvatarGroup'; // Adjust the import path as necessary
import { getAllUsers } from '@/actions/user.action';


const Users = () => {
    const [users,setUsers] = useState(null);
    const getUsers = async()=> {
        const res = await getAllUsers();
        setUsers(res);
    }

    useEffect(()=> {
        getUsers();
    },[])
  return (
    <div>
    
      <AvatarGroup people={users} />
    </div>
  );
};

export default Users;