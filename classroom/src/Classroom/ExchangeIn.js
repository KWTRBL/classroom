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
import axios from 'axios';
export default class ReportIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name1: null,
            surname1: null,
            name2: null,
            surname2: null,
            name3: null,
            surname3: null,
            name4: null,
            surname4: null,
            name1data: [],
            name2data: [],
            name3data: [],
            disableswap: true,
            disableinstead: true,
            teachswap1: null,
            teachswap2: null,
            teachinstead: [],
            name1index:null,
            name2index:null,
            name3index:null,
            filename:[]
        }
        this.handlechange = this.handlechange.bind(this);
        this.showdata = this.showdata.bind(this)
        this.showinsteaddata = this.showinsteaddata.bind(this)
        this.swapdata = this.swapdata.bind(this)
        this.insteaddata = this.insteaddata.bind(this)


    }

    handlechange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
        // Axios.post(`/`)
    }

    showdata = () => {
        // .replace(/\s+/g, ' ').trim()
        var value = this.state
        if (value.name1 == null || value.surname1 == null || value.name2 == null || value.surname2 == null) {
            alert('กรุณาใส่ข้อมูลให้ครบ')
            return
        }
        if (value.name1.trim() == value.name2.trim() && value.surname1.trim() == this.state.surname2.trim()) {
            alert('กรุณาใส่ชื่อ-นามสกุลให้ต่างกัน')
            return
        }
        axios.post('http://localhost:7777/exam_committee_getdata',
            {
                name1: this.state.name1.trim(),
                surname1: this.state.surname1.trim(),
                name2: this.state.name2.trim(),
                surname2: this.state.surname2.trim()
            }
        ).then((res) => {
            let resdata = res.data
            let data1 = []
            let data2 = []
            resdata.map((data, index) => {
                if (data.Firstname == this.state.name1.trim() && data.Lastname == this.state.surname1.trim()) {
                    data1.push(data)
                }
                if (data.Firstname == this.state.name2.trim() && data.Lastname == this.state.surname2.trim()) {
                    data2.push(data)
                }
            })
            this.setState({
                name1data: data1,
                name2data: data2,
                disableswap: false,
                teachswap1: data1[0],
                teachswap2: data2[0],
                name1index:0,
                name2index:0
            })
        }).catch(function (error) {
            if (error.response.status == 404) {
                alert('ไม่พบรายชื่อในฐานข้อมูล')
            }
        });
    }

    showinsteaddata = () => {
        // .replace(/\s+/g, ' ').trim()
        var value = this.state
        if (value.name3 == null || value.surname3 == null) {
            alert('กรุณาใส่ข้อมูลให้ครบ')
            return
        }
        axios.post('http://localhost:7777/exam_committee_insteaddata',
            {
                name1: this.state.name3.trim(),
                surname1: this.state.surname3.trim(),
            }
        ).then((res) => {
            let resdata = res.data
            let data1 = []
            resdata.map((data, index) => {
                if (data.Firstname == this.state.name3.trim() && data.Lastname == this.state.surname3.trim()) {
                    data1.push(data)
                }

            })
            this.setState({
                name3data: data1,
                disableinstead: false,
                teachinstead: data1[0],
                name3index:0
            })
        }).catch(function (error) {
            if (error.response.status == 404) {
                alert('ไม่พบรายชื่อในฐานข้อมูล')
            }
        });
    }

    swapdata = () => {
        // .replace(/\s+/g, ' ').trim()
        var value = this.state
        if (value.name1 == null || value.surname1 == null || value.name2 == null || value.surname2 == null) {
            alert('กรุณาใส่ข้อมูลให้ครบ')
            return
        }
        axios.post('http://localhost:7777/exam_committee_swap',
            {
                teachswap1: this.state.teachswap1,
                teachswap2: this.state.teachswap2
            }
        ).then((res) => {
            alert(res.data)
            window.location.reload(false);
        }).catch(function (error) {
            if (error.response.status == 500) {
                alert(error.response.data)
                window.location.reload(false);
            }
        });
    }

    insteaddata = () => {
        // .replace(/\s+/g, ' ').trim()
        var value = this.state
        if (value.name3 == null || value.surname3 == null || value.name4 == null || value.surname4 == null) {
            alert('กรุณาใส่ข้อมูลให้ครบ')
            return
        }
        if (value.name3.trim() == value.name4.trim() && value.surname3.trim() == this.state.surname4.trim()) {
            alert('กรุณาใส่ชื่อ-นามสกุลให้ต่างกัน')
            return
        }
        axios.post('http://localhost:7777/exam_committee_instead',
            {
                examdata: this.state.teachinstead,
                name: this.state.name4.trim(),
                surname: this.state.surname4.trim()
            }
        ).then((res) => {
            alert(res.data)
            window.location.reload(false);
        }).catch(function (error) {
            if (error.response.status == 500) {
                alert(error.response.data)
                window.location.reload(false);
            }
        });
    }

    handlechangeswap = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: this.state.name1data[parseInt(value)],
            name1index:parseInt(value)
        })

    }

    handlechangeswap2 = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: this.state.name2data[parseInt(value)],
            name2index:parseInt(value)
        })

    }

    handlechangeinstead = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: this.state.name3data[parseInt(value)],
            name3index:parseInt(value)
        })
    }




    render() {
        var optiondata1 = this.state.name1data.map((data, index) => {
            var date = new Date(data.exam_date)
            date.setFullYear(date.getFullYear() - 543)
            var strdate = date.toLocaleDateString('th-TH', {
                year: '2-digit',
                month: 'long',
                day: 'numeric',
                weekday: 'short',
            })

            return (
                <option name="teachswap1" selected = {this.state.name1index == index} value={index}>
                    {strdate} {data.start}-{data.end}
                </option>
            )
        })

        var optiondata2 = this.state.name2data.map((data, index) => {
            var date = new Date(data.exam_date)
            date.setFullYear(date.getFullYear() - 543)
            var strdate = date.toLocaleDateString('th-TH', {
                year: '2-digit',
                month: 'long',
                day: 'numeric',
                weekday: 'short',
            })

            return (
                <option name="teachswap2" value={index} selected = {this.state.name2index == index}>
                    {strdate} {data.start}-{data.end}
                </option>
            )
        })

        var optiondata3 = this.state.name3data.map((data, index) => {
            var date = new Date(data.exam_date)
            date.setFullYear(date.getFullYear() - 543)
            var strdate = date.toLocaleDateString('th-TH', {
                year: '2-digit',
                month: 'long',
                day: 'numeric',
                weekday: 'short',
            })
            return (
                <option name="teachinstead" value={index} selected = {this.state.name3index == index}>
                    {strdate} {data.start}-{data.end}
                </option>
            )
        })

        return (
            <div className="page-container">
                <div className="content-wrap">
                    <Nav />
                    <h1 class="state">แลกวันคุมสอบ และคุมสอบแทน</h1>

                    <div id="detail">
                        <div className="filter content-center">
                            <h5 className="yearDLfil"><b> ผู้ขอแลก :</b></h5>
                            <h5 className="yearDLfil">ชื่อ</h5>
                            <input required pattern="^[ก-๏\s]+$" className="textbox" name="name1" value={this.state.name1} onChange={(e) => this.handlechange(e)}>
                            </input>
                            <h5 className="yearDLfil">นามสกุล</h5>
                            <input required className="textbox" name="surname1" value={this.state.surname1} onChange={(e) => this.handlechange(e)}>
                            </input>
                            วัน - เวลาที่คุมสอบ
                            <select name="teachswap1" className="selectExchange" onChange={(e) => this.handlechangeswap(e)}>
                                {optiondata1}
                            </select>
                        </div>
                        <br />
                        <div className="filter content-center">

                            <h5 className="yearDLfil"><b>ผู้ให้แลก :</b></h5>
                            <h5 className="yearDLfil">ชื่อ</h5>
                            <input required className="textbox" name="name2" value={this.state.name2} onChange={(e) => this.handlechange(e)}>
                            </input>
                            <h5 className="yearDLfil">นามสกุล</h5>
                            <input required className="textbox" name="surname2" value={this.state.surname2} onChange={(e) => this.handlechange(e)}>
                            </input>                        วัน - เวลาที่คุมสอบ
                            <select className="selectExchange" name="teachswap2" onChange={(e) => this.handlechangeswap2(e)}>
                                {optiondata2}
                            </select>
                        </div>
                        <div className="filter btnIn">
                            <Button variant="light" type="submit" className="btnspace" onClick={() => this.showdata()}>แสดงข้อมูล</Button>
                            <Button variant="primary" type="submit" disabled={this.state.disableswap} className="" onClick={() => this.swapdata()}>แลกวันคุมสอบ</Button>

                        </div>

                        <br />
                        <div className="filter content-center">


                            <h5 className="yearDLfil"><b>ผู้ขอให้คุมสอบแทน : </b> ชื่อ </h5>
                            <input className="textbox" name="name3" value={this.state.name3} onChange={(e) => this.handlechange(e)}>

                            </input>
                            <h5 className="yearDLfil">นามสกุล</h5>
                            <input required className="textbox" name="surname3" value={this.state.surname3} onChange={(e) => this.handlechange(e)}>
                            </input>                        วัน - เวลาที่คุมสอบ
                            <select className="selectExchange" name="teachinstead" onChange={(e) => this.handlechangeinstead(e)} >
                                {optiondata3}
                            </select>

                        </div>
                        <br />
                        <div className="filter content-center">


                            <h5 className="yearDLfil"><b> ผู้ยินยอมคุมสอบแทน :</b>  ชื่อ </h5>
                            <input className="textbox" name="name4" value={this.state.name4} onChange={(e) => this.handlechange(e)}>

                            </input>
                            <h5 className="yearDLfil">นามสกุล</h5>
                            <input required className="textbox" name="surname4" value={this.state.surname4} onChange={(e) => this.handlechange(e)}>
                            </input>                        
                    </div>
                        <div className="filter btnIn">
                            <Button variant="light" className="btnspace" onClick={() => this.showinsteaddata()}>แสดงข้อมูล</Button>
                            <Button variant="primary" disabled={this.state.disableinstead} className="" onClick={() => this.insteaddata()}>คุมสอบแทน</Button>

                        </div>

                        <br />

                    </div>
                </div>
                <div className="footer">
                    <Foot />
                </div>
            </div>
        )
    }


}