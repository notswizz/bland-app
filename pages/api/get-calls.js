export default async function handler(req, res) {
    if (req.method === 'GET') {
      const url = 'https://api.bland.ai/v1/calls';
      const options = {
        method: 'GET',
        headers: {
          'authorization': process.env.NEXT_PUBLIC_BLAND_AI_API_KEY, // Ensure this is set in your environment variables
        },
      };
  
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        console.error('Error fetching calls:', error);
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  }
  