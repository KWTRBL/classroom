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
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route } from 'react-router-dom';
import './index.css';


const AppWithRouter = () => (
  <BrowserRouter basename="/cims">
    <Route exact path="/" component={Login} />
    <Route exact path="/BuildingData" component={RequireAuth(BuildingData)} />
    <Route exact path="/ClassroomData" component={RequireAuth(ClassroomData)} />
    <Route exact path="/AvailableRoom" component={RequireAuth(AvailableRoom)} />
    <Route exact path="/DownloadData" component={RequireAuth(DownloadData)} />
    <Route exact path="/ManageGroup" component={RequireAuth(ManageGroup)} />
    <Route exact path="/SpecialCr" component={RequireAuth(SpecialCr)} />
    <Route exact path="/ManageZone" component={RequireAuth(ManageZone)} />
    <Route exact path="/ManageCr" component={RequireAuth(ManageCr)} />
  </BrowserRouter>
)





const RequireAuth = (Component) => {

  return class App extends Component {
    constructor(props) {
      super(props)
      this.state = {
        login: null
      };
      this.componentWillMount = this.componentWillMount.bind(this);

    }


    async componentWillMount() {
      let result = await axios.get('http://localhost:7777/auth', { withCredentials: true });
      const isLogin = result.data.login
      this.setState({
        login: isLogin
      })

    }
    render() {
      if (this.state.login == null) {
        return <div></div>
      }
      else if (this.state.login == 1) {
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
