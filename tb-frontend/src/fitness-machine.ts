export async function requestControlOfTrainer(
  fitnessMachineService: BluetoothRemoteGATTService
) {
  const controlPoint = await getControlPointCharacteristic(
    fitnessMachineService
  );
  controlPoint.writeValue(Uint8Array.of(0x00));
}

export async function setPower(
  fitnessMachineService: BluetoothRemoteGATTService,
  power: number
) {
  const controlPoint = await getControlPointCharacteristic(
    fitnessMachineService
  );

  controlPoint.writeValue(Uint8Array.of(0x05, power, power >> 8));
}

export async function subscribeToPowerUpdates(
  fitnessMachineService: BluetoothRemoteGATTService,
  subscriptionFunction: (description: string) => any
) {
  const controlPoint = await getControlPointCharacteristic(
    fitnessMachineService
  );
  controlPoint.startNotifications();
  controlPoint.oncharacteristicvaluechanged = event => {
    const { value } = event.target as BluetoothRemoteGATTCharacteristic;
    if (!value) {
      return;
    }
    const opCode = value.getUint8(0);
    const [opCodeDescription, opDisplayValueFunction] = opCodeToDefinition[
      opCode
    ];
    const opCodeDisplayValue = opDisplayValueFunction
      ? opDisplayValueFunction(value)
      : "";
    subscriptionFunction(`${opCodeDescription[0]}: ${opCodeDisplayValue}`);
  };
}

function getControlPointCharacteristic(
  fitnessMachineService: BluetoothRemoteGATTService
) {
  return fitnessMachineService.getCharacteristic(
    "fitness_machine_control_point"
  );
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
