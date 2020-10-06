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

import './ManageIn.css'
export default class ManageIn extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div >
                <Nav />
                <h1 class="state">จัดกรรมการคุมสอบ</h1>
                <div id="detail">
                    <div className="filter">
                        <h5 className="yearDLfil">ปีการศึกษา</h5>
                        <select className="selectyearDL" onChange={(e) => this.searchYear(e)}>
                            <option value="13:00">2563</option>

                        </select>
                        <h5 className="termDLfil">ภาคการศึกษา</h5>
                        <select className="selecttermDL" onChange={(e) => this.searchSemester(e)}>
                            <option value="13:00">บ่าย</option>

                        </select>
                        <h5 className="termDLfil">การสอบ</h5>
                        <select className="selectime" onChange={(e) => this.searchTime(e)}>
                            <option value="7:00">กลางภาค</option>
                            <option value="13:00">ปลายภาค</option>
                        </select>
                    </div>
                    <div className="filter">
                        <h5 className="departManfil2">ภาควิชา</h5>
                        <select className="selectdepart" onChange={(e) => this.searchCurr2(e)}>
                            <option value="13:00">วิศวกรรมคอมพิวเตอร์</option>

                        </select>

                        <h5 className="termDLfil">กรรมการ</h5>
                        <select className="selecttermDL" onChange={(e) => this.searchSemester(e)}>
                            <option value="13:00">อาจารย์</option>

                        </select>
                        <div id="ManageInbtn">
                            <Button variant="primary" className="ManageInbtn" onClick={(e) => this.manageroom(e)}>จัดคุมวิชาที่สอน</Button>
                        </div>
                        <div id="">
                            <Button variant="primary" className="ManageInbtn" onClick={(e) => this.manageroom(e)}>จัดคุมสอบปกติ</Button>
                        </div>


                    </div>
                    <Table striped responsive className="Crtable">
                        <thead>
                            <tr className="ManageIntable">
                                <th>ชื่ออาจารย์ - เจ้าหน้าที่</th>
                                <th>คุมสอบครั้งที่ 1</th>
                                <th>คุมสอบครั้งที่ 2</th>
                                <th>คุมสอบครั้งที่ 3</th>
                                <th>คุมสอบครั้งที่ 4</th>
                                <th>คุมสอบครั้งที่ 5</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td> รศ.ดร. สวัสดี บุญมา</td>
                                <td>27 ก.ค. 63  09.30-12.30
                                อาคาร 12 ชั้น ห้อง E12-401
</td>
                                <td>27 ก.ค. 63 09.30-12.30 อาคาร 12 ชั้น ห้อง E12-401	</td>
                                <td>27 ก.ค. 63 09.30-12.30 อาคาร 12 ชั้น ห้อง E12-401	</td>
                                <td>27 ก.ค. 63 09.30-12.30 อาคาร 12 ชั้น ห้อง E12-401	</td>
                                <td>27 ก.ค. 63 09.30-12.30 อาคาร 12 ชั้น ห้อง E12-401	</td>

                            </tr>
                            <tr>
                                <td>รศ.ดร. สวัสดี บุญมา </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>

                            </tr>

                        </tbody>
                    </Table>

                </div>
                <div className="footer">
                    <Foot />
                </div>
            </div>
        )
    }


}