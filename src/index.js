import Debug from 'debug';
import SerialBridge from 'legoino-serial-bridge';
import mqtt from 'mqtt';

const debug = Debug('serialMqttBridge');

let server = process.argv[2] || 'localhost:1883';

serialMqttBridge(server);

/**
 * This function runs a serial to mqtt bridge. It listens to all subtopics of `bioreactor/q`.
 *
 * The topics querying a command should have the syntax `bioreactor/q/<id>/<cmd>`.
 *
 * The topic to get the list of all existing serial devices is `bioreactor/q/list`
 *
 * @param {string} [broker=localhost:1883] The broker address, e.g.: 127.0.0.1:1883
 */
export default async function serialMqttBridge(broker = 'localhost:1883') {
  broker = `mqtt://${broker}`;

  let serialBridge = new SerialBridge({ defaultCommandExpirationDelay: 500 });

  // updating devices list every second
  serialBridge.continuousUpdateDevices();

  // the format of the query topics is bioreactor/q/<id>/<cmd>
  debug(`Broker: ${broker}`);
  const client = mqtt.connect(broker);

  client.on('connect', () => {
    debug('Client connected!');
    client.subscribe(`bioreactor/q/#`, (err) => {
      if (err) {
        debug(err);
      }
    });
  });

  client.on('message', async function (topic) {
    debug(`Message received: ${topic}`);
    if (topic === 'bioreactor/q/list') {
      // only returning currently connected devices
      let devices = serialBridge.getDevicesList({ ready: true });
      debug(`Detected devices: ${devices.map((device) => device.id).join()}`);
      let answer = JSON.stringify(devices);
      client.publish('bioreactor/a/list', answer);
    } else {
      let query = parseSubTopic(topic);
      const pubTopic = getPubTopic(query);

      let answer = await serialBridge
        .sendCommand(query.id, `${query.cmd}`)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          debug(err);
        });

      // console.log(answer);

      client.publish(pubTopic, answer);
    }
  });
}

function parseSubTopic(topic) {
  let array = topic.split('/');
  if (array.length !== 4) {
    debug('Error: Invalid topic format.');
    return;
  }
  return {
    id: array[2],
    cmd: array[3],
  };
}

function getPubTopic(query) {
  return `bioreactor/a/${query.id}/${query.cmd}`;
}
