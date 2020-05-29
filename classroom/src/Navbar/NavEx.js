import React from 'react';
import logout from './logout.png';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Search from './search.png';
import imageCr from './ImageCr.png'
import build from './hotel.png'
import download from './download.png'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
function Navbar() {
  return (
    <div>
      <div id="mySidenav" class="sidenav">
          <div class="navtitle">
              <h2 class="navclass">Classroom</h2>
              <h2 class="navmanage">Management</h2>
          </div>
          <div class="detailnav">
            <Link class="link" to="/statusEx"><img src={build} className="iconlink"/> สถานะการใช้ห้อง</Link >
            <br></br>
            <Link class="link" to="/E12Ex"><img src={build} className="iconlink"/> E12</Link >
            <br></br>
            <Link class="link" to="/MEEx"><img src={build} className="iconlink"/> Me</Link >
            <br></br>
            <Link class="link" to="/HMEx"><img src={build} className="iconlink"/> Hm</Link >
            <br></br>
            <Link class="link" to="/DownloadEx"><img src={download} className="iconlink"/> Downloadเอกสาร</Link >
          </div>
          <Button variant="light" className="logout">
            <img src={logout} className="logouticon" alt="logout" /> Logout
          </Button>
      </div>
      <div className="search">
        <InputGroup size="sm" className="mb-3">
            <FormControl placeholder="Search" aria-label="Small" aria-describedby="basic-addon2"/>
            <InputGroup.Append>
                <Button variant="outline-secondary" className="searchbtn"><img src={Search} className="SearchPic"/></Button>
            </InputGroup.Append>
        </InputGroup>
      </div>
      <img src={imageCr} className="profilePic"/>
    </div>
  );
}

export default Navbar;
