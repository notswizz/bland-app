import React, { useState, useEffect } from 'react';
import BatchCalls from '../components/BatchCalls'; // Adjust the path as needed
import BatchList from '../components/BatchList'; // Adjust the path as needed
import BatchModal from '../components/BatchModal';

export default function Home() {
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const sendBatchCall = async (batchCallRequestBody) => {
    const options = {
      method: 'POST',
      headers: {
        'authorization': process.env.NEXT_PUBLIC_BLAND_AI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(batchCallRequestBody)
    };
  
    try {
      const response = await fetch('https://api.callbland.com/v1/batches', options);
      if (!response.ok) {
        throw new Error('Error sending batch call');
      }
      const data = await response.json();
      console.log('Batch call response:', data);
      // Handle success response
    } catch (error) {
      console.error('Error sending batch call:', error);
      // Handle error response
    }
  };

  const handleBatchClick = (batchId) => {
    setSelectedBatchId(batchId);
  };

  const handleCloseModal = () => {
    setSelectedBatchId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6 m-6">
          
          <div className="md:flex md:justify-around md:items-start">
            <div className="md:w-1/2 p-4">
            
              <BatchCalls sendBatchCall={sendBatchCall} />
            </div>
            <div className="md:w-1/2 p-4">
             
             <BatchList onBatchClick={handleBatchClick} />
              {selectedBatchId && (
        <BatchModal batchId={selectedBatchId} onClose={handleCloseModal} />
      )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
