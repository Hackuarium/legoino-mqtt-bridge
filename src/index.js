import Debug from 'debug';
import SerialBridge from 'legoino-serial-bridge';
import mqtt from 'mqtt';
import Yargs from 'yargs';

const debug = Debug('serialMqttBridge');

let cliArguments = Yargs.argv;

const brokerOptions = {
  broker: cliArguments.b,
  deviceType: cliArguments.t,
  username: cliArguments.u,
  password: cliArguments.P,
};

debug(brokerOptions);

serialMqttBridge(brokerOptions);

/**
 * This function runs a serial to mqtt bridge.
 *
 * The topics querying a command should have the syntax `bioreactor/q/<id>/<cmd>`.
 *
 * The topic to get the list of all existing serial devices is `bioreactor/q/list`
 *
 * @param {object} [options={}]
 * @param {string} [options.deviceType='bioreactor'] The kind of device you want to query
 * @param {string} [options.host='mqtt://localhost:1883'] The broker address, e.g.: mqtt://127.0.0.1:1883
 * @param {string} [options.username] The username of the MQTT broker, if it is secured
 * @param {string} [options.password] The password of the MQTT broker, if it is secured
 */
export default async function serialMqttBridge(options = {}) {
  const {
    deviceType = 'bioreactor',
    host = 'mqtt://localhost:1883',
    username,
    password,
  } = options;

  let serialBridge = new SerialBridge({ defaultCommandExpirationDelay: 500 });

  // updating devices list every second
  serialBridge.continuousUpdateDevices();

  // the format of the query topics is <type>/q/<id>/<cmd>
  debug(`Broker: ${host}`);

  let client;

  if (!username && !password) {
    client = mqtt.connect(host);
  } else if (username && password) {
    client = mqtt.connect(host, { username, password });
  } else {
    throw new Error(
      'Please specify both username AND password in case broker is secured',
    );
  }

  client.on('connect', () => {
    debug('Client connected!');
    client.subscribe(`${deviceType}/q/#`, (err) => {
      if (err) {
        debug(err);
      }
    });
  });

  client.on('message', async function (topic) {
    debug(`Message received: ${topic}`);
    if (topic === `${deviceType}/q/list`) {
      // only returning currently connected devices
      let devices = serialBridge.getDevicesList({ ready: true });
      debug(`Detected devices: ${devices.map((device) => device.id).join()}`);
      let answer = JSON.stringify(devices);
      client.publish(`${deviceType}/a/list`, answer);
    } else {
      let query = parseSubTopic(topic);
      const pubTopic = getPubTopic(query);

      let answer = await serialBridge
        .sendCommand(query.id, query.cmd)
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
    type: array[0],
    id: array[2],
    cmd: array[3],
  };
}

function getPubTopic(query) {
  return `${query.type}/a/${query.id}/${query.cmd}`;
}
