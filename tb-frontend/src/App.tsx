import React, { Component } from 'react';
import './App.css';

type TbState = {
  Trainer?: BluetoothDevice,
  Power: number
}

class App extends Component<{}, TbState> {

  constructor(props: Readonly<{}>) {
    super(props)
    this.state = {
      Trainer: undefined,
      Power: 0
    }
  }

  scanForTrainers = () => {
    navigator.bluetooth.requestDevice({ filters: [{
      services: ['cycling_power']
    }] }).then(
      device => {
        this.setState({
          Trainer: device
        })

        console.log("Connected " + device.id + ": " + device.name)
      }
    )
  }

  logWatts = async () => {
    const trainer = this.state.Trainer!
    try {
      const server = await trainer.gatt!.connect()
      const powerSvc = await server.getPrimaryService('cycling_power')
      const intervalId = setInterval(() => {
        powerSvc.getCharacteristic('cycling_power_measurement').then(
          measurement => {
              console.log(measurement)
          }
        )
      }, 1000)
      
    }
    catch(exception) {
      console.log(exception)
    }
  }

  render() {
    return (
    <div className="App">
      <button onClick={this.scanForTrainers}>Scan for trainers</button>
      <button onClick={this.logWatts}>Log Watts</button>
    </div>
    )
  }
}

export default App;
