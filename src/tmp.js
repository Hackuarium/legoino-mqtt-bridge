const { DeviceManager } = require('serial-requests');

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
          console.log('Connected', connected);
        },
      };
    }
  },
});

async function queryDevice() {
  let result = await deviceManager.addRequest('65535', 'h\n');
  console.log(result);
  for (let i = 0; i < 26; i++) {
    result = await deviceManager.addRequest(
      '65535',
      `${String.fromCharCode(i + 65)}\n`,
    );
    console.log(result);
  }
}

queryDevice();
