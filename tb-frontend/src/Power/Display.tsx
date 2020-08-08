import React, { Component } from "react";
import { subscribeToPowerUpdates } from "../fitness-machine";
type PowerDisplayProps = {
  Service?: BluetoothRemoteGATTService;
};

type PowerDisplayState = {
  Update: string;
};

class PowerDisplay extends Component<PowerDisplayProps, PowerDisplayState> {
  constructor(props: Readonly<PowerDisplayProps>) {
    super(props);
    this.state = {
      Update: "No updates as of yet"
    };
  }

  componentWillReceiveProps = (props: PowerDisplayProps) => {
    if (props.Service) {
      subscribeToPowerUpdates(props.Service, description =>
        this.setState({ Update: description })
      );
    }
  };

  render = () => {
    return (
      <span>
        <div>{this.state.Update}</div>
      </span>
    );
  };
}

export default PowerDisplay;
