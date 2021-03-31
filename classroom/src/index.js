import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
//import App from './App';
import Login from './Login/Login';
//import NavCr from './Navbar/NavCr';
//import NavEx from './Navbar/NavEx';
//import NavIn from './Navbar/NavIn';
import axios from 'axios';
import Nav from './Navbar/NavCr'

import BuildingData from './Classroom/BuildingData'
import ClassroomData from './Classroom/ClassroomData'
import AvailableRoom from './Classroom/AvailableRoom'
import DownloadData from './Classroom/DownloadData'
import ManageGroup from './Classroom/ManageGroup'
import SpecialCr from './Classroom/SpecialCr'
import ManageZone from './Classroom/ManageZone'
import ManageCr from './Classroom/ManageCr'
import FacultyData from './Classroom/FacultyData'
import ConditionIn from "./Classroom/ConditionIn"
import ManageIn from "./Classroom/ManageIn"
import ReportIn from "./Classroom/ReportIn"
import ExchangeIn from "./Classroom/ExchangeIn"
import InvigilatorData from "./Classroom/InvigilatorData"
import TeacherteachData from "./Classroom/TeacherteachData"
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route } from 'react-router-dom';
import './index.css';
const jwt = require("jsonwebtoken");


const AppWithRouter = () => (
  <BrowserRouter basename="/cims">
    <Route exact path="/" component={Login} />

    <Route exact path="/BuildingData" component={RequireAuth(BuildingData,1)} />
    <Route exact path="/ClassroomData" component={RequireAuth(ClassroomData,1)} />
    <Route exact path="/AvailableRoom" component={RequireAuth(AvailableRoom,1)} />
    <Route exact path="/DownloadData" component={RequireAuth(DownloadData,1)} />
    <Route exact path="/ManageGroup" component={RequireAuth(ManageGroup,1)} />
    <Route exact path="/SpecialCr" component={RequireAuth(SpecialCr,1)} />
    <Route exact path="/ManageZone" component={RequireAuth(ManageZone,1)} />
    <Route exact path="/ManageCr" component={RequireAuth(ManageCr,1)} />

    <Route exact path="/FacultyData" component={RequireAuth(FacultyData,2)} />
    <Route exact path="/ConditionIn" component={RequireAuth(ConditionIn,2)} />
    <Route exact path="/ManageIn" component={RequireAuth(ManageIn,2)} />
    <Route exact path="/ReportIn" component={RequireAuth(ReportIn,2)} />
    <Route exact path="/ExchangeIn" component={RequireAuth(ExchangeIn,2)} />
    <Route exact path="/InvigilatorData" component={RequireAuth(InvigilatorData,2)} />
    <Route exact path="/TeacherteachData" component={RequireAuth(TeacherteachData,2)} />


  </BrowserRouter>
)





const RequireAuth = (Component,value) => {

  return class App extends Component {
    constructor(props) {
      super(props)
      this.state = {
        login: null, role: null
      };
      this.componentWillMount = this.componentWillMount.bind(this);

    }


    async componentWillMount() {
      let result = await axios.get('http://localhost:7777/auth', { withCredentials: true });
      const isLogin = result.data.login

      // var decoded = jwt.verify(token, 'shhhhh');
      console.log(result.data.role,value)
      this.setState({
        login: isLogin,
        role:result.data.role
      })

    }
    render() {
      var role = this.state.role
      // role = 2
      if (this.state.login == null) {
        return <div></div>
      }
      else if (this.state.login == 1) {
        if(role == 1 && role != value){
          return <Redirect to={{ pathname: '/buildingdata', state: { from: this.props.location } }} />
        }
        if(role == 2 && role != value){
          return <Redirect to={{ pathname: '/facultydata', state: { from: this.props.location } }} />
        }
        if(role == 3){
          return <Component {...this.props} />
        }
        return <Component {...this.props} />

      }
      else if (this.state.login == 0) {
        return <Redirect to={{ pathname: '/', state: { from: this.props.location } }} />
      }

    }
  }

}

ReactDOM.render(
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
