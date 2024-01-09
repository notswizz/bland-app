import React, { useState, useEffect } from 'react';

export default function BatchModal({ batchId, onClose }) {
  const [batchDetails, setBatchDetails] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
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

  const analyzeBatch = async () => {
    // Set up the analysis request here
    const analyzeUrl = `https://api.bland.ai/v1/batches/${batchId}/analyze`;
    const analyzeBody = {
      goal: "Your analysis goal here",
      questions: [
        ["Who answered the call?", "human or voicemail"],
        ["Positive feedback about the product: ", "string"],
        ["Negative feedback about the product: ", "string"],
        ["Customer confirmed they were satisfied", "boolean"]
        // Add more questions as needed
      ]
    };

    try {
        const response = await fetch(analyzeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': process.env.NEXT_PUBLIC_BLAND_AI_API_KEY
          },
          body: JSON.stringify(analyzeBody)
        });
  
        const data = await response.json();
        if (response.ok) {
          setAnalysisResults(data); // Store the analysis results in state
        } else {
          console.error('Failed to analyze batch:', data);
        }
      } catch (error) {
        console.error('Error analyzing batch:', error);
      }
    };
  
    if (!batchId) return null;


    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl">
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                    <span className="visually-hidden">Loading</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-semibold text-gray-900">Batch Details</h2>
                    <button onClick={onClose} className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2">Close</button>
                  </div>
                  <div className="overflow-y-auto max-h-96">
                    {batchDetails && (
                      <div>
                        <p className="text-lg"><strong>Batch ID:</strong> {batchDetails.batch_params.id}</p>
                        <p className="text-lg"><strong>Label:</strong> {batchDetails.batch_params.label}</p>
                        <p className="text-lg"><strong>Base Prompt:</strong> {batchDetails.batch_params.base_prompt}</p>
                        <p className="text-lg"><strong>Created At:</strong> {batchDetails.batch_params.created_at}</p>
                        <p className="text-lg"><strong>Total Calls:</strong> {batchDetails.analysis.total_calls}</p>
                        <p className="text-lg"><strong>Completed Calls:</strong> {batchDetails.analysis.completed_calls}</p>
                        <p className="text-lg"><strong>Call Data:</strong></p>
                        <ul className="list-disc list-inside">
                          {batchDetails.call_data.map((call, index) => (
                            <li key={index} className="mb-2">
                              <p>To: {call.to}, From: {call.from}, Duration: {call.call_length} minutes</p>
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={analyzeBatch}
                          className="mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-300"
                        >
                          Analyze Batch
                        </button>
                        {analysisResults && (
                          <div className="mt-4">
                            <h3 className="text-lg font-semibold">Analysis Results</h3>
                            <p><strong>Status:</strong> {analysisResults.status}</p>
                            <p><strong>Message:</strong> {analysisResults.message}</p>
                            <div>
                              <strong>Answers:</strong>
                              {Object.entries(analysisResults.answers).map(([callId, answers]) => (
                                <div key={callId} className="mt-2">
                                  <p>Call ID: {callId}</p>
                                  <ul className="list-disc list-inside">
                                    {answers.map((answer, index) => (
                                      <li key={index}>{analysisResults.questions[index][0]}: {answer}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                            <p><strong>Credits Used:</strong> {analysisResults.credits_used}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      );
}
