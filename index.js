
'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const textToSpeech = require('./components/TextToSpeechCoordinator');
const pubSub = require('./components/PubSubCoordinator');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

const handleError = (error, res) => {
    console.log(JSON.stringify(error));
    res.status(500).send(error);
};

const handleSuccess = (res) => res.sendStatus(200);

app.post('/broadcast', (req, res) => {
    var text = req.body.text;
    var voice = req.body.voice;

    textToSpeech
        .generate(text, voice)
        .then((textResponse) => {
            const audioBuffer = textResponse[0].audioContent;
            const payload = {
                text: text,
                audio: audioBuffer
            };

            pubSub
                .broadcast('frontend', payload)
                .then((pubResponse) => {
                    handleSuccess(res);
                })
                .catch((error) => handleError(error, res));
        })
        .catch((error) => handleError(error, res));
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
});

module.exports = app;
