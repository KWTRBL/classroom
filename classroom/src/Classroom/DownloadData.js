import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import './DownloadData.css'

function DownloadData() {
  return (
    <div >
        <Nav/>
        <h1 class="state">โหลดข้อมูลตารางสอน</h1>
        <div id="detail">
            <h4 className="updatetitle">อัพเดทล่าสุด</h4>
            <Button variant="secondary" className="getReg">รับข้อมูลจากสำนักทะเบียน</Button>
            <Button variant="secondary" className="getFile">รับข้อมูลจาก Exel</Button>
        </div>
    </div>
  );
}

export default DownloadData;
