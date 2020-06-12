import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import Foot from '../Navbar/FooterCr'
import DownloadPic from './icon/downloadfile.png';
import './DownloadFile.css'

function DownloadFile() {
  return (
    <div >
        <Nav/>
        <h1 class="state">จัดพิมพ์เอกสาร</h1>
        <div id="detail">
            <div className="date">
                <h5 className="DLdayfil">วันที่เรียน</h5>
                <Form className="selectDLday">
                    <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                        <Form.Control as="select" size="sm">
                            <option value="1">ทั้งหมด</option>
                            <option value="1">จันทร์</option>
                            <option value="2">อังคาร</option>
                            <option value="3">พุธ</option>
                            <option value="4">พฤหัสบดี</option>
                            <option value="5">ศุกร์</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </div>
            
            <table className="Crtable">
                <thead>
                    <tr>
                        <th>เอกสาร</th>
                        <th>Download</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td >จัดห้องเรียนอาคาร 12 ชั้น</td>
                        <td >
                        <Button variant="light" className="downloadfilebtn">
                            <img src={DownloadPic} className="dlicon" alt="download" /></Button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Foot/>
        </div>
    </div>
  );
}

export default DownloadFile;
