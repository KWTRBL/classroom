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
import './ListFac.css';

function Listt(){
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
                <h1 id="title">รายชื่อผู้คุมสอบ</h1>
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
                <h3 id="departlabel">ภาควิชา
                <Form className="departname">
                <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                    <Form.Control as="select" size="sm">
                        <option value="0">ทั้งหมด</option>
                        <option value="1">วิศวกรรมโทรคมนาคม</option>
                        <option value="2">วิศวกรรมไฟฟ้า</option>
                        <option value="3">วิศวกรรมอิเล็กทรอนิกส์</option>
                        <option value="4">วิศวกรรมระบบควบคุม</option>
                        <option value="5">วิศวกรรมคอมพิวเตอร์</option>
                        <option value="6">วิศวกรรมเครื่องกล</option>
                        <option value="7">วิศวกรรมการวัดคุม</option>
                        <option value="8">วิศวกรรมโยธา</option>
                        <option value="9">วิศวกรรมเกษตร</option>
                        <option value="10">วิศวกรรมเคมี</option>
                        <option value="11">วิศวกรรมอาหาร</option>
                        <option value="12">วิศวกรรมอุตสาหการ</option>
                        <option value="13">วิศวกรรมชีวการแพทย์</option>
                        <option value="14">สำนักงานบริหารหลักสูตรวิศวกรรมสหวิทยาการนานาชาติ</option>
                    </Form.Control>
                </Form.Group>
                </Form>
                </h3>
            </div>
            
            <table bordered>
                <thead>
                    <tr>
                        <th>รายชื่ออาจารย์</th>
                        <th>การคุมสอบ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="inviName">อาจารย์ AAA</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ BBB</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ AAA</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ BBB</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ AAA</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ BBB</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ AAA</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ BBB</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ AAA</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ BBB</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ AAA</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ BBB</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ AAA</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ BBB</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ AAA</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ BBB</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ AAA</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ BBB</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ AAA</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ BBB</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ AAA</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    <tr>
                        <td class="inviName">อาจารย์ BBB</td>
                        <td>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm" className="statuss">
                                <Form.Control as="select" size="sm">
                                    <option value="0">คุมสอบ</option>
                                    <option value="1">ไม่คุมสอบ</option>
                                </Form.Control>
                            </Form.Group>
                        </td>
                    </tr>
                    

                </tbody>
            </table>
        </div>
    </div>
      
    );
  }

export default Listt;
