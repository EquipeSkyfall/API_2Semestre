
import React from 'react';

interface MainWrappenProps {
  children: React.ReactNode; // Explicitly define the type for children
}
export default function MainWrapper({children}: MainWrappenProps){

    return(
        <main className='flex place-items-center justify-center my-14'>
            {children}
        </main>


    )
}