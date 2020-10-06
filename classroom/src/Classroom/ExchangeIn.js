import { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavIn'
import Foot from '../Navbar/FooterCr'
import Table from 'react-bootstrap/Table';
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import React from 'react';
import addbt from './icon/plus.png';

import './ExchangeIn.css'
export default class ReportIn extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div >
                <Nav />
                <h1 class="state">แลกวันคุมสอบ และคุมสอบแทน</h1>
                <div id="detail">
                    <div className="filter content-center">


                        <h5 className="yearDLfil">ชื่อ-นามสกุล (ผู้ขอแลก)</h5>
                        <input className="textbox"></input>
                            วัน - เวลาที่คุมสอบ
                    </div>
                    <br />
                    <div className="filter content-center">


                        <h5 className="yearDLfil">ชื่อ-นามสกุล (ผู้ให้แลก) </h5>
                        <input className="textbox"></input>
                        วัน - เวลาที่คุมสอบ
                    </div>
                    <div className="filter btnIn">
                        <Button variant="primary" className="" onClick={(e) => this.manageroom(e)}>แสดงข้อมูล</Button>
                    </div>


                    <br />
                    <div className="filter content-center">


                        <h5 className="yearDLfil">ชื่อ-นามสกุล (ผู้ขอให้คุมสอบแทน) </h5>
                        <input className="textbox"></input>
                        วัน - เวลาที่คุมสอบ
                    </div>
                    <br />
                    <div className="filter content-center">


                        <h5 className="yearDLfil">ชื่อ-นามสกุล (ผู้ยินยอมคุมสอบแทน) </h5>
                        <input className="textbox"></input>
                    วัน - เวลาที่คุมสอบ
                    </div>
                    <div className="filter btnIn">
                        <Button variant="primary" className="" onClick={(e) => this.manageroom(e)}>แสดงข้อมูล</Button>
                    </div>

                    <br />

                </div>
                <div className="footer">
                    <Foot />
                </div>
            </div>
        )
    }


}