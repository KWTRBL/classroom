import React from 'react';
import ReactDOM from 'react-dom';
//import App from './App';
import Login from './Login/Login';
//import NavCr from './Navbar/NavCr';
//import NavEx from './Navbar/NavEx';
//import NavIn from './Navbar/NavIn';
import BuildingData from './Classroom/BuildingData'
import ClassroomData from './Classroom/ClassroomData'
import DownloadData from './Classroom/DownloadData'
import ManageGroup from './Classroom/ManageGroup'
import SpecialCr from './Classroom/SpecialCr'
import ManageZone from './Classroom/ManageZone'
import ManageCr from './Classroom/ManageCr'
import * as serviceWorker from './serviceWorker';
import {BrowserRouter,Route} from 'react-router-dom';
import './index.css';


const AppWithRouter = () => (
  <BrowserRouter>
    <Route exact path="/" component={Login} />
    <Route exact path="/BuildingData" component={BuildingData} />
    <Route exact path="/ClassroomData" component={ClassroomData} />
    <Route exact path="/DownloadData" component={DownloadData} />
    <Route exact path="/ManageGroup" component={ManageGroup} />
    <Route exact path="/SpecialCr" component={SpecialCr} />
    <Route exact path="/ManageZone" component={ManageZone} />
    <Route exact path="/ManageCr" component={ManageCr} />
  </BrowserRouter>
)
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
