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

import './FacultyData.css'
export default class FacultyData extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div >
                <Nav />
                <h1 class="state">ข้อมูลหน่วยงานในคณะ</h1>

                <div id="detail">
                    <div className="filter">
                        <h5 className="yearDLfil">หน่วยงานในคณะ</h5>
                        <select className="selectyearDL" onChange={(e) => this.searchYear(e)}>
                            <option value='10'>ภาควิชา</option>
                        </select>
                        
                    </div>
                    <Table striped responsive className="Crtable">
                        <thead>
                            <tr className="Buildtable">
                                <th>รหัสหน่วยงาน</th>
                                <th>ชื่อหน่วยงาน</th>
                                <th>แก้ไขข้อมูล</th>
                                <th>ลบข้อมูล</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td> 01</td>
                                <td>วิศวกรรมโทรคมนาคม</td>
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
                                <td> 02</td>
                                <td>วิศวกรรมไฟฟ้า</td>
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
            </div>
        )
    }


}