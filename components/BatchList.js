import React, { useState, useEffect } from 'react';

export default function BatchList({ onBatchClick }) {
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://api.bland.ai/v1/batches', {
          method: 'GET',
          headers: { 'authorization': process.env.NEXT_PUBLIC_BLAND_AI_API_KEY }
        });
        const data = await response.json();
        if (data.status === 'success') {
          setBatches(data.batches);
        } else {
          console.error('Failed to fetch batches:', data);
        }
      } catch (error) {
        console.error('Error fetching batches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatches();
  }, []);

  const handleItemClick = (batchId) => {
    if (onBatchClick) {
      onBatchClick(batchId);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Batch List</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-disc">
          {batches.map((batch) => (
            <li 
              key={batch.batch_id} 
              onClick={() => handleItemClick(batch.batch_id)}
              className="cursor-pointer p-2 hover:bg-gray-100"
            >
              <p><strong>Batch ID:</strong> {batch.batch_id}</p>
              <p><strong>Label:</strong> {batch.label}</p>
              <p><strong>Base Prompt:</strong> {batch.base_prompt}</p>
              <p><strong>Created At:</strong> {batch.created_at}</p>
              {/* Additional details can be displayed here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
