// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
import useGetUser from '../../Hooks/Users/getUserHook';
import EditUserButton from '../UserEditButton';



// UserInfo.js
// import { useNavigate, Link } from 'react-router-dom';
// import { useEffect } from 'react';

function UserInfo() {
  const { data: user, isLoading, error } = useGetUser();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (error) {
//       // Redirect to login if there's an error (e.g., not authenticated)
//       navigate('/login');
//     }
//   }, [error, navigate]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading user information.</p>;

  return (
    <div>

      <EditUserButton user={user} currentUser={user}/>
      
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Email:</strong> {user.id}</p>
          {/* Add more fields as needed */}
        </div>
      {/* <Link to="/">Back to Home</Link> */}
    </div>
  );
}

export default UserInfo;
