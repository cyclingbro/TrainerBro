import React, { Component } from "react";
import "./App.css";
import PowerDisplay from "./Power/Display";
import PowerControl from "./Power/Control";
import { getServices, getServer} from "./bluetooth";

type TbState = {
  PowerRead?: BluetoothRemoteGATTService;
  PowerSet?: BluetoothRemoteGATTService;
};

class App extends Component<{}, TbState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      PowerRead: undefined,
      PowerSet: undefined
    };
  }

  componentDidMount = () => {
    //this.scanForTrainers()
  };

  scanForTrainers = async () => {
    let bluetoothServer = {} as TbState;
    const btServer = await getServer(
      navigator.bluetooth
    );

    [ bluetoothServer.PowerRead, bluetoothServer.PowerSet ]= await getServices(btServer)
    this.setState(bluetoothServer);
    console.log(
      "Connected " +
        btServer.device.id + 
        ": " +
        btServer.device.name
    );
  };

  render = () => {
    return (
      <div className="App">
        <button onClick={this.scanForTrainers}>Scan for trainers</button>
        <PowerDisplay Service={this.state.PowerRead}></PowerDisplay>
        <PowerControl Service={this.state.PowerSet}></PowerControl>
      </div>
    );
  };
}

export default App;
