import React from 'react';
import Nav from '../Navbar/NavIn'
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListFac.css';

function Listt(){
    return (
    <div>
        <Nav/>
        <h2 class="state">รายชื่อผู้คุมสอบ</h2>
        <h4 id="departlabel">ภาควิชา
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
        </h4>

        <table bordered className="listteaname">
            <thead>
                <tr>
                    <th>รายชื่ออาจารย์</th>
                    <th>การคุมสอบ</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="inviName">อาจารย์ AAA xxxxxxx</td>
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
    );
  }

export default Listt;
