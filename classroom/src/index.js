import React from 'react';
import ReactDOM from 'react-dom';
//import App from './App';
import Login from './Login/Login';
import SelectCrEx from './SelectCrEx/SelectCrEX';
//import NavCr from './Navbar/NavCr';
//import NavEx from './Navbar/NavEx';
//import NavIn from './Navbar/NavIn';
import statusCr from './Classroom/statusCr'
import E12Cr from './Classroom/E12Cr'
import MECr from './Classroom/MECr'
import HMCr from './Classroom/HMCr'
import statusEx from './Examroom/statusEx'
import E12Ex from './Examroom/E12Ex'
import MEEx from './Examroom/MEEx'
import HMEx from './Examroom/HMEx'
import ListFac from './Invigilator/ListFac'
import ManageFac from './Invigilator/ManageFac'
import * as serviceWorker from './serviceWorker';
import {BrowserRouter,Route} from 'react-router-dom';
import './index.css';


const AppWithRouter = () => (
  <BrowserRouter>
    <Route exact path="/" component={Login} />
    <Route exact path="/SelectCrEx" component={SelectCrEx} />
    <Route exact path="/statusCr" component={statusCr} />
    <Route exact path="/E12Cr" component={E12Cr} />
    <Route exact path="/MECr" component={MECr} />
    <Route exact path="/HMCr" component={HMCr} />
    <Route exact path="/statusEx" component={statusEx} />
    <Route exact path="/E12Ex" component={E12Ex} />
    <Route exact path="/MEEx" component={MEEx} />
    <Route exact path="/HMEx" component={HMEx} />
    <Route exact path="/ListFac" component={ListFac} />
    <Route exact path="/ManageFac" component={ManageFac} />
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
