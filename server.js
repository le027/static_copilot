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

//endpoint to save the questionnaire 
app.post('/save-questionnaire', (req, res) => {
    const { userId, years_from_last_degree, highest_degree, educational_path } = req.body;

    if (!userId || !years_from_last_degree || !highest_degree || !educational_path) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const responses = readResponses();

    //check if the user id already exists
    const existingUser = responses.find(entry => entry.userId === userId);
    if (existingUser) {
        return res.status(400).json({ message: 'The user has already sent a questionnarie.' });
    }

    //write a new object with the questionnaire data
    responses.push({
        userId,
        years_from_last_degree,
        highest_degree,
        educational_path,
        response: null 
    });

    writeResponses(responses);

    res.json({ message: 'Questionnaire saved!' });
});

//endpoint to save the value of the textarea
app.post('/save-response', (req, res) => {
    const { userId, response } = req.body;

    if (!userId || !response) {
        return res.status(400).json({ message: 'UserId or response not found.' });
    }

    const responses = readResponses();
    
    //find the userId related to the response
    const userEntry = responses.find(entry => entry.userId === userId);
    if (!userEntry) {
        return res.status(404).json({ message: 'User ID not found. Complete first the questionnaire.' });
    }

    //add the response
    userEntry.response = response;

    writeResponses(responses);

    res.json({ message: 'Response saved!' });
});

//start the server
app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
