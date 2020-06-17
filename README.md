# legoino-mqtt-bridge

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Retrieve data from serial devices when queried, and publish it as MQTT messages.

## Installation

`$ npm i legoino-mqtt-bridge`

## Usage from CLI

You can clone the project and want to run it from the command line. The `index.js` script accepts one command line argument: the broker address. The broker address is optional, default is `mqtt://localhost:1883`.

Run normally:
```bash
npm start <brokerAddress>
```

Run in debug mode:
```bash
npm run start-dev <brokerAddress>
```

## Usage from Node

```js
import serialMqttBridge from 'legoino-mqtt-bridge';

serialMqttBridge('localhost:1883');
```

## MQTT topics standard

We define an MQTT topics standard: each topic sent to the bridge is composed of the device type, followed by a "q" (query) or "a" (answer), followed by the device unique id and finally the command asked for. The packages that will be sent from node-red to the bridge won't have any content. Reading MQTT doc confirmed that it is indeed optional for publish messages.

### Send a command to a serial device

The query topics format:
```bash
bioreactor/q/<id>/<cmd>
```

### Query for all connected serial devices

Use the following topic to get a list of all existing serial devices:
```bash
bioreactor/q/list
```

### Answer topics

To listen to all the answers of the bridge, subscribe to this topic:
```
bioreactor/a/#
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
