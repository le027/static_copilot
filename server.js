const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); //allow to interact with the file system
const path = require('path');

const app = express();
const PORT = 3000;

//middleware to parse the body of the request
app.use(bodyParser.json());

//allow to serve static files (simple_static_copilot.html)
app.use(express.static(path.join(__dirname)));

//__dirname is the absolute path of this file

//percorso del file di risposte
const filePath = path.join(__dirname, 'response.json');

//function to read the file as a JSON
const readResponses = () => {
    if (!fs.existsSync(filePath)) {
        return []; // Se il file non esiste, ritorna un array vuoto
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
};

//function to write the file as a JSON
const writeResponses = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

//endpoint to generate a new userId
app.get('/generate-user-id', (req, res) => {
    let responses = readResponses();
    let existingIds = new Set(responses.map((entry) => entry.userId));

    let userId;
    //repeat the cycle until the user id generated is new
    do {
        userId = Math.floor(Math.random() * 1000000).toString();
    } while (existingIds.has(userId));

    res.json({ userId });
});

//endpoint to save the value of the textarea
app.post('/save-response', (req, res) => {
    const { userId, response } = req.body;

    if (!userId || !response) {
        return res.status(400).json({ message: 'UserId or response not found.' });
    }

    let responses = readResponses();
    responses.push({ userId, response });

    writeResponses(responses);

    res.json({ message: 'Answer saved, thank you!' });
});

//start the server
app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
