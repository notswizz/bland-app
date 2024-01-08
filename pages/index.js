import { useState, useEffect } from 'react';
import CallTranscriptModal from '../components/CallTranscriptModal';

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [task, setTask] = useState('');
  const [call_id, setCallId] = useState(null);
  const [calls, setCalls] = useState([]);
  const [callFailed, setCallFailed] = useState(false);
  const [callErrorMessage, setCallErrorMessage] = useState('');
  const [selectedCallId, setSelectedCallId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [callTranscript, setCallTranscript] = useState('');
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);




  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const response = await fetch('/api/get-calls');
      const data = await response.json();
      console.log('API Response - fetchCalls:', data);
      if (data && Array.isArray(data.calls)) {
        setCalls(data.calls);
      } else {
        console.error('Invalid data format:', data);
        setCalls([]);
      }
    } catch (error) {
      console.error('Error fetching calls:', error);
    }
  };
  
  function formatCallLength(decimalTime) {
    const minutes = Math.floor(decimalTime);
    const seconds = Math.round((decimalTime - minutes) * 60);
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  }

  function formatCreatedAt(isoString) {
    const date = new Date(isoString);
    // Options for date and time formatting
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    // Locale 'en-US' is used as an example, you can change this to suit your locale preferences
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    return `${formattedDate} at ${formattedTime}`;
  }

  const fetchCallTranscript = (call_Id) => {
    setIsLoading(true);

    const options = {
        method: 'GET',
        headers: { authorization: `${process.env.NEXT_PUBLIC_BLAND_AI_API_KEY}` }
    };

    fetch(`https://api.bland.ai/v1/calls/${call_Id}`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
          console.log('Transcript data received:', data);
            if (data && data.transcripts) {
                const transcriptText = data.transcripts
                    .map(t => `${new Date(t.created_at).toLocaleTimeString()}: ${t.text} (${t.user})`)
                    .join('\n');
                setCallTranscript(transcriptText);
            } else {
                setCallTranscript('No transcript available.');
            }
            setShowTranscriptModal(true);
        })
        .catch(err => {
            setError(err.message);
        })
        .finally(() => {
            setIsLoading(false);
        });
};



  // Function to open the modal and fetch transcript
const handleCallClick = (call_Id) => {
  console.log('Call clicked with ID:', call_Id);
  setSelectedCallId(call_Id);
  fetchCallTranscript(call_Id);
};


  const handleCloseModal = () => {
    setShowTranscriptModal(false);
    setCallTranscript('');
  };


  const handleStartCall = async (e) => {
    e.preventDefault();
    setCallFailed(false);
    setCallErrorMessage(''); // Reset the error message

    try {
      const response = await fetch('/api/start-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber, 
          task,
          // Include additional fields here as required by your updated API
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Call failed');
      }

      const data = await response.json();

      if (data && data.call_id) {
        setCallId(data.call_id);
        console.log('Call started, ID:', data.call_id);
        // Here you can add any additional logic needed after starting the call
      } else {
        setCallFailed(true);
        setCallErrorMessage('No call_id received or call failed to start.');
      }
    } catch (error) {
      console.error('Error making the call:', error);
      setCallFailed(true);
      setCallErrorMessage(error.message);
    }
};

  
  

  const handleEndCall = async () => {
    try {
      const response = await fetch('/api/end-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ call_id }),
      });
      const data = await response.json();
      console.log(data);
      setCallId(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

 
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 space-y-6">
    <h1>AI Phone Call</h1>
    {/* Show call failed notification if callFailed is true */}
    {callFailed && (
      <div className="text-red-500 mb-4">
        Call failed. Please try again later.
      </div>
    )}
      {/* Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <form onSubmit={handleStartCall} className="space-y-4">
          <div className="flex flex-col">
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Task"
              className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Start Call
          </button>
        </form>
      </div>
  
      {/* Action Buttons */}
      {call_id && (
        <div className="flex space-x-4 w-full max-w-lg">
          <button
            onClick={handleEndCall}
            className="flex-1 bg-red-600 text-white p-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            End Call
          </button>
          {callFailed && (
      <div className="text-red-500 mb-4">
        Call failed: {callErrorMessage}
      </div>
    )}
           {/* Error Message */}
      {callFailed && (
        <div className="text-center text-red-500">
          Call failed. Unable to connect to the API.
        </div>
      )}
        </div>
      )}
  
{/* Table to display calls */}
<div className="w-full max-w-4xl overflow-x-auto rounded-xl bg-white shadow-lg">
  <table className="min-w-full table-auto">
    <thead className="bg-blue-100">
      <tr className="text-left text-gray-700 uppercase text-sm leading-normal">
        <th className="py-3 px-6 text-center">To</th>
        <th className="py-3 px-6 text-center">From</th>
        <th className="py-3 px-6 text-center">Call Length</th>
        <th className="py-3 px-6">Created At</th>
        <th className="py-3 px-6">Transcript</th>
      </tr>
    </thead>
    <tbody className="text-gray-600 text-sm font-light">
      {calls.map((call) => (
        <tr key={call.c_id} className="border-b border-gray-200 hover:bg-gray-50">
          <td className="py-3 px-6 text-center">{call.to}</td>
          <td className="py-3 px-6 text-center">{call.from}</td>
          <td className="py-3 px-6 text-center">{formatCallLength(call.call_length)}</td>
          <td className="py-3 px-6">{formatCreatedAt(call.created_at)}</td>
          <td className="py-3 px-6">
            <button
              onClick={() => fetchCallTranscript(call.c_id)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              View Transcript
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<CallTranscriptModal
  showModal={showTranscriptModal}
  callTranscript={callTranscript}
  onClose={handleCloseModal}
/>


    </div>
  );
  
  
}
