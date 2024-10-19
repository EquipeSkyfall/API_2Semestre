import React, { useState, useEffect } from 'react';
import useGetShipments from '../../../Hooks/Shippments/useGetShipments';

const ShipmentsList: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [debouncedDate, setDebouncedDate] = useState<string>('');
  const [page, setPage] = useState(1);
  const limit = 10; // Number of items per page

  const { data, isLoading, isError } = useGetShipments(debouncedDate, page, limit);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDate(selectedDate);
    }, 3000); // 300ms debounce delay

    return () => {
      clearTimeout(handler); // Cleanup the timeout on unmount or when selectedDate changes
    };
  }, [selectedDate]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    setPage(1); // Reset to the first page on date change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const formatDateForBackend = (date: string) => {
    // Convert date string to a JavaScript Date object
    const dateObject = new Date(date);
    // Optional: Format to ISO string if needed
    return dateObject.toISOString(); // or return dateObject if you need a Date object
  };

  const parsedDate = selectedDate ? formatDateForBackend(selectedDate) : '';

  if (isLoading) return <p>Loading shipments...</p>;
  if (isError) return <p>Error loading shipments.</p>;

  return (
    <div>
      <h2>Shipments List</h2>
      <label htmlFor="datePicker">Select a date:</label>
      <input
        type="date"
        id="datePicker"
        value={selectedDate}
        onChange={handleDateChange}
      />
      <ul>
        {data?.shipments.map((shipment) => (
          <li key={shipment.id_saida}>
            <p>
              ID: {shipment.id_saida} - Date: {shipment.data_venda} - Reason: {shipment.motivo_saida}
            </p>
          </li>
        ))}
      </ul>
      {data && (
        <div>
          <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {data.totalPages}
          </span>
          <button
            disabled={page === data.totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ShipmentsList;
