import React from 'react';
import logout from './logout.png';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Search from './search.png';
import imageCr from './ImageCr.png'
import build from './hotel.png'
import datapic from './docs.png'
import grouppic from './book.png'
import managepic from './content.png'
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
            <Link class="link" to="/BuildingData"><img src={build} className="iconlink" alt="Buildpic"/> ข้อมูลอาคารเรียน</Link >
            <br></br>
            <Link class="link" to="/ClassroomData"><img src={build} className="iconlink" alt="Buildpic"/> ข้อมูลห้องเรียน</Link >
            <br></br>
            <Link class="link" to="/DownloadData"><img src={datapic} className="iconlink" alt="Datapic"/> โหลดข้อมูลตารางสอน</Link >
            <br></br>
            <Link class="link" to="/ManageGroup"><img src={grouppic} className="iconlink" alt="Grouppic"/> จัดจำนวนนักศึกษาแต่ละกลุ่ม</Link >
            <br></br>
            <Link class="link" to="/SpecialCr"><img src={managepic} className="iconlink" alt="SpecialCrpic"/> กำหนดห้องเรียนกรณีพิเศษ</Link >
            <br></br>
            <Link class="link" to="/ManageCr"><img src={managepic} className="iconlink" alt="ManageCrpic"/> จัดห้องเรียน</Link >
            <br></br>
            <Link class="link" to="/DownloadFile"><img src={download} className="iconlink" alt="Downloadpic"/> จัดพิมพ์เอกสาร</Link >
          </div>
          <Button variant="light" className="logout">
            <img src={logout} className="logouticon" alt="logout" /> Logout
          </Button>
      </div>
      <div className="search">
        <InputGroup size="sm" className="mb-3">
            <FormControl placeholder="Search" aria-label="Small" aria-describedby="basic-addon2"/>
            <InputGroup.Append>
                <Button variant="outline-secondary" className="searchbtn"><img src={Search} className="SearchPic" alt="Searchpic"/></Button>
            </InputGroup.Append>
        </InputGroup>
      </div>
      <img src={imageCr} className="profilePic" alt="profilepic"/>
    </div>
  );
}

export default Navbar;
