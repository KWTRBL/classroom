import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'

function DownloadFile() {
  return (
    <div >
        <Nav/>
        <h1 class="state">จัดพิมพ์เอกสาร</h1>
        <div id="detail">
            <div className="date">
                <Form className="testdate">
                    <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                        <Form.Control as="select" size="sm">
                            <option value="0">วันที่/เวลา</option>
                            <option value="1">จันทร์/ 9.00-12.00</option>
                            <option value="2">จันทร์/ 13.00-16.00</option>
                            <option value="3">อังคาร/ 9.00-12.00</option>
                            <option value="4">อังคาร/ 13.00-16.00</option>
                            <option value="5">พุธ/ 9.00-12.00</option>
                            <option value="6">พุธ/ 13.00-16.00</option>
                            <option value="7">พฤหัสบดี/ 9.00-12.00</option>
                            <option value="8">พฤหัสบดี/ 13.00-16.00</option>
                            <option value="9">ศุกร์/ 9.00-12.00</option>
                            <option value="10">ศุกร์/ 13.00-16.00</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
                <div id="buttonedit">
                    <Button variant="secondary" className="editbtn">แก้ไข</Button>
                    <Button variant="secondary" className="editbtn">จัดห้อง</Button>
                </div>
            </div>
            
            <table className="Crtable">
                <thead>
                    <tr>
                        <th>ห้อง</th>
                        <th>จำนวนที่นั่ง</th>
                        <th>รหัสวิชา</th>
                        <th>วิชาที่เรียน</th>
                        <th>อาจารย์ผู้สอน</th>
                        <th>จำนวนนศ.</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td >401</td>
                        <td >100</td>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>อาจารย์ AA</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td >401</td>
                        <td >100</td>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>อาจารย์ AA</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td >401</td>
                        <td >100</td>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>อาจารย์ AA</td>
                        <td>20</td>
                    </tr>
                    <tr>
                      <td >401</td>
                        <td >100</td>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>อาจารย์ AA</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td >401</td>
                        <td >100</td>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>อาจารย์ AA</td>
                        <td>20</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  );
}

export default DownloadFile;
