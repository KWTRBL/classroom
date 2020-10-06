import React from 'react';
import logout from './logout.png';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Search from './search.png';
import imageCr from './Image 4.png'
import build from './hotel.png'
import datapic from './docs.png'
import grouppic from './book.png'
import managepic from './content.png'
import download from './download.png'
import kmitlEng from './logokmitl.png'
import kmitlIcon from './headbg.jpg'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Component } from 'react';
import axios from 'axios';

export default class ClassroomData extends Component {
  constructor(props) {
    super(props);

  }
  logout = () => {
    axios.get('http://localhost:7777/logout', { withCredentials: true })
    //this.props.history.push('/')
    //window.location.reload(false);
    window.location.replace("/");


  }



  render() {
    return (
      <div>
        <div className="dummy"></div>
        <Navbar collapseOnSelect fixed="top" className="edNavbar" expand="lg" variant="light">
          <Navbar.Brand><img src={kmitlEng} className="Logokmitl" alt="logokmitl" /></Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown title="ข้อมูลในคณะ" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/BuildingData">ข้อมูลหน่วยงานในคณะ</NavDropdown.Item>
                <NavDropdown.Item href="/ClassroomData">ข้อมูลบุคลากรในคณะ</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="การจัดการคุมสอบ" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/DownloadData">กำหนดข้อมูลต่าง ๆ</NavDropdown.Item>
                <NavDropdown.Item href="/ManageGroup">จัดกรรมการคุมสอบ</NavDropdown.Item>
                <NavDropdown.Item href="/ManageGroup">แลกวันสอบและคุมสอบแทน</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="รายงานการคุมสอบ" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/SpecialCr">รายงานผลการจัดผู้คุมสอบ</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <NavDropdown title="เจ้าหน้าที่วิชาการ" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/User">ข้อมูลผู้ใช้</NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={() => this.logout()}>ออกจากระบบ</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

      </div>
    )
  }
}
