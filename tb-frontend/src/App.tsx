import React, { Component } from "react";
import "./App.css";
import PowerDisplay from "./Power/Display";
import PowerControl from "./Power/Control";
import { getService } from "./bluetooth";
import { requestControlOfTrainer, startTrainer } from "./fitness-machine";

type TbState = {
  Trainer?: BluetoothDevice;
  Service?: BluetoothRemoteGATTService;
};

class App extends Component<{}, TbState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      Service: undefined
    };
  }

  componentDidMount = () => {
    //this.scanForTrainers()
  };

  scanForTrainers = async () => {
    let bluetoothServer = {} as TbState;
    const fitnessMachine = await getService(
      navigator.bluetooth,
      "fitness_machine"
    );
    await requestControlOfTrainer(fitnessMachine);
    await startTrainer(fitnessMachine);
    bluetoothServer.Service = fitnessMachine;
    this.setState(bluetoothServer);
    console.log(
      "Connected " +
        fitnessMachine.device.id +
        ": " +
        fitnessMachine.device.name
    );
  };

  render = () => {
    return (
      <div className="App">
        <button onClick={this.scanForTrainers}>Scan for trainers</button>
        <PowerDisplay Service={this.state.Service}></PowerDisplay>
        <PowerControl Service={this.state.Service}></PowerControl>
      </div>
    );
  };
}

export default App;
