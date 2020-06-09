import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import addbt from './icon/plus.png';
import './ClassroomData.css';

function ClassroomData() {
  return (
    <div >
        <Nav/>
        <h1 class="state">ข้อมูลห้องเรียน</h1>
        <div id="detail">
            <h4 className="buildfil1">อาคารเรียน</h4>
            <h4 className="buildfil2">ชั้น</h4>
            <div className="buildfildetail1">
                <Form className="testdate">
                    <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                        <Form.Control as="select" size="sm">
                            <option value="0">อาคาร12ชั้น</option>
                            <option value="1">ตึกเครื่องกล</option>
                            <option value="2">อาคารเฉลิมพระเกียรติ7ชั้น</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </div>
            <div className="buildfildetail2">
                <Form className="testdate">
                    <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                        <Form.Control as="select" size="sm">
                            <option value="0">อาคาร12ชั้น</option>
                            <option value="1">ตึกเครื่องกล</option>
                            <option value="2">อาคารเฉลิมพระเกียรติ7ชั้น</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </div>
            
            <table className="Crtable">
                <thead>
                    <tr>
                        <th>รหัสอาคาร</th>
                        <th>อาคารเรียน</th>
                        <th>รหัสห้อง</th>
                        <th>จำนวนที่นั่ง</th>
                        <th>สถานะ</th>
                        <th>แก้ไขข้อมูล</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td >E12</td>
                        <td >อาคาร 12 ชั้น</td>
                        <td>E12-401</td>
                        <td>100</td>
                        <td>
                            <Form className="statusroom">
                                <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                                    <Form.Control as="select" size="sm">
                                        <option value="0">ใช้ได้</option>
                                        <option value="1">ใช้ไม่ได้</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </td>
                        <td>
                            <Button variant="secondary" className="editdata"> 
                                <img src={editbt} className="editicon" alt="edit" /> แก้ไข
                            </Button>
                            <Button variant="secondary" className="deletedata">
                                <img src={deletebt} className="deleteicon" alt="delete" /> ลบ
                            </Button>
                        </td>
                    </tr>
                    <tr>
                        <td >E12</td>
                        <td >อาคาร 12 ชั้น</td>
                        <td>E12-402</td>
                        <td>100</td>
                        <td>
                            <Form className="statusroom">
                                <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                                    <Form.Control as="select" size="sm">
                                        <option value="0">ใช้ได้</option>
                                        <option value="1">ใช้ไม่ได้</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </td>
                        <td>
                            <Button variant="secondary" className="editdata"> 
                                <img src={editbt} className="editicon" alt="edit" /> แก้ไข
                            </Button>
                            <Button variant="secondary" className="deletedata">
                                <img src={deletebt} className="deleteicon" alt="delete" /> ลบ
                            </Button>
                        </td>
                    </tr>
                    <tr>
                        <td >E12</td>
                        <td >อาคาร 12 ชั้น</td>
                        <td>E12-403</td>
                        <td>100</td>
                        <td>
                            <Form className="statusroom">
                                <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                                    <Form.Control as="select" size="sm">
                                        <option value="0">ใช้ได้</option>
                                        <option value="1">ใช้ไม่ได้</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </td>
                        <td>
                            <Button variant="secondary" className="editdata"> 
                                <img src={editbt} className="editicon" alt="edit" /> แก้ไข
                            </Button>
                            <Button variant="secondary" className="deletedata">
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
                            <Button variant="secondary" className="adddata">
                                <img src={addbt} className="addicon" alt="add" /> เพิ่ม
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  );
}

export default ClassroomData;
