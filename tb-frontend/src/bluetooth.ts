async function getService(
  bluetoothService: Bluetooth,
  serviceName: string
): Promise<BluetoothRemoteGATTService> {
  const device = await bluetoothService.requestDevice({
    filters: [
      {
        services: [serviceName]
      }
    ]
  });

  if (device.gatt === undefined) {
    throw new Error("Unable to find bluetooth device");
  }

  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(serviceName);
  return service;
}

export { getService };
