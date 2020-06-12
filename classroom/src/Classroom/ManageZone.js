import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import Foot from '../Navbar/FooterCr'
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import addbt from './icon/plus.png';
import './ManageZone.css'

function ManageZone() {
  return (
    <div >
        <Nav/>
        <h1 class="state">แบ่ง Zone ห้องเรียนแต่ละภาควิชา</h1>
        <div id="detail">
            <table className="Crtable">
                <thead>
                    <tr className="ManZoneTable">
                        <th>ภาควิชา</th>
                        <th>สาขาวิชา</th>
                        <th>อาคารเรียน</th>
                        <th>ชั้น</th>
                        <th>แก้ไขข้อมูล</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <Form className="selctdapertzone">
                                <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                                    <Form.Control as="select" size="sm">
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
                        </td>
                        <td>
                            <Form className="selctdapertzone">
                                <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                                    <Form.Control as="select" size="sm">
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
                        </td>
                        <td>
                            <Form className="selctdapertzone">
                                <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                                    <Form.Control as="select" size="sm">
                                    <option value="1">อาคาร 12 ชั้น</option>
                                    <option value="2">ตึกเครื่องกล</option>
                                    <option value="3">อาคารเฉลิมพระเกียรติ 7 ชั้น</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </td>
                        <td>
                            <Form className="selctdapertzone">
                                <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                                    <Form.Control as="select" size="sm">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </td>
                        <td>
                            <Button variant="light" className="editdata"> 
                                <img src={editbt} className="editicon" alt="edit" /> แก้ไข
                            </Button>
                            <Button variant="light" className="deletedata">
                                <img src={deletebt} className="deleteicon" alt="delete" /> ลบ
                            </Button>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <Button variant="light" className="adddata">
                                <img src={addbt} className="addicon" alt="add" /> เพิ่ม
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Foot/>
        </div>
    </div>
  );
}

export default ManageZone;
