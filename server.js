const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/webhook', (req, res) => {
  console.log('Telegram update:', JSON.stringify(req.body));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

