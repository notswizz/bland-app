import React, { useState } from 'react';

export default function BatchCalls({ sendBatchCall }) {
  const [basePrompt, setBasePrompt] = useState('');
  const [label, setLabel] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [business, setBusiness] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [callData, setCallData] = useState([]);

  const addCallData = () => {
    // Split the phoneNumber string into an array of numbers
    const phoneNumbersArray = phoneNumber.split(',').map(number => number.trim());
    const newCallData = phoneNumbersArray.map(phoneNumber => ({
      phone_number: phoneNumber,
      business,
      service,
      date,
    }));
    setCallData([...callData, ...newCallData]);

    // Reset fields
    setPhoneNumber('');
    setBusiness('');
    setService('');
    setDate('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const batchCallRequestBody = {
      base_prompt: basePrompt,
      call_data: callData,
      label,
      // Add other parameters if needed
    };
    sendBatchCall(batchCallRequestBody);
  };

  return (
    <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Send Batch Calls</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="text"
          value={basePrompt}
          onChange={(e) => setBasePrompt(e.target.value)}
          placeholder="Base Prompt"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Numbers (comma-separated)"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          placeholder="Business"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          value={service}
          onChange={(e) => setService(e.target.value)}
          placeholder="Service"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="button"
          onClick={addCallData}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Call Data
        </button>
        <div className="bg-gray-100 p-2 rounded border border-gray-300">
          <h3 className="font-semibold text-gray-700">Current Call Data:</h3>
          <pre className="text-xs">{JSON.stringify(callData, null, 2)}</pre>
        </div>
        <button 
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Send Batch Calls
        </button>
      </form>
    </div>
  );
}
