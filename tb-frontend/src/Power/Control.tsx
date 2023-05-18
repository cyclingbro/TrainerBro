import React, { Component } from "react";
import { requestControl, setPower } from "../fitness-machine";

interface PowerControlProps {
  Service?: BluetoothRemoteGATTService;
}

interface RequestedResistanceState {
  Watts: number;
  Controlled: boolean;
}

class PowerControl extends Component<
  PowerControlProps,
  RequestedResistanceState
> {
  constructor(props: Readonly<PowerControlProps>) {
    super(props);
    this.state = {
      Watts: 100,
      Controlled: false
    };
  }

  setResistance = async (wattIncr: number): Promise<void | string> => {
    if (this.props.Service === undefined) {
      console.log(
        "Unable to set trainer to requested wattage. No trainer paired"
      );
      return;
    }

    if (!this.state.Controlled) {
      await requestControl(this.props.Service as BluetoothRemoteGATTService);
      this.setState({ ...this.state, Controlled: true });
    }
    const newWatts = this.state.Watts + wattIncr
    await setPower(this.props.Service, newWatts);
    this.setState({...this.state,  Watts: newWatts });
    return;
  };

  increaseResistance = (): void => {
    this.setResistance(25);
  }

  decreaseResistance = (): void => {
    this.setResistance(-25);
  }

  render = () => {
    return (
      <span>
        <div>{this.state.Watts}</div>
        <button onClick={this.increaseResistance}>Increase Resistance</button>
        <button onClick={this.decreaseResistance}>Decrease Resistance</button>
      </span>
    );
  };
}

export default PowerControl;
