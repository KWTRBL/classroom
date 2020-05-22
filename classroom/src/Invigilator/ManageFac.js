import React from 'react';
import ReactDOM from 'react-dom';
import Panda from './pic/Panda.png';
import Button from 'react-bootstrap/Button';
import Search from './pic/search.png';
import contact from './pic/contact (1).png';
import manageinvi from './pic/content.png';
import download from './pic/download.png'
import logout from './pic/logout.png'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageFac.css';

function MannageFacc(){
    return (
    <div id="All">
        <div id="mode">
            <h1 id="Webname">Classroom <br></br>Management</h1>
            <img src={Panda} id="ProfilePic"/>
            <div>
                <ul class="menu">
                    <li><a href=""><img src={contact} class="icon"/>รายชื่ออาจารย์</a></li>
                    <li><a href=""><img src={manageinvi} class="icon"/>จัดอาจารย์คุมสอบ</a></li>
                    <li><a href=""><img src={download} class="icon"/>Download เอกสาร</a></li>
                </ul>
            </div>
            <Button variant="light" className="logoutbtn"><img src={logout} class="logoutpic"/>Logout</Button>
        </div>
        <div id="detail">
            <div id="header">
                <h1 id="title">จัดผู้คุมสอบ</h1>
                <div id="search">
                    <InputGroup size="sm" className="mb-3">
                        <FormControl placeholder="Search" aria-label="Small" aria-describedby="basic-addon2"/>
                        <InputGroup.Append>
                            <Button variant="outline-secondary" className="searchbtn"><img src={Search} className="SearchPic"/></Button>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
            </div>
            
            <div class="depart">
                <Form className="departname">
                    <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                        <Form.Control as="select" size="sm">
                            <option value="0">วันที่/เวลา</option>
                            <option value="1">01-May-2560/ 9.30-12.30</option>
                            <option value="2">01-May-2560/ 13.30-16.30</option>
                            <option value="3">02-May-2560/ 9.30-12.30</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
                <Button variant="secondary" className="editbtn">จัดผู้คุมสอบ</Button>
                <Button variant="secondary" className="editbtn">แก้ไข</Button>
            </div>
            
            <table bordered>
                <thead>
                    <tr>
                        <th>รหัสวิชา</th>
                        <th>ชื่อวิชา</th>
                        <th>ห้องสอบ</th>
                        <th>จำนวนนศ.</th>
                        <th>สาขา</th>
                        <th>อาจารย์ผู้คุมสอบ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>401</td>
                        <td>20</td>
                        <td>A</td>
                        <td>อาจารย์ AAAAA BBBBBBB</td>
                    </tr>
                    <tr>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>401</td>
                        <td>20</td>
                        <td>A</td>
                        <td>อาจารย์ AA</td>
                    </tr>
                    <tr>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>401</td>
                        <td>20</td>
                        <td>A</td>
                        <td>อาจารย์ AA</td>
                    </tr>
                    <tr>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>401</td>
                        <td>20</td>
                        <td>A</td>
                        <td>อาจารย์ AA</td>
                    </tr>
                    <tr>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>401</td>
                        <td>20</td>
                        <td>A</td>
                        <td>อาจารย์ AA</td>
                    </tr>
                    <tr>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>401</td>
                        <td>20</td>
                        <td>A</td>
                        <td>อาจารย์ AA</td>
                    </tr>
                    <tr>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>401</td>
                        <td>20</td>
                        <td>A</td>
                        <td>อาจารย์ AA</td>
                    </tr>
                    <tr>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>401</td>
                        <td>20</td>
                        <td>A</td>
                        <td>อาจารย์ AA</td>
                    </tr>
                    <tr>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>401</td>
                        <td>20</td>
                        <td>A</td>
                        <td>อาจารย์ AA</td>
                    </tr>
                    <tr>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>401</td>
                        <td>20</td>
                        <td>A</td>
                        <td>อาจารย์ AA</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    );
  }

export default MannageFacc;
