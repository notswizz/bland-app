import Bland from 'bland-voice';

const bland = new Bland(process.env.NEXT_PUBLIC_BLAND_AI_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { call_id } = req.body;
      const response = await bland.endCall(call_id);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
