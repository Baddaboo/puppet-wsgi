
'use strict';

const textToSpeech = require('@google-cloud/text-to-speech');
const {Storage} = require('@google-cloud/storage');

const client = new textToSpeech.TextToSpeechClient();
const storage = new Storage();
const bucket = storage.bucket('puppet-blobserve');
const file = bucket.file('text-output.mp3');

class TextToSpeechCoordinator {
    handleError(reject, error) {
        console.log(error);
        reject(error);
    }

    handleGetUrl(text, url, resolve, reject) {
        const payload = {
            text: text,
            url: url
        };

        resolve(payload);
    }

    handleFileSave(text, resolve, reject) {
        var config = {
            action: 'read',
            expires: '03-17-2025'
        };
        
        file
            .getSignedUrl(config)
            .then((data) => this.handleGetUrl(text, data[0], resolve, reject))
            .catch((error) => this.handleError(reject, error));
    }

    handleTextResponse(text, textResponse, resolve, reject) {
        const audioContent = textResponse[0].audioContent;
                    
        file
            .save(audioContent)
            .then(() => this.handleFileSave(text, resolve, reject))
            .catch((error) => this.handleError(reject, error));
    }

    generate(text, voice) {
        const request = {
            input: { text: text },
            voice: {
                languageCode: 'en-US',
                name: voice
            },
            audioConfig: { audioEncoding: 'MP3' },
        };
        
        return new Promise((resolve, reject) => {
            client
                .synthesizeSpeech(request)
                .then((textResponse) => {
                    this.handleTextResponse(text, textResponse, resolve, reject);
                })
                .catch((error) => this.handleError(reject, error));
        });
    }
}

module.exports = new TextToSpeechCoordinator();
