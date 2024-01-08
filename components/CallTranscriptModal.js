import React, { useEffect, useState } from 'react';

const CallTranscriptModal = ({ showModal, callId, onClose }) => {
  const [callTranscript, setCallTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Modal visibility:', showModal, 'Call ID:', callId);
    if (showModal && callId) {
      setIsLoading(true);

      const options = {
        method: 'GET',
        headers: { authorization: `${process.env.NEXT_PUBLIC_BLAND_AI_API_KEY}` }
      };

      fetch(`https://api.bland.ai/v1/calls/${callId}`, options)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Process the transcripts array
          if (data && data.transcripts) {
            const transcriptText = data.transcripts
              .map(t => `${new Date(t.created_at).toLocaleTimeString()}: ${t.text} (${t.user})`)
              .join('\n');
            setCallTranscript(transcriptText);
          } else {
            setCallTranscript('No transcript available.');
          }
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [showModal, callId]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-2xl shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4">Call Transcript</h3>
        <div className="overflow-y-auto max-h-96">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="whitespace-pre-wrap text-sm">{callTranscript}</p>
          )}
        </div>
        <button onClick={onClose} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default CallTranscriptModal;
