import Debug from 'debug';
import mqtt from 'mqtt';
import { DeviceManager } from 'serial-requests';

const debug = Debug('serialMqttBridge');

let server = process.argv[2] || 'localhost:1883';

serialMqttBridge(server);

/**
 * This functions runs a serial to mqtt bridge. It listens to all subtopics of `bioreactor/q`. The topics asking a command should have the syntax `bioreactor/q/<id>/<cmd>`. The topic to get the list of all existing serial devices is `bioreactor/q/list`
 * @param {string} [broker=localhost:1883] The broker address, e.g.: 127.0.0.1:1883
 */
export default async function serialMqttBridge(broker = 'localhost:1883') {
  broker = `mqtt://${broker}`;
  let deviceManager = new DeviceManager({
    optionCreator: function (portInfo) {
      console.log({ portInfo });
      if (portInfo.manufacturer === 'SparkFun') {
        console.log('xxxx');
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
    let devices = deviceManager.getDeviceIds();
    console.log(`Devices detected:${devices}`);
  });

  client.on('message', async function (topic) {
    debug(`Message received: ${topic}`);
    if (topic === 'bioreactor/q/list') {
      let devices = deviceManager.getDeviceIds();
      debug(`Detected devices: ${devices}`);
      let answer = devices.join();
      client.publish('bioreactor/a/list', answer);
    } else {
      let query = parseSubTopic(topic);
      const pubTopic = getPubTopic(query);

      let answer = await deviceManager.addRequest(query.id, `${query.cmd}\n`);
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
