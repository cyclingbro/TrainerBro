import React, { Component } from "react";
import { setPower } from "../fitness-machine";

interface PowerControlProps {
  Service?: BluetoothRemoteGATTService;
}

interface RequestedResistanceState {
  Watts: number;
}

class PowerControl extends Component<
  PowerControlProps,
  RequestedResistanceState
> {
  constructor(props: Readonly<PowerControlProps>) {
    super(props);
    this.state = {
      Watts: 100
    };
  }

  setResistance = async (): Promise<void | string> => {
    if (this.props.Service === undefined) {
      console.log(
        "Unable to set trainer to requested wattage. No trainer paired"
      );
      return;
    }

    this.setState({ Watts: this.state.Watts + 25 });
    setPower(this.props.Service, this.state.Watts);
    return;
  };

  render = () => {
    return (
      <span>
        <div>{this.state.Watts}</div>
        <button onClick={this.setResistance}>Increase Resistance</button>
      </span>
    );
  };
}

export default PowerControl;
