# serial-mqtt-bridge

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Retrieve data from serial devices when queried and publish it as MQTT messages.

## Installation
When it will be published:
`$ npm i serial-mqtt-bridge`

## Usage from CLI
You can clone the project and want to run it from the command line. The `index.js` script accepts one command line argument: the broker address. The broker address is optional, default is `localhost:1883`.

Run normally:
```bash
npm start <brokerAddress>
```

Run in debug mode:
```bash
npm start-dev <brokerAddress>
```

## [API Documentation](https://hackuarium.github.io/serial-mqtt-bridge/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/serial-mqtt-bridge.svg
[npm-url]: https://www.npmjs.com/package/serial-mqtt-bridge
[ci-image]: https://github.com/cheminfo/serial-mqtt-bridge/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/serial-mqtt-bridge/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/serial-mqtt-bridge.svg
[codecov-url]: https://codecov.io/gh/cheminfo/serial-mqtt-bridge
[download-image]: https://img.shields.io/npm/dm/serial-mqtt-bridge.svg
[download-url]: https://www.npmjs.com/package/serial-mqtt-bridge
