import React, { Component } from "react";
import "./App.css";
import microgear from "microgear";
import Clock from 'react-live-clock';
//import TimeField from 'react-simple-timefield';
import TimeInput from 'react-input-time';
class App extends Component {
  constructor(props) {
    super(props);
    this.gear = microgear.create({
      key: "uBCg2t7fJBwD0nr",
      secret: "F7b6F7IkHT0gfbcnuXUQyAB2N",
      alias: "lfl"
    });
    this.gear.connect("lightforlife");

    this.gear.on("connected", () => {
      console.log("connected . . .");
    });
    this.state = {
      state: "Waiting",
      nextSchedule: "NONE",
      foodLevel: "Normal",
      idState: 0,
      stamp: 0
    };
  }

  sendMicroGear = () => {
    var str = "";
    str += this.state.idState;

    var light_val = this.state.light.toString();
    while (light_val.length !== 3) {
      light_val = "0" + light_val;
    }
    str += light_val;

    var auto_light_val = this.state.autolight.toString();
    while (auto_light_val.length != 3) {
      auto_light_val = "0" + auto_light_val;
    }
    str += auto_light_val;
    this.gear.chat("nodemcu", str);

    console.log(str);
    console.log("Success");
  };

  componentDidMount() {
    document.title = "Feeding System"
    setInterval(() => {
      if (this.state.nextSchedule != "NONE") {
        var h = this.state.nextSchedule[0] + this.state.nextSchedule[1]
        console.log(h)
        var m = this.state.nextSchedule[3] + this.state.nextSchedule[4]
        console.log(m)
        var d = new Date();
        if (h == d.getHours() && m == d.getMinutes()) {
          this.setState({state : "Feeding"})
        } else {
          this.setState({state : "Waiting"})
        }
      }
    },1000)
  }

  render() {
    const check = {};
    return (
      <div className="App float-none" id="main">
        <nav className="navbar navbar-dark bg-primary">
          <a className="navbar-brand" href="#">
            <img
              src="F.png"
              width="30"
              height="30"
              class="d-inline-block align-top"
              alt=""
            />
            &nbsp;Feeding System
          </a>
        </nav>
        <img
          src="./gear.png"
          alt="light"
          width="300"
          height="300"
          class = {this.state.state == "Waiting"? "":"feeding"}
        />
        <div className="time">
        &nbsp;Current Time :  
        <Clock format={' HH:mm:ss'} ticking={true} timezone={'Asia/Bangkok'}/>
        </div>
        <div className="row" id="bottombox">
          <div className="col-6 border border-primary rounded" id="leftbox">
            <br />
            <br />
            <br />
            <h4> State : {this.state.state} </h4>
            <br />
            <h4> Next Schedule : {this.state.nextSchedule} </h4>
            <br />
            <h4> Food Level : {this.state.foodLevel} </h4>
            <br />
          </div>
          <div className="col-6 border border-primary rounded" id="rightbox">
            <br />
            <h4>Set Time</h4>
            <br />
            <div className = "timeenter">
            <TimeInput
            initialTime= '00:00'
            onChange={e => {
              this.setState({ stamp: e.target.value });
              console.log(e.target.value);
            }}
            />
            </div>
            <br />
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                //console.log("AutoDim");
                this.setState({
                  state: "Waiting",
                  nextSchedule: "NONE",
                  foodLevel: "Normal",
                  idState: 0
                });
              }}
            >
              Reset
            </button>
            &nbsp;
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                //console.log("Manual");
                this.setState({ state: "Feeding", idState: 0 });
              }}
            >
              Feed Now
            </button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                console.log("Send");
                //this.sendMicroGear();
                this.setState({ nextSchedule: this.state.stamp});
              }}
            >
              Send
            </button>
            <br />
            <br />
          </div>
        </div>
      </div>
    );
  }
}

export default App;