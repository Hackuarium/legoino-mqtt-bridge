import Debug from 'debug';
import mqtt from 'mqtt';
import { DeviceManager } from 'serial-requests';

const debug = Debug('index');

serialMqttBridge('localhost:1883');

/**
 * This functions runs a serial to mqtt bridge. It listens to all subtopics of `bioreactor/q`. The topics sent should have the syntax `bioreactor/q/<id>/<cmd>`.
 * @param {string} broker The broker address, e.g.: 127.0.0.1:1883
 */
export default async function serialMqttBridge(broker) {
  broker = `mqtt://${broker}`;
  let deviceManager = new DeviceManager({
    optionCreator: function (portInfo) {
      if (portInfo.manufacturer === 'SparkFun') {
        return {
          baudRate: 9600,
          getIdCommand: 'uq\n',
          getIdResponseParser: function (buffer) {
            return buffer.replace(/[^0-9]/g, '');
          },
          checkResponse: function (buffer) {
            return buffer.endsWith('\n');
          },
          connect: function (connected) {
            debug('Connected', connected);
          },
        };
      }
    },
  });

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
    let query = parseSubTopic(topic);
    const pubTopic = getPubTopic(query);

    let answer = await deviceManager.addRequest(query.id, `${query.cmd}\n`);
    // console.log(answer);

    client.publish(pubTopic, answer);
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
