# legoino-mqtt-bridge

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Retrieve data from serial devices when queried, and publish it as MQTT messages.

## Installation

`$ npm i legoino-mqtt-bridge`

## Usage from CLI

### Clone the project

```bash
git clone https://github.com/Hackuarium/legoino-mqtt-bridge.git
```

### Run the project

Run normally:

```bash
npm start [options]
```

Run in debug mode:

```bash
npm run start-dev [options]
```

### Options

The `index.js` script accepts four command line options:

- `-t`: device type (default: "bioreactor")
- `-b`: broker address (default: "mqtt://127.0.0.1:1883)
- `-u`: username
- `-p`: password

## Usage from Node

```js
import serialMqttBridge from 'legoino-mqtt-bridge';

serialMqttBridge('localhost:1883');
```

## MQTT topics standard

We define an MQTT topics standard: each topic sent to the bridge is composed of the device type (typically "bioreactor"), followed by a "q" (query) or "a" (answer), followed by the device unique id and finally the command asked for. The packages that will be sent to the bridge do not need to have any content (aka: they can be an empty string). Reading the MQTT doc confirmed that the message contents are indeed optional for publish messages.

### Send a command to a serial device

The query topics format:

```bash
<type>/q/<id>/<cmd>
```

### Query for all connected serial devices

Use the following topic to get a list of all existing serial devices:

```bash
<type>/q/list
```

### Answer topics

To listen to all the answers of the bridge, subscribe to this topic:

```
<type>/a/#
```

## Test that the bridge answers correctly

Be sure that you have previously installed mosquitto.

Create MQTT subscriber:

```bash
mosquitto_sub -t 'bioreactor/a/#'
```

Publish a message:

```bash
mosquitto_pub -t 'bioreactor/q/list' -m ''
```

## [API Documentation](https://hackuarium.github.io/legoino-mqtt-bridge/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/legoino-mqtt-bridge.svg
[npm-url]: https://www.npmjs.com/package/legoino-mqtt-bridge
[ci-image]: https://github.com/cheminfo/legoino-mqtt-bridge/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/legoino-mqtt-bridge/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/legoino-mqtt-bridge.svg
[codecov-url]: https://codecov.io/gh/cheminfo/legoino-mqtt-bridge
[download-image]: https://img.shields.io/npm/dm/legoino-mqtt-bridge.svg
[download-url]: https://www.npmjs.com/package/legoino-mqtt-bridge
