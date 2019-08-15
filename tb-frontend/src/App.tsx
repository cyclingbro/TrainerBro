import React, { Component } from "react";
import "./App.css";
import PowerDisplay from "./Power/Display";
import PowerControl from "./Power/Control";

type TbState = {
  Trainer?: BluetoothDevice;
  Service?: BluetoothRemoteGATTService;
};

class App extends Component<{}, TbState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      Trainer: undefined,
      Service: undefined
    };
  }

  componentDidMount = () => {
    //this.scanForTrainers()
  };

  scanForTrainers = () => {
    let bluetoothServer = {} as TbState;
    navigator.bluetooth
      .requestDevice({
        filters: [
          {
            services: ["cycling_power"]
          }
        ]
      })
      .then(device => {
        bluetoothServer.Trainer = device;
        device.gatt!.connect().then(server => {
          server.getPrimaryService("cycling_power").then(service => {
            bluetoothServer.Service = service;
            this.setState(bluetoothServer);
            console.log("Connected " + device.id + ": " + device.name);
            console.log(bluetoothServer.Service);
          });
        });
      });
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
