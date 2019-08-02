import React, { Component } from "react";
import { debounce } from "underscore";

type PowerDisplayProps = {
  Service?: BluetoothRemoteGATTService;
};

type PowerDisplayState = {
  Watts: number;
};

class PowerDisplay extends Component<PowerDisplayProps, PowerDisplayState> {
  constructor(props: Readonly<PowerDisplayProps>) {
    super(props);
    this.state = {
      Watts: 0
    };
  }

  parseData = (receivedCharacteristic: DataView | undefined) => {
    console.log("received characteristic");
    console.log(receivedCharacteristic);
    if (receivedCharacteristic) {
      const flags = receivedCharacteristic.getUint16(0);
      const instantaneousPowerMeasure = receivedCharacteristic.getInt16(1);
      this.setState({
        Watts: instantaneousPowerMeasure
      });
    }
  };

  componentWillReceiveProps = (props: PowerDisplayProps) => {
    console.log("no service");
    if (props.Service) {
      const powerSvc = props.Service;
      console.log("has service");
      powerSvc
        .getCharacteristic("cycling_power_measurement")
        .then(powerMeasurement => {
          powerMeasurement.startNotifications();
          powerMeasurement.oncharacteristicvaluechanged = event => {
            const { value } = event.target as BluetoothRemoteGATTCharacteristic;
            this.parseData(value);
          };
        });
    }
  };

  stopNotifications = () => {
    if (this.props.Service) {
      const powerSvc = this.props.Service;
      powerSvc
        .getCharacteristic("cycling_power_measurement")
        .then(powerMeasurement => {
          powerMeasurement.stopNotifications();
        });
    }
  };

  render = () => {
    return (
      <span>
        <div>{this.state.Watts}</div>
        <button onClick={this.stopNotifications}>Stop notifications</button>
      </span>
    );
  };
}

export default PowerDisplay;
