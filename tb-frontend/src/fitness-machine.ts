export async function requestControl(
  fitnessMachineService: BluetoothRemoteGATTService
) {

}

export async function setPower(
  fitnessMachineService: BluetoothRemoteGATTService,
  power: number
) {
  const controlPoint = await getControlPointCharacteristic(
    fitnessMachineService,
    "00002ad9-0000-1000-8000-00805f9b34fb"
  );

  console.log("Got control point characteristic");
  // await controlPoint.writeValue(Uint8Array.of(0x05, power, power >> 8 & 0xFF));
  // console.log("Wrote: " + power);
}

export async function subscribeToPowerUpdates(
  cyclingPowerService: BluetoothRemoteGATTService,
  subscriptionFunction: (description: string) => any
) {
  const cyclingPowerStatus = await getCyclingPowerMeasurementCharacteristic(
    cyclingPowerService
  );
  cyclingPowerStatus.startNotifications()
  cyclingPowerStatus.oncharacteristicvaluechanged = event => {
    const { value } = event.target as BluetoothRemoteGATTCharacteristic;
    if (!value) {
      return;
    }
    const flagsString = dec2bin(value.getUint16(0));
    const instantPower = value.getInt16(2, true);
    subscriptionFunction(instantPower + "");
  };
}

function dec2bin(dec: any) {
  return (dec >>> 0).toString(2);
}

function getControlPointCharacteristic(
  fitnessMachineService: BluetoothRemoteGATTService,
  characteristicId: string
) {
  return fitnessMachineService.getCharacteristic(
    characteristicId
  );
}

function getCyclingPowerMeasurementCharacteristic(
  fitnessMachineService: BluetoothRemoteGATTService
) {
  return fitnessMachineService.getCharacteristic("00002a63-0000-1000-8000-00805f9b34fb");
}

const opCodeToDefinition: {
  [key: number]: [string] | [string, (data: DataView) => string];
} = {
  0x00: ["Reserved for Future Use"],
  0x01: ["Reset"],
  0x02: ["Fitness Machine Stopped or Paused by the User"],
  0x03: ["Fitness Machine Stopped by Safety Key"],
  0x04: ["Fitness Machine Started or Resumed by the User"],
  0x05: ["Target Speed Changed"],
  0x06: ["Target Incline Changed"],
  0x07: ["Target Resistance Level Changed"],
  0x08: ["Target Power Changed", data => `${data.getInt16(1)}`],
  0x09: ["Target Heart Rate Changed"],
  0x0a: ["Targeted Expended Energy Changed"],
  0x0b: ["Targeted Number of Steps Changed"],
  0x0c: ["Targeted Number of Strides Changed"],
  0x0d: ["Targeted Distance Changed"],
  0x0e: ["Targeted Training Time Changed"],
  0x0f: ["Targeted Timein Two Heart Rate Zones Changed"],
  0x10: ["Targeted Timein Three Heart Rate Zones Changed"],
  0x11: ["Targeted Timein Five Heart Rate Zones Changed"],
  0x12: ["Indoor Bike Simulation Parameters Changed"],
  0x13: ["Wheel Circumference Changed"],
  0x14: ["Spin Down StatusSpin Down Status Value, see Table 4.27"],
  0x15: ["Targeted Cadence Changed"],
  0xff: ["Control Permission Lost"]
};
