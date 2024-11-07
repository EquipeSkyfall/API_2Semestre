import React from 'react';
import ShipmentsList from '../components/Shippments/ListShippments/ShipmentsList';
import BatchesList from '../components/BatchList';
import LogList from '../components/LogListing';

const Historico = () => {
  const style = {
    color: 'black',
  };

  return (
    <div className='md:flex justify-center items-center -mt-10 md:space-x-4 p-4'>
      <LogList />
        <BatchesList />
        <ShipmentsList />
      </div>
  );
};

export default Historico;
