import { Component } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavIn'
import Foot from '../Navbar/FooterCr'
import Table from 'react-bootstrap/Table';
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import React from 'react';
import addbt from './icon/plus.png';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import './InvigilatorData.css'
export default class FacultyData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    

    }

    handleOpen() {
        this.setState({
          show: true
        })
      }
      handleClose() {
        this.setState({
          show: false
        })
      }
    
    render() {
        return (
            <div >
                <Nav />
                <h1 class="state">ข้อมูลหน่วยงานในคณะ</h1>

                <div id="detail">
                    <div className="filter">
                        <h5 className="yearDLfil">บุคลากร</h5>
                        <select className="selectyearDL" onChange={(e) => this.searchYear(e)}>
                            <option value='10'>อาจารย์</option>
                        </select>
                        <h5 className="yearDLfil">ภาควิชา</h5>
                        <select className="selectyearDL" onChange={(e) => this.searchYear(e)}>
                            <option value='10'>วิศวกรรมคอมพิวเตอร์</option>
                        </select>
                    </div>
                    <Table striped responsive className="Crtable">
                        <thead>
                            <tr className="">
                                <th>รหัสบุคลากร</th>
                                <th>คำนำหน้า</th>
                                <th>ชื่อ - นามสกุล</th>
                                <th>ตำแหน่ง</th>
                                <th>คุมสอบ</th>
                                <th>เงื่อนไข</th>
                                <th>แก้ไขข้อมูล</th>
                                <th>ลบข้อมูล</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td> 012345</td>
                                <td>รศ.ดร.</td>
                                <td>สวัสดี บุญมา</td>
                                <td>หัวหน้าภาค</td>
                                <td>
                                    <Form>
                                        {['radio'].map((type) => (
                                            <div key={`inline-${type}`} className="mb-3">
                                                <Form.Group>
                                                    <Form.Check inline label="ไม่คุม" name="line" type={type} id={`inline-${type}-1`} />

                                                    <Form.Check inline label="คุม" name="line" type={type} id={`inline-${type}-1`} />
                                                    <Form.Check inline label="คุม 1 ครั้ง" name="line" type={type} id={`inline-${type}-2`} />
                                                </Form.Group>

                                            </div>
                                        ))}
                                    </Form>

                                </td>
                                <td>
                                    <Button type ="primary" onClick={() => this.handleOpen()}>กำหนดเงื่อนไข</Button>
                                </td>
                                <td>
                                    <Button variant="light" className="editdata" >
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                                <td>
                                    <Button variant="light" className="deletedata" >
                                        <img src={deletebt} className="deleteicon" alt="delete" />
                                    </Button>

                                </td>
                            </tr>
                            
                        </tbody>
                    </Table>
                    <Button variant="light" className="adddata">
                        <img src={addbt} className="addicon" alt="add" />
                    </Button>
                </div>
                <div className="footer">
                    <Foot />
                </div>

                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Body >
                        <button type="button" onClick={this.handleClose} class="close"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>

                        <div className="filter">
                            <h5 className="yearDLfil">เงื่อนไขอาคาร</h5>
                            <select className="selectyearDL" onChange={(e) => this.searchYear(e)}>
                                <option value='10'>อาจารย์</option>
                            </select>
                        </div>
                        <div className="filter">
                            <h5 className="yearDLfil">คุมสอบวิชาตัวเอง</h5>
                            <Form>
                                {['radio'].map((type) => (
                                    <div key={`inline-${type}`} className="mb-3">
                                        <Form.Group>

                                            <Form.Check inline label="ไม่คุม" name="line" type={type} id={`inline-${type}-1`} />
                                            <Form.Check inline label="คุม" name="line" type={type} id={`inline-${type}-2`} />
                                        </Form.Group>

                                    </div>
                                ))}
                            </Form>
                        </div>

                        <div className="filter">
                            <h5 className="yearDLfil">เงื่อนไขสัปดาห์</h5>
                            <select className="selectyearDL" onChange={(e) => this.searchYear(e)}>
                                <option value='10'>สัปดาห์ที่ 1</option>
                            </select>
                        </div>

                        <div className="filter">
                            <h5 className="yearDLfil">เงื่อนไขช่วงเวลา</h5>
                            <Form>
                                {['radio'].map((type) => (
                                    <div key={`inline-${type}`} className="mb-3">
                                        <Form.Group>
                                            <Form.Check inline label="เช้า" name="line" type={type} id={`inline-${type}-1`} />

                                            <Form.Check inline label="บ่าย" name="line" type={type} id={`inline-${type}-1`} />
                                            <Form.Check inline label="เช้าและบ่ายในวันเดียวกัน" name="line" type={type} id={`inline-${type}-2`} />
                                        </Form.Group>

                                    </div>
                                ))}
                            </Form>
                        </div>

                        <div className="filter">
                            <h5 className="yearDLfil">คุมสอบเสาร์อาทิตย์</h5>
                            <Form>
                                {['radio'].map((type) => (
                                    <div key={`inline-${type}`} className="mb-3">
                                        <Form.Group>
                                            <Form.Check inline label="ไม่คุม" name="line" type={type} id={`inline-${type}-1`} />
                                            <Form.Check inline label="คุม" name="line" type={type} id={`inline-${type}-2`} />
                                        </Form.Group>

                                    </div>
                                ))}
                            </Form>                            </div>

                        <div className="filter">
                            <h5 className="yearDLfil">เงื่อนไขวัน</h5>
                            <select className="selectyearDL" onChange={(e) => this.searchYear(e)}>
                                <option value='10'>สัปดาห์ที่ 1</option>
                            </select>
                        </div>

                    </Modal.Body>
                </Modal>


            </div>
        )
    }


}