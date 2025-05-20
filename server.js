const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const COHERE_API_KEY = process.env.COHERE_API_KEY;
const COHERE_URL = 'https://api.cohere.ai/v1/generate';

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  console.log('📨 User message:', userMessage);

  try {
    const response = await axios.post(
      COHERE_URL,
      {
        model: "command",
        prompt: userMessage,
        max_tokens: 100,
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const cohereReply = response.data?.generations?.[0]?.text?.trim() || 'No response.';
    console.log('🤖 Cohere reply:', cohereReply);

    res.json({ reply: cohereReply });

  } catch (error) {
    console.error('❌ Error during chat processing:', error.response?.data || error.message);
    res.status(500).json({ reply: 'Error communicating with the AI.' });
  }
});
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
