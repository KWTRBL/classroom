import React from 'react';
import Nav from '../Navbar/NavIn'
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageFac.css';

function MannageFacc(){
    return (
    <div>
        <Nav/>
        <h2 class="state">จัดผู้คุมสอบ</h2>
        <div id="detail">
            <div className="datee">
                <Form className="testdate">
                    <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                        <Form.Control as="select" size="sm">
                            <option value="0">วันที่/เวลา</option>
                            <option value="1">01-May-2560/ 9.30-12.30</option>
                            <option value="2">01-May-2560/ 13.30-16.30</option>
                            <option value="3">02-May-2560/ 9.30-12.30</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
                <div id="buttonedit">
                    <Button variant="secondary" className="editbtn">แก้ไข</Button>
                    <Button variant="secondary" className="editbtn">จัดผู้คุมสอบ</Button>
                </div>
            </div>
            
            <table className="Mantable">
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
                    <tr>
                        <td>xxxxx</td>
                        <td>วิชา A (3D)</td>
                        <td>401</td>
                        <td>20</td>
                        <td>A</td>
                        <td>อาจารย์ AA</td>
                    </tr><tr>
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
