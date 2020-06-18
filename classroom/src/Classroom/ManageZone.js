import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import Foot from '../Navbar/FooterCr'
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import addbt from './icon/plus.png';
import './ManageZone.css'

function ManageZone() {
  return (
    <div >
        <Nav/>
        <h1 class="state">แบ่งโซนห้องเรียนแต่ละภาควิชา</h1>
        <div id="detail">
            <table className="Crtable">
                <thead>
                    <tr className="ManZoneTable">
                        <th>สาขาวิชา</th>
                        <th>อาคารเรียน</th>
                        <th>ชั้น</th>
                        <th>แก้ไขข้อมูล</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>วิศวกรรมเครื่องกล</td>
                        <td>ตึกเครื่องกล</td>
                        <td>1</td>
                        <td>
                            <Button variant="light" className="editdata"> 
                                <img src={editbt} className="editicon" alt="edit" />
                            </Button>
                            <Button variant="light" className="deletedata">
                                <img src={deletebt} className="deleteicon" alt="delete" />
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Button variant="light" className="adddata">
                <img src={addbt} className="addicon" alt="add" /> 
            </Button>
            <Foot/>
        </div>
    </div>
  );
}

export default ManageZone;
