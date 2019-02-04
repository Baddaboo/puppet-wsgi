
'use strict';

const textToSpeech = require('@google-cloud/text-to-speech');

const client = new textToSpeech.TextToSpeechClient();

class TextToSpeechCoordinator {
    generate(text, voice) {
        const request = {
            input: { text: text },
            voice: {
                languageCode: 'en-US',
                name: voice
            },
            audioConfig: { audioEncoding: 'MP3' },
        };
        
        return client.synthesizeSpeech(request);
    }
}

module.exports = new TextToSpeechCoordinator();
