import Bland from 'bland-voice';

const bland = new Bland(process.env.BLAND_AI_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await bland.startCall(req.body.phoneNumber, true, 1, { task: req.body.task });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
