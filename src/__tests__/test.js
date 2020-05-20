import Debug from 'debug';
import mqtt from 'mqtt';

// import serialMqttBridge from '..';

const debug = Debug('test');

// you should be running the bridge in another terminal!
// serialMqttBridge();

// This test only works if you have a bioreactor plugged in your computer.
// Change the variables below to match your setup.
let broker = `mqtt://localhost:1883`;
let id = 2;

const client = mqtt.connect(broker);
client.on('connect', () => {
  debug('Client connected!');
  client.subscribe(`bioreactor/a/${id}/h`, (err) => {
    if (err) {
      debug(err);
    }
  });
  client.publish(`bioreactor/q/${id}/h`, '');
});

client.on('message', function (topic, message) {
  debug(`Message received: ${topic}`);
  const answer = message.toString();
  console.log(answer);

  describe('test serialMqttBridge', () => {
    it('should return help message', () => {
      expect(answer).toStrictEqual(42);
    });
  });

  client.end();
});
