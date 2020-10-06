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

import './ReportIn.css'
export default class ReportIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            box: [true, true]
        }
        this.report = this.report.bind(this)
    }

    report(event) {
        let value = event.target.value;
        if (value == "0") {
            this.setState({
                box: [true, true]
            })
        }
        if (value == "1") {
            this.setState({
                box: [false, true]
            })
        }
        if (value == "2") {
            this.setState({
                box: [true, false]
            })
        }

    }
    render() {
        return (
            <div >
                <Nav />
                <h1 class="state">รายงานผลการจัดผู้คุมสอบ</h1>

                <ul class="list-group">
                    <li className="year">
                        <h5 className="yearDLfil">ปีการศึกษา</h5>
                        <select className="selector" onChange={(e) => this.searchYear(e)}>
                            <option value="13:00">2563</option>

                        </select>

                    </li>
                    <li className="semester">
                        <h5 className="yearDLfil">ภาคการศึกษา</h5>
                        <select className="selector" onChange={(e) => this.searchYear(e)}>
                            <option value="13:00">1</option>

                        </select>
                    </li>
                    <li className="mid-final">
                        <h5 className="yearDLfil">การสอบ</h5>
                        <select className="selector" onChange={(e) => this.searchYear(e)}>
                            <option value="13:00">กลางภาค</option>
                            <option value="13:00">ปลายภาค</option>
                        </select>

                    </li>
                    <li className="reporttype">
                        <h5 className="yearDLfil">ประเภทรายงาน</h5>
                        <select className="selector" onChange={(e) => this.report(e)}>
                            <option value="0">รายงานผลการจัดผู้คุมสอบ</option>
                            <option value="1">รายงานการจัดผู้คุมสอบแยกตามภาควิชา</option>
                            <option value="2">รายงานเวียนแฟ้ม</option>

                        </select>
                    </li>
                    <li className="depart" hidden={this.state.box[0]}>
                        <h5 className="yearDLfil">ภาควิชา</h5>
                        <select className="selector">
                            <option value="0">วิศวกรรมคอมพิวเตอร์</option>
                        </select>
                    </li>
                    <li className="daytext" hidden={this.state.box[1]}>
                        <h5 className="yearDLfil">วันสอบ</h5>
                        <select className="selector" >
                            <option value="0">15   มีนาคม  2563 </option>
                            <option value="1">16   มีนาคม  2563 </option>
                        </select>
                    </li>
                    <li className="timetext" hidden={this.state.box[1]}>
                        <h5 className="yearDLfil">ช่วงเวลาสอบ</h5>
                        <select className="selector" >
                            <option value="0">13.30 น. - 16.30 น.</option>
                        </select>
                    </li>
                    <li>
                        <Button variant="primary" className="">แสดงข้อมูล
                        </Button>

                    </li>
                </ul>

                <div className="footer">
                    <Foot />
                </div>
            </div>
        )
    }


}