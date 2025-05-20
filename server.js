const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// === COHERE CONFIG ===
const COHERE_API_KEY = process.env.COHERE_API_KEY;
const COHERE_URL = 'https://api.cohere.ai/v1/generate';

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  console.log('📨 User message:', userMessage);

  try {
    // Send user message directly to Cohere without translation
    const response = await axios.post(
      COHERE_URL,
      {
        model: "command", // or "command-light"
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

    // Send response back to frontend
    res.json({ reply: cohereReply });

  } catch (error) {
    console.error('❌ Error during chat processing:', error.response?.data || error.message);
    res.status(500).json({ reply: 'Error communicating with the AI.' });
  }
});
const path = require('path');

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Optional: serve index.html for any unknown routes (for SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
