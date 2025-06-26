const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/generate', (req, res) => {

    const prompt = req.body.prompt;
    const ollama = spawn('ollama', ['run', 'mistral']);
    let response = '';
    ollama.stdout.on('data', (data) => {
        response += data.toString();
    });
    ollama.stdin.write(prompt + '\n');
    ollama.on('close', () => {
        res.json({ response });
    });
    
});

app.listen(3001, () => {
    console.log('Backend running on http://localhost:3001');
});