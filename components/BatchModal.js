import React, { useState, useEffect } from 'react';

export default function BatchModal({ batchId, onClose }) {
  const [batchDetails, setBatchDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.bland.ai/v1/batches/${batchId}`, {
          method: 'GET',
          headers: { 'authorization': process.env.NEXT_PUBLIC_BLAND_AI_API_KEY }
        });
        const data = await response.json();
        if (response.ok) {
          setBatchDetails(data);
        } else {
          console.error('Failed to fetch batch details:', data);
        }
      } catch (error) {
        console.error('Error fetching batch details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (batchId) {
      fetchBatchDetails();
    }
  }, [batchId]);

  if (!batchId) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Batch Details</h2>
              <button onClick={onClose} className="py-2 px-4 bg-red-500 text-white rounded">Close</button>
            </div>
            {batchDetails && (
              <div className="mt-4">
                <p><strong>Batch ID:</strong> {batchDetails.batch_params.id}</p>
                <p><strong>Label:</strong> {batchDetails.batch_params.label}</p>
                <p><strong>Base Prompt:</strong> {batchDetails.batch_params.base_prompt}</p>
                <p><strong>Created At:</strong> {batchDetails.batch_params.created_at}</p>
                {/* Additional details here */}
                <p><strong>Total Calls:</strong> {batchDetails.analysis.total_calls}</p>
                <p><strong>Completed Calls:</strong> {batchDetails.analysis.completed_calls}</p>
                {/* ... other analysis details */}
                <p><strong>Call Data:</strong></p>
                <ul>
                  {batchDetails.call_data.map((call, index) => (
                    <li key={index}>
                      <p>To: {call.to}, From: {call.from}, Duration: {call.call_length} minutes</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
