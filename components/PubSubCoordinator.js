
'use strict';

// const { PubSub } = require('@google-cloud/pubsub');
// const client = new PubSub();
const fs = require('fs');
const credentialFile = fs.readFileSync('./credentials/pubnub.json');
const credential = JSON.parse(credentialFile);

const PubNub = require('pubnub');
const client = new PubNub({
    publishKey: credential.publishKey,
    subscribeKey: credential.subscribeKey
});

class PubSubCoordinator {
    broadcast(topic, payload) {
        const stringData = JSON.stringify(payload);
        // const data = Buffer.from(stringData);

        // return client.topic(topic).publish(data);

        return new Promise((resolve, reject) => {
            client.publish({
                message: stringData,
                channel: 'default'
            },
            function(status, response) {
                if (status.error) { reject(status.error); }
                else { resolve(response); }
            });
        });
    }
}

module.exports = new PubSubCoordinator();
