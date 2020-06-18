import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import Foot from '../Navbar/FooterCr'
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import addbt from './icon/plus.png';
import './ManageGroup.css';

function ManageGroup() {
  return (
    <div >
        <Nav/>
        <h1 class="state">จัดจำนวนนักศึกษาแต่ละกลุ่ม</h1>
        <div id="detail">
            <table className="Crtable">
                <thead>
                    <tr className="Managegrouptable">
                        <th>สาขา</th>
                        <th>ชั้นปี</th>
                        <th>กลุ่ม 1</th>
                        <th>กลุ่ม 2</th>
                        <th>กลุ่ม 3</th>
                        <th>แก้ไขข้อมูล</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td >วิศวกรรมคอมพิวเตอร์</td>
                        <td >1</td>
                        <td>50</td>
                        <td>50</td>
                        <td>30</td>
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

export default ManageGroup;
