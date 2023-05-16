async function getServer(
  bluetoothService: Bluetooth
): Promise<BluetoothRemoteGATTServer> {
  const device = await bluetoothService.requestDevice({
    filters: [
      {
        services: ["fitness_machine"] // we need one for cycling power as well. don't know the exact string.
      }
    ],
    optionalServices: [
      '0000180a-0000-1000-8000-00805f9b34fb', //Device Information
      '00001816-0000-1000-8000-00805f9b34fb', // Cycling Speed & Cadence
      '00001818-0000-1000-8000-00805f9b34fb', // Cycling Power
      '00001826-0000-1000-8000-00805f9b34fb', // Fitness Machine
    ]
  });

  if (device.gatt === undefined) {
    throw new Error("Unable to find bluetooth device");
  }

  return device.gatt.connect();
}

async function getServices(
  server: BluetoothRemoteGATTServer
): Promise<BluetoothRemoteGATTService[]> {
  return Promise.all([
    server.getPrimaryService("00001818-0000-1000-8000-00805f9b34fb"),
    server.getPrimaryService("00001826-0000-1000-8000-00805f9b34fb")
  ]);
}

export { getServer, getServices };
