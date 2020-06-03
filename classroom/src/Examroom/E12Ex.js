import React from 'react';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavEx'
import Button from 'react-bootstrap/Button';
import './E12Ex.css';

function E12Ex() {
  return (
    <div >
        <Nav/>
        <h1 class="state">จัดห้องสอบอาคาร 12 ชั้น</h1>
        <div id="detailEx">
            <div className="dateEx">
                <Form className="testdateEx">
                    <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                        <Form.Control as="select" size="sm">
                            <option value="0">วันที่/เวลา</option>
                            <option value="1">01-May-2560/ 9.30-12.30</option>
                            <option value="2">01-May-2560/ 13.30-16.30</option>
                            <option value="3">02-May-2560/ 9.30-12.30</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
                <div id="buttoneditEx">
                    <Button variant="secondary" className="editbtn">แก้ไข</Button>
                    <Button variant="secondary" className="editbtn">จัดห้อง</Button>
                </div>
            </div>
            
            <table className="Extable">
                <thead>
                    <tr>
                        <th>ห้อง</th>
                        <th>ขนาด</th>
                        <th>จำนวน</th>
                        <th>รหัสวิชา</th>
                        <th>วิชาที่สอบ</th>
                        <th>จำนวนนศ.</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td rowspan="2">401</td>
                        <td rowspan="2">10*4</td>
                        <td>20</td>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td>20</td>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td rowspan="2">401</td>
                        <td rowspan="2">10*4</td>
                        <td>20</td>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td>20</td>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td rowspan="2">401</td>
                        <td rowspan="2">10*4</td>
                        <td>20</td>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td>20</td>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td rowspan="2">401</td>
                        <td rowspan="2">10*4</td>
                        <td>20</td>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td>20</td>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td rowspan="2">401</td>
                        <td rowspan="2">10*4</td>
                        <td>20</td>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td>20</td>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>20</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  );
}

export default E12Ex;
