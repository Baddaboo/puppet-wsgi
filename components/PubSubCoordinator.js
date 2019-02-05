
'use strict';

const { PubSub } = require('@google-cloud/pubsub');

const client = new PubSub();

class PubSubCoordinator {
    broadcast(topic, payload) {
        const stringData = JSON.stringify(payload);
        const data = Buffer.from(stringData);

        return client.topic(topic).publish(data);
    }
}

module.exports = new PubSubCoordinator();
