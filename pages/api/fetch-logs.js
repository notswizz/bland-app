export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { call_id } = req.body;

    try {
      // Fetch logs using the Bland API directly
      const logs = await fetchLogs(call_id);
      res.status(200).json(logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

async function fetchLogs(call_id) {
  const options = {
    method: 'GET',
    headers: { authorization: `${process.env.NEXT_PUBLIC_BLAND_AI_API_KEY}` }
  };

  const response = await fetch(`https://api.bland.ai/v1/calls/${call_id}`, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  // Print the data to the console for debugging
  console.log("Transcript Data:", data);

  return await response.json();
}
