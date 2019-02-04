
'use strict';

const { PubSub } = require('@google-cloud/pubsub');

const client = new PubSub();

class PubSubCoordinator {
    broadcast(topic, data) {
        const dataBuffer = Buffer.from(data);

        return client.topic(topic).publish(dataBuffer);
    }
}

module.exports = new PubSubCoordinator();
