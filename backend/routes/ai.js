// routes/ai.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

router.post('/ask', auth, async (req, res) => {
  const { note, question } = req.body;

  if (!note || !question) {
    return res.status(400).json({ message: 'Note and question are required.' });
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile', // or whichever model you prefer
        messages: [
          { role: 'system', content: 'You are a helpful assistant for analyzing notes.' },
          { role: 'user', content: `Note:\n${note}\n\nQuestion:\n${question}` }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ message: 'AI request failed' });
  }
});

module.exports = router;
