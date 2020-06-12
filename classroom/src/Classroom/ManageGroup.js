import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import Foot from '../Navbar/FooterCr'
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import addbt from './icon/plus.png';
import './ManageGroup.css';

function ManageGroup() {
  return (
    <div >
        <Nav/>
        <h1 class="state">จัดจำนวนนักศึกษาแต่ละกลุ่ม</h1>
        <div id="detail">
            <h4 className="groupfil1">หลักสูตร</h4>
            <div className="groupfildetail1">
                <Form className="testdate">
                    <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                        <Form.Control as="select" size="sm">
                            <option value="0">เครื่องกล</option>
                            <option value="1">คอมพิวเตอร์</option>
                            <option value="2">อาหาร</option>
                            <option value="3">ดนตรี</option>
                            <option value="4">อุตสาหการ</option>
                            <option value="5">ไฟฟ้า</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </div>
            
            <table className="Crtable">
                <thead>
                    <tr>
                        <th>รหัสวิชา</th>
                        <th>ชื่อวิชา</th>
                        <th>กลุ่ม</th>
                        <th>เวลาเรียน</th>
                        <th>จำนวนนศ.</th>
                        <th>แก้ไขข้อมูล</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td >xxxxx</td>
                        <td >วิชา A</td>
                        <td>1</td>
                        <td>9.00-12.00</td>
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
                    <tr>
                        <td >xxxxx</td>
                        <td >วิชา A</td>
                        <td>1</td>
                        <td>9.00-12.00</td>
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
                    <tr>
                        <td >xxxxx</td>
                        <td >วิชา A</td>
                        <td>1</td>
                        <td>9.00-12.00</td>
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
                    <tr>
                      <td></td>
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

export default ManageGroup;
