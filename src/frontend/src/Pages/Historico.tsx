import React from 'react';
import ShipmentsList from '../components/Shippments/ListShippments/ShipmentsList';
import BatchesList from '../components/BatchList';

const Historico = () => {
  const style = {
    color: 'black',
  };

  return (
    <div className='flex justify-center items-center -mt-10 space-x-4 p-4'>
      <BatchesList />
      <ShipmentsList />
    </div>
  );
};

export default Historico;
