import React from 'react';
import ShipmentsList from '../components/Shippments/ListShippments/ShipmentsList';
import BatchesList from '../components/BatchList';

const Historico = () => {
  const style = {
    color: 'black',
  };

  return (
    <>
      <ShipmentsList />
      <BatchesList />
    </>
  );
};

export default Historico;
