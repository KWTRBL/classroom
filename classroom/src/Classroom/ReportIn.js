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
import axios from "axios";

import './ReportIn.css'
const FileDownload = require('js-file-download');

export default class ReportIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            box: [true, true],
            exam_committee: [],
            yearsearch: null,
            semestersearch: null,
            mid_or_final: null,
            departsearch: null,
            exam_date: null,
            exam_time: null,
            deptlist: [],
            filter: [],
            examweek: [],
            state: '0',
            filename:['รายงานผลการจัดผู้คุมสอบ','รายงานการจัดผู้คุมสอบแยกตามภาควิชา','รายงานเวียนแฟ้ม'],
            deptname:null

        }
        this.report = this.report.bind(this)
        this.handlechange = this.handlechange.bind(this);

    }

    componentWillMount() {
        var dept = null
        axios
            .get("http://localhost:7777/report_filter")
            .then((res) => {
                var data = JSON.parse(res.data[0].filter);
                // console.log(JSON.parse(res.data[0].filter));
                var listdata = [];
                res.data.map((datain) => {
                    if (datain.year == res.data[0].year) {
                        var filterjson = JSON.parse(datain.filter);
                        return filterjson.map((jsondata, index) => {
                            // console.log(jsondata,data[0].semester)
                            if (jsondata.semester == data[0].semester && jsondata.mid_or_final == data[0].mid_or_final) {
                                if (!listdata.includes(jsondata.exam_date)) {
                                    listdata.push(jsondata.exam_date);
                                }
                            }
                        });
                    }
                })

                listdata.sort()

                var listdatatime = [];
                res.data.map((datain) => {
                    if (datain.year == res.data[0].year) {
                        var filterjson = JSON.parse(datain.filter);
                        return filterjson.map((jsondata, index) => {
                            if (jsondata.semester == data[0].semester && jsondata.mid_or_final == data[0].mid_or_final && listdata[0] == jsondata.exam_date) {
                                if (!listdatatime.includes(jsondata.exam_time)) {
                                    listdatatime.push(jsondata.exam_time);
                                }
                            }
                        });
                    }
                })
                listdatatime.sort()



                var datadept = [];
                res.data.map((datain, index) => {
                    if (datain.year == res.data[0].year) {
                        var filterjson = JSON.parse(datain.filter);
                        return filterjson.filter((jsondata, index) => {
                            if (data[0].semester == jsondata.semester && data[0].mid_or_final == jsondata.mid_or_final) {
                                if (!datadept.includes(jsondata.faculty_id)) {
                                    // console.log(jsondata)
                                    datadept.push(jsondata.faculty_id);
                                }
                            }

                        });
                    }
                });
                datadept.sort()
                console.log(datadept)
                dept = datadept[0]
                this.setState({
                    filter: res.data,
                    yearsearch: res.data[0].year,
                    semestersearch: data[0].semester,
                    mid_or_final: data[0].mid_or_final,
                    persontype: 1,
                    exam_date: listdata[0],
                    exam_time: listdatatime[0],
                    departsearch: datadept[0]

                });
            })
            .catch(function (error) {
                console.log(error);
            });

        axios
            .get("http://localhost:7777/t_office")
            .then((res) => {
                console.log(this.state.departsearch,dept)
                var deptnamedata = null
                res.data.map((data) =>{
                    if(dept == data.Office_id){
                        deptnamedata = data.Office_name
                    }
                })
                this.setState({
                    deptlist: res.data,
                    deptname:deptnamedata
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        axios
            .get("http://localhost:7777/examweek")
            .then((res) => {

                console.log(res.data, this.state.yearsearch)
                res.data.map((data) => {
                    if (data.year == this.state.yearsearch && data.semester == this.state.semestersearch && data.mid_or_final == this.state.mid_or_final) {
                        var dateObj = new Date(data.week1_start);
                        var month = dateObj.getUTCMonth() + 1; //months from 1-12
                        var day = dateObj.getUTCDate();
                        var year = dateObj.getUTCFullYear();
                        var myNumber = month;
                        var monthstr = ("0" + myNumber).slice(-2);
                        var myNumber = day;
                        var daystr = ("0" + myNumber).slice(-2);

                        var newdate = year + "-" + monthstr + "-" + daystr;
                        this.setState({
                            exam_date: newdate
                        })
                    }
                })
                this.setState({
                    examweek: res.data
                });
            })
            .catch(function (error) {
                console.log(error);
            });



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
        const { name } = event.target;
        this.setState({
            [name]: value
        })

    }

    handlechange = (e) => {
        const { name, value } = e.target;
        console.log(e)
        var index = e.nativeEvent.target.selectedIndex;
        console.log(e.nativeEvent.target[index].text)
        this.setState({
            [name]: value
        })
        if (name != 'exam_time') {
            this.setState({
                exam_time: '1'
            })
        }
        if(name == 'departsearch'){
            this.setState({
                deptname:e.nativeEvent.target[index].text
            })

        }
    }


    downloadexcel = () => {

        axios
            .post("http://localhost:7777/exportfile", {
                year: this.state.yearsearch,
                semester: this.state.semestersearch,
                mid_or_final: this.state.mid_or_final,
                state: this.state.state,
                exam_time: this.state.exam_time,
                exam_date: this.state.exam_date,
                faculty_id: this.state.departsearch
            }, {

                responseType: 'arraybuffer',
            })
            .then(response => {
                console.log("response: ", response,this.state.state)
                FileDownload(response.data, `${this.state.filename[this.state.state]}.xlsx`);
            })
            .catch(err => {
                console.error(err)
            })
    }




    render() {

        var yeardata = this.state.filter.map((data, index) => {
            return <option value={data.year.toString()} selected={this.state.yearsearch == data.year}>{data.year}</option>;
        });


        var mid_or_final = this.state.filter.map((data, index) => {
            // this.state.yearsearch
            if (data.year == this.state.yearsearch) {
                var filterjson = JSON.parse(data.filter);
                var listdata = [];
                return filterjson.map((jsondata, index) => {
                    if (jsondata.semester == this.state.semestersearch) {
                        if (!listdata.includes(jsondata.mid_or_final)) {
                            listdata.push(jsondata.mid_or_final);
                            return (
                                <option value={jsondata.mid_or_final} selected={this.state.mid_or_final == jsondata.mid_or_final}>
                                    {jsondata.mid_or_final == "M" ? "กลางภาค" : "ปลายภาค"}
                                </option>
                            );
                        }
                    }
                });
            }
        });

        var semester = this.state.filter.map((data, index) => {
            if (data.year == this.state.yearsearch) {
                var filterjson = JSON.parse(data.filter);
                var listdata = [];
                return filterjson.map((jsondata, index) => {
                    if (!listdata.includes(jsondata.semester)) {
                        listdata.push(jsondata.semester);
                        return (
                            <option selected={this.state.semestersearch == jsondata.semester ? true : false} value={jsondata.semester} > {jsondata.semester} </option>
                        );
                    }
                });
            }
        });

        var listdata = [];
        this.state.filter.filter((data, index) => {
            if (data.year == this.state.yearsearch) {
                var filterjson = JSON.parse(data.filter);
                return filterjson.filter((jsondata, index) => {
                    if (this.state.semestersearch == jsondata.semester && this.state.mid_or_final == jsondata.mid_or_final) {
                        if (!listdata.includes(jsondata.faculty_id)) {
                            // console.log(jsondata)
                            listdata.push(jsondata.faculty_id);
                        }
                    }

                });
            }
        });

        listdata.sort()
        var deptdata = listdata.map((data) => {
            for (let index = 0; index < this.state.deptlist.length; index++) {
                const element = this.state.deptlist[index];
                if (element.Office_id == data) {
                    return <option value={data} selected={this.state.departsearch == element.Office_name}>{element.Office_name}</option>;
                }
            }
        })

        var listdata = [];
        this.state.filter.map((data) => {
            if (data.year == this.state.yearsearch) {
                var filterjson = JSON.parse(data.filter);
                return filterjson.map((jsondata, index) => {
                    if (jsondata.semester == this.state.semestersearch && jsondata.mid_or_final == this.state.mid_or_final) {
                        if (!listdata.includes(jsondata.exam_date)) {
                            listdata.push(jsondata.exam_date);
                        }
                    }
                });
            }
        })

        listdata.sort()
        var exam_datedata = listdata.map((data, index) => {
            var date = new Date(data)
            date.setFullYear(date.getFullYear() - 543)
            var strdate = date.toLocaleDateString('th-TH', {
                year: '2-digit',
                month: 'long',
                day: 'numeric',
                weekday: 'short',
            })
            // console.log(data,this.state.exam_date)
            return <option value={data} selected={this.state.exam_date == data} name="exam_date"> {strdate} </option>
        })

        var listdata = [];
        this.state.filter.map((data) => {
            if (data.year == this.state.yearsearch) {
                var filterjson = JSON.parse(data.filter);
                return filterjson.map((jsondata, index) => {
                    if (jsondata.semester == this.state.semestersearch && jsondata.mid_or_final == this.state.mid_or_final && this.state.exam_date == jsondata.exam_date) {
                        if (!listdata.includes(jsondata.exam_time)) {
                            listdata.push(jsondata.exam_time);
                        }
                    }
                });
            }
        })

        console.log(listdata)

        listdata.sort()
        var numtimestr = ['', '09.30 น. - 12.30 น.', '13.30 น. - 16.30 น.']

        var exam_timedata = listdata.map((data, index) => {
            return <option value={data} name="exam_time" selected={this.state.exam_time === data} >  {numtimestr[parseInt(data)]} </option>
        })

        return (
            <div className="page-container" >
                <div className="content-wrap">

                    <Nav />
                    <h1 class="state">รายงานผลการจัดผู้คุมสอบ</h1>

                    <ul class="list-group">
                        <li className="year">
                            <h5 className="yearDLfil">ปีการศึกษา</h5>
                            <select className="selector" name="yearsearch" onChange={(e) => this.handlechange(e)}>
                                {yeardata}
                            </select>

                        </li>
                        <li className="semester">
                            <h5 className="yearDLfil">ภาคการศึกษา</h5>
                            <select className="selector" name="semestersearch" onChange={(e) => this.handlechange(e)}>
                                {semester}

                            </select>
                        </li>
                        <li className="mid-final">
                            <h5 className="yearDLfil">การสอบ</h5>
                            <select className="selector" name="mid_or_final" onChange={(e) => this.handlechange(e)}>
                                {mid_or_final}
                            </select>

                        </li>
                        <li className="reporttype">
                            <h5 className="yearDLfil">ประเภทรายงาน</h5>
                            <select className="selector" name="state" onChange={(e) => this.report(e)}>
                                <option value="0">รายงานผลการจัดผู้คุมสอบ</option>
                                <option value="1">รายงานการจัดผู้คุมสอบแยกตามภาควิชา</option>
                                <option value="2" >รายงานเวียนแฟ้ม</option>
                            </select>
                        </li>
                        <li className="depart" hidden={this.state.box[0]}>
                            <h5 className="yearDLfil">ภาควิชา</h5>
                            <select className="selector" name="departsearch" onChange={(e) => this.handlechange(e)}>
                                {deptdata}
                            </select>
                        </li>
                        <li className="daytext" hidden={this.state.box[1]}>
                            <h5 className="yearDLfil">วันสอบ</h5>
                            <select className="selector" name="exam_date" onChange={(e) => this.handlechange(e)} >
                                {exam_datedata}
                            </select>
                        </li>
                        <li className="timetext" hidden={this.state.box[1]}>
                            <h5 className="yearDLfil">ช่วงเวลาสอบ</h5>
                            <select className="selector" name="exam_time" onChange={(e) => this.handlechange(e)} >
                                {exam_timedata}
                            </select>
                        </li>
                        <li id="btnDWIn">
                        <Button variant="primary" className="" onClick={() => this.downloadexcel()}>แสดงข้อมูล
                        </Button>

                        </li>
                    </ul>
                </div>
                <div className="footer">
                    <Foot />
                </div>
            </div>
        )
    }


}