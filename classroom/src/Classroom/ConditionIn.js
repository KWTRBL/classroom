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

import './ConditionIn.css'
export default class ConditionIn extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div className="page-container" >
                <div className="content-wrap">

                    <Nav />
                    <h1 class="state">กำหนดเงื่อนไขจำนวนกรรมการคุมสอบ</h1>
                    <div className="top">
                        <p>
                            <div className="topstdcount">
                                <div className="text">
                                    จำนวนกรรมการต่ำสุด 2 คนต่อห้อง   &emsp; จำนวนกรรมการ 1 คนต่อนักศึกษา

                            </div>
                                <div className="stdcount">
                                    <input
                                        value=""
                                        type="text"
                                        className="form-control textboxCon"
                                        id="formGroupExampleInput"
                                        onChange={this.handleChange_building_no}
                                    />
                                    <Button variant="primary" className="editdata ConIn" >
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>

                                </div>
                            </div>

                        </p>


                    </div>
                    <br />
                    <hr />

                    <div id="detail">
                        <h1 class="state">กำหนดสัปดาห์การสอบ</h1>
                        <br />
                        <div className="filter">
                            <h5 className="yearDLfil">ปีการศึกษา</h5>
                            <select className="selectyearDL" onChange={(e) => this.searchYear(e)}>
                                <option value='10'>2563</option>
                            </select>
                            <h5 className="buildfil2">ภาคการศึกษา</h5>
                            <div className="buildfildetail2">
                                <select id="floor_num" onChange={(e) => this.searchSpace1(e)}>
                                    <option value='10'>1</option>

                                </select>
                            </div>

                        </div>
                        <Table striped responsive className="Crtable">
                            <thead>
                                <tr className="">
                                    <th>สัปดาห์ที่</th>
                                    <th>วันที่เริ่ม</th>
                                    <th>วันที่สิ้นสุด</th>
                                    <th>แก้ไขข้อมูล</th>
                                    <th>ลบข้อมูล</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td> 1</td>
                                    <td>1 ตุลาคม 2563</td>
                                    <td>1 ตุลาคม 2563</td>
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
                                <tr>
                                    <td> 1</td>
                                    <td>1 ตุลาคม 2563</td>
                                    <td>1 ตุลาคม 2563</td>
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

                    </div>
                </div>
                <div className="footer">
                    <Foot />
                </div>
            </div>
        )
    }


}