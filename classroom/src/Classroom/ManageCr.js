import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import Foot from '../Navbar/FooterCr'
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import './ManageCr.css'

function ManageCr() {
  return (
    <div >
        <Nav/>
        <h1 class="state">จัดห้องเรียน</h1>
        <div id="detail">
            <div className="filter">
                <h5 className="departManfil">ภาควิชา</h5>
                <Form className="selectdepart">
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
                <h5 className="departManfil2">สาขาวิชา</h5>
                <Form className="selectdepart">
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
                <h5 className="dayfil">วันที่เรียน</h5>
                <Form className="selectday">
                    <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                        <Form.Control as="select" size="sm">
                        <option value="1">จันทร์</option>
                        <option value="2">อังคาร</option>
                        <option value="3">พุธ</option>
                        <option value="4">พฤหัสบดี</option>
                        <option value="5">ศุกร์</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
                <h5 className="periodTimefil">ช่วงเวลาที่เรียน</h5>
                <Form className="selectime">
                    <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                        <Form.Control as="select" size="sm">
                        <option value="1">เช้า</option>
                        <option value="2">บ่าย</option>
                        <option value="3">ค่ำ</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
                <div id="buttonedit">
                    <Button variant="light" className="managebtn">จัดห้อง</Button>
                </div>
            </div>
            
            <table className="Crtable">
                <thead className="titleManTable">
                    <tr>
                        <th>รหัสวิชา</th>
                        <th>ชื่อวิชา</th>
                        <th>กลุ่ม</th>
                        <th>เวลาเรียน</th>
                        <th>อาคารเรียน</th>
                        <th>ห้อง</th>
                        <th>จำนวนที่นั่ง</th>
                        <th>จำนวนนศ.</th>
                        <th>แก้ไขข้อมูล</th>
                    </tr>
                </thead>
                <tbody className="dataManTable">
                    <tr>
                        <td >01006004</td>
                        <td >INDUSTRIAL TRAINING</td>
                        <td>1</td>
                        <td>9.00-12.00</td>
                        <td>อาคารเฉลิมพระเกียรติ 7 ชั้น (HM)</td>
                        <td>401</td>
                        <td>100</td>
                        <td>40</td>
                        <td>
                            <Button variant="light" className="editdata"> 
                                    <img src={editbt} className="editicon" alt="edit" /> แก้ไข
                                </Button>
                            <Button variant="light" className="deletedata">
                                    <img src={deletebt} className="deleteicon" alt="delete" /> ลบ
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

export default ManageCr;
