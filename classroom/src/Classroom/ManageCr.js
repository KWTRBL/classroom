import React from 'react';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import Foot from '../Navbar/FooterCr'
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import addbt from './icon/plus.png';
import axios from 'axios';
import { Component } from 'react';
import { json } from 'body-parser';
import Pagination from "react-js-pagination";
import Modal from 'react-bootstrap/Modal'
import './ManageCr.css'
const FileDownload = require('js-file-download');

export default class BuildingData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: [],
            year: [],
            semester: [],
            curr2: [],
            stateyear: 0,
            yearsearch: null,
            semestersearch: null,
            curr2search: null,
            daysearch: null,
            result: [1, 2, 3],
            pageclick: 1,
            itemperpage: 10,
            firstitem: null,
            lastitem: null,
            starttime: '07:00',
            timeperiod: 0, //ช่วงเวลา
            editlist: [],
            olddata: null,
            available_room: [],
            room_no: null,
            building_no: null,
            showsubmit: false,
            showfailed: false,
            indextodel: null
        }
        //modal
        this.handleClose = this.handleClose.bind(this);
        this.handleClosesubmit = this.handleClosesubmit.bind(this);
        this.handleClosefailed = this.handleClosefailed.bind(this);


        //delete row
        this.deletebt = this.deletebt.bind(this)
        this.confirmdelete = this.confirmdelete.bind(this);

        //edit data
        this.enableedit = this.enableedit.bind(this)
        this.canceledit = this.canceledit.bind(this)
        this.confirmedit = this.confirmedit.bind(this)
        this.handleChange_building_no = this.handleChange_building_no.bind(this)
        this.handleChange_room_no = this.handleChange_room_no.bind(this)
        //    this.handleChange_editfloor_numhandleChange_room_no = this.handleChange_editfloor_num.bind(this)

        this.componentWillMount = this.componentWillMount.bind(this);
        this.pageselectvalue = this.pageselectvalue.bind(this);

        this.manageroom = this.manageroom.bind(this)

    }
    //delete row button 
    deletebt = (buildng_no, room_no, index) => {
        this.setState({
            show: true,
            building_no: buildng_no,
            room_no: room_no,
            indextodel: index
        })
    }

    downloadexcel = () => {
        var curr2_tname = null
        this.state.curr2.map((data, index) => {
            if (this.state.curr2search == data.curr2_id) {
                curr2_tname = data.curr2_tname
            }
        })
        axios
            .post("http://localhost:7777/downloadfile", {
                year: this.state.yearsearch,
                semester: this.state.semestersearch,
                curr2_id: this.state.curr2search,
                curr2_tname: curr2_tname
            }, {

                responseType: 'arraybuffer',
            })
            .then(response => {
                console.log("response: ", response)
                FileDownload(response.data, 'report.xlsx');
                // do something about response
            })
            .catch(err => {
                console.error(err)
            })
    }

    componentWillMount() {
        axios.get('http://localhost:7777/teachdata')
            .then(res => {
                const newIds = this.state.editlist.slice()
                for (var i = 0; i < res.data.length; i++) {
                    newIds.push(0)
                }
                this.setState({
                    name: res.data,
                    editlist: newIds,
                    olddata: JSON.stringify(res.data)

                })

            })
            .catch(function (error) {
                console.log(error);
            })
        axios.get('http://localhost:7777/availableroom')
            .then(res => {
                this.setState({
                    available_room: res.data,
                })

            })
            .catch(function (error) {
                console.log(error);
            })

        axios.get('http://localhost:7777/yeardata')
            .then(res => {
                this.setState({
                    year: res.data,
                })

            })
            .catch(function (error) {
                console.log(error);
            })

        axios.get('http://localhost:7777/semesterdata')
            .then(res => {
                this.setState({
                    semester: res.data,
                })

            })
            .catch(function (error) {
                console.log(error);
            })

        axios.get('http://localhost:7777/curriculum')
            .then(res => {
                this.setState({
                    curr2: res.data,
                })

            })
            .catch(function (error) {
                console.log(error);
            })

        this.setState({
            firstitem: 0,
            lastitem: this.state.itemperpage
        })
    }
    //cancel edit row
    canceledit = (index) => {
        const newIds = this.state.editlist.slice() //copy the array
        newIds[index] = 0//execute the manipulations
        this.setState({
            editlist: newIds,
            name: JSON.parse(this.state.olddata),
        }) //set the new state
    }

    enableedit = (index) => {

        const result = this.state.editlist.find((data) => {
            return data == 1
        })
        if (!result) {
            const newIds = this.state.editlist.slice() //copy the array
            newIds[index] = 1//execute the manipulations
            this.setState({ editlist: newIds }) //set the new state
        }
    }

    handleChange_building_no(index, event) {
        const newIds = this.state.name //copy the array
        newIds[index].building_no = event.target.value //execute the manipulations

        //await this.setState({ name: newIds }) //set the new state

        this.setState({
            name: newIds,
            building_no: event.target.value
        })
    }

    handleChange_room_no(index, event) {
        const newIds = this.state.name //copy the array
        newIds[index].room_no = event.target.value //execute the manipulations

        //await this.setState({ name: newIds }) //set the new state

        this.setState({
            name: newIds,
            room_no: event.target.value
        })
    }
    pageselectvalue(value) {
        let newId = this.state.editlist.slice()
        for (var i = 0; i < newId.length; i++) {
            if (newId[i] == 1) {
                newId[i] = 0
            }
        }
        this.setState({
            pageclick: value,
            firstitem: (this.state.itemperpage * value) - this.state.itemperpage,
            lastitem: (this.state.itemperpage * value),
            editlist: newId,
            name: JSON.parse(this.state.olddata),

        })
    }
    searchYear = (event) => {
        let keyword = event.target.value;
        this.setState({
            yearsearch: keyword,
            stateyear: 0
        })
        this.pageselectvalue(1)
        //alert(this.state.yearsearch)

        //this.state.stateyear = 0 ;
    }
    searchSemester = (event) => {
        let keyword = event.target.value;
        this.setState({ semestersearch: keyword })
    }
    searchCurr2 = (event) => {
        let keyword = event.target.value;
        this.setState({ curr2search: keyword })
        this.pageselectvalue(1)
    }
    searchDay = (event) => {
        let keyword = event.target.value;
        this.setState({ daysearch: keyword })
        this.pageselectvalue(1)
    }

    searchTime = (event) => {
        let keyword = event.target.value;
        this.setState({ starttime: keyword })
        this.pageselectvalue(1)
    }

    manageroom = async () => {
        console.log('manage room')
        var data = await axios.post("http://localhost:7777/manageroom", {
            data: {
                year: this.state.yearsearch,
                semester: this.state.semestersearch,
                curr2_id: this.state.curr2search,
                teach_day: this.state.daysearch,
                timeperiod: this.state.starttime
            }
        })
        var teachdata = await axios.get('http://localhost:7777/teachdata')
        console.log(data)
        console.log(teachdata)
        const newIds = []
        for (var i = 0; i < teachdata.data.length; i++) {
            newIds.push(0)
        }
        this.setState({
            name: teachdata.data,
            editlist: newIds,
            olddata: JSON.stringify(teachdata.data)

        })

        // window.location.reload(false);


    }

    //enable edit row
    enableedit = (index, building_no, room_no) => {

        const result = this.state.editlist.find((data) => {
            this.setState({
                building_no: building_no,
                room_no: room_no
            })
            return data == 1
        })
        if (!result) {
            const newIds = this.state.editlist.slice() //copy the array
            newIds[index] = 1//execute the manipulations
            this.setState({ editlist: newIds }) //set the new state
        }
    }

    //confirm edit data sent to database
    confirmedit = async (index) => {
        let olddata = JSON.parse(this.state.olddata)

        console.log(index)
        console.log(this.state.name[index])
        console.log(olddata[index])
        let time = null
        if (this.state.starttime == "07:00")
            time = 1
        if (this.state.starttime == "13:00")
            time = 2
        if (this.state.starttime == "16:30")
            time = 3
        console.log(time)

        var data = await axios
            .post("http://localhost:7777/availableroom/update", {
                room_no: this.state.name[index].room_no,
                building_no: this.state.name[index].building_no,
                year: this.state.name[index].year,
                semester: this.state.name[index].semester,
                curr: this.state.name[index].curr2_id,
                dept: this.state.name[index].dept_id,
                teachday: this.state.name[index].teach_day,
                subject_id: this.state.name[index].subject_id,
                teach_time: this.state.name[index].teach_time,
                teach_time2: this.state.name[index].teach_time2,
                time: time,
                oldroom: olddata[index].room_no,
                section: this.state.name[index].section
            })
            // .then(response => {
            //     console.log("response: ", response)

            //     // do something about response
            // })
            // .catch(err => {
            //     console.error(err)
            // })

        var teachdata = await axios.get('http://localhost:7777/teachdata')
        console.log(data)
        console.log(teachdata)
        const newIds = []
        for (var i = 0; i < teachdata.data.length; i++) {
            newIds.push(0)
        }
        this.setState({
            name: teachdata.data,
            editlist: newIds,
            olddata: JSON.stringify(teachdata.data)
        })

        // window.location.reload(false);

    }




    //confirm edit data sent to database
    confirmdelete = () => {
        let index = this.state.indextodel
        let olddata = JSON.parse(this.state.olddata)

        console.log(index)
        console.log(this.state.name[index])
        console.log(olddata[index])
        let time = null
        if (this.state.starttime == "07:00")
            time = 1
        if (this.state.starttime == "13:00")
            time = 2
        if (this.state.starttime == "16:30")
            time = 3
        console.log(time)

        axios
            .post("http://localhost:7777/availableroom/delete", {
                room_no: this.state.name[index].room_no,
                building_no: this.state.name[index].building_no,
                year: this.state.name[index].year,
                semester: this.state.name[index].semester,
                curr: this.state.name[index].curr2_id,
                dept: this.state.name[index].dept_id,
                teachday: this.state.name[index].teach_day,
                subject_id: this.state.name[index].subject_id,
                teach_time: this.state.name[index].teach_time,
                teach_time2: this.state.name[index].teach_time2,
                time: time,
                section: this.state.name[index].section
            })
            .then(response => {
                console.log("response: ", response)
                if (response.data == "Success") {
                    this.setState({
                        showsubmit: !this.state.showsubmit
                    })
                }
                else {
                    this.setState({
                        showfailed: !this.state.showfailed
                    })
                }
                // do something about response
            })
            .catch(err => {
                console.error(err)
            })

        this.handleClose()

    }

    //handle modal
    handleClose() {
        this.setState({
            show: false
        })
    }

    async handleClosesubmit() {
        var teachdata = await axios.get('http://localhost:7777/teachdata')
        const newIds = []
        for (var i = 0; i < teachdata.data.length; i++) {
            newIds.push(0)
        }
        this.setState({
            name: teachdata.data,
            editlist: newIds,
            olddata: JSON.stringify(teachdata.data),
            showsubmit: false


        })

        // window.location.reload(false);
    }

    async handleClosefailed() {
        var teachdata = await axios.get('http://localhost:7777/teachdata')
        const newIds = []
        for (var i = 0; i < teachdata.data.length; i++) {
            newIds.push(0)
        }
        this.setState({
            name: teachdata.data,
            editlist: newIds,
            olddata: JSON.stringify(teachdata.data),
            showfailed: false


        })
        // this.setState({
        //     showfailed: false
        // })
        // window.location.reload(false);

    }



    render() {
        console.log('re render')
        var editjson = []
        const buildingcheck = []
        const buildinglist = this.state.available_room.map((data, index) => {
            //return this.selectbuildroomcondition(buildingcheck,data.building_no,this.state.building_no,data.teach_day,data.morning,data.noon,data.evening)
            if (!buildingcheck.includes(data.building_no)) {
                if (this.state.yearsearch == data.year && this.state.semestersearch == data.semester && this.state.daysearch == data.teach_day) {

                    if (data.morning == 0 && this.state.starttime == "07:00") {
                        buildingcheck.push(data.building_no)
                        if (data.building_no == this.state.building_no) {
                            return <option value={data.building_no} selected>{data.building_no}</option>

                        }
                        return <option value={data.building_no}>{data.building_no}</option>
                    }
                    if (data.noon == 0 && this.state.starttime == "13:00") {
                        buildingcheck.push(data.building_no)
                        if (data.building_no == this.state.building_no) {
                            return <option value={data.building_no} selected>{data.building_no}</option>

                        }
                        return <option value={data.building_no}>{data.building_no}</option>
                    }
                    if (data.evening == 0 && this.state.starttime == "16:30") {
                        buildingcheck.push(data.building_no)
                        if (data.building_no == this.state.building_no) {
                            return <option value={data.building_no} selected>{data.building_no}</option>

                        }
                        return <option value={data.building_no}>{data.building_no}</option>
                    }

                }

            }
        })
        //console.log(buildinglist)
        const roomcheck = []

        const roomlist = this.state.available_room.map((data, index) => {

            if (this.state.building_no == data.building_no && this.state.yearsearch == data.year && this.state.semestersearch == data.semester && this.state.daysearch == data.teach_day) {

                if (!roomcheck.includes(data.room_no)) {

                    if (data.morning == 0 && this.state.starttime == "07:00") {
                        roomcheck.push(data.room_no)
                        if (data.room_no == this.state.room_no) {
                            return <option value={data.room_no} selected>{data.room_no}</option>
                        }
                        return <option value={data.room_no}>{data.room_no}</option>
                    }
                    if (data.noon == 0 && this.state.starttime == "13:00") {
                        roomcheck.push(data.room_no)
                        if (data.room_no == this.state.room_no) {
                            return <option value={data.room_no} selected>{data.room_no}</option>
                        }
                        return <option value={data.room_no}>{data.room_no}</option>
                    }
                    if (data.evening == 0 && this.state.starttime == "16:30") {
                        roomcheck.push(data.room_no)
                        if (data.room_no == this.state.room_no) {
                            return <option value={data.room_no} selected>{data.room_no}</option>
                        }
                        return <option value={data.room_no}>{data.room_no}</option>
                    }


                }

            }
        })
        //console.log(roomcheck)
        const item = this.state.name.filter((member, index) => {
            var teachtime = member.teach_time.split(/[- :]/);
            var searchtime = this.state.starttime.split(/[- :]/);

            if (this.state.yearsearch == null) {
                editjson.push(index)
                this.setState({ searchTime: "07:00", curr2search: "01", yearsearch: 2562, semestersearch: 1, daysearch: 1 })
                return member.curr2_id == "01" && member.year == 2562 && member.semester == 1 && member.teach_day == 1 && ((parseInt(teachtime[0]) >= 7 && parseInt(teachtime[0]) < 12) || parseInt(teachtime[0]) == 12 && parseInt(teachtime[1]) < 45)
            }

            else if ((member.curr2_id == this.state.curr2search) && (member.year == this.state.yearsearch) && (member.semester == this.state.semestersearch) && (member.teach_day == this.state.daysearch) && ((parseInt(searchtime[0]) == 7 && parseInt(teachtime[0]) < 12 && parseInt(teachtime[0]) >= 7) || (parseInt(searchtime[0]) == 7 && parseInt(teachtime[0]) == 12 && parseInt(teachtime[1]) < 45))) {
                editjson.push(index)

                return member
            }
            else if ((member.curr2_id == this.state.curr2search) && (member.year == this.state.yearsearch) && (member.semester == this.state.semestersearch) && (member.teach_day == this.state.daysearch) && ((parseInt(searchtime[0]) == 13 && parseInt(teachtime[0]) == 12 && parseInt(teachtime[1]) >= 45) || ((parseInt(teachtime[0]) >= 13 && parseInt(teachtime[0]) < 16 && parseInt(searchtime[0]) == 13)) || (parseInt(searchtime[0]) == 13 && parseInt(teachtime[0]) == 16 && parseInt(teachtime[1]) < 30))) {
                editjson.push(index)

                return member
            }
            else if ((member.curr2_id == this.state.curr2search) && (member.year == this.state.yearsearch) && (member.semester == this.state.semestersearch) && (member.teach_day == this.state.daysearch) && ((parseInt(teachtime[0]) > 16 && parseInt(searchtime[0]) == 16) || (parseInt(searchtime[0]) == 16 && parseInt(teachtime[0]) == 16 && parseInt(teachtime[1]) >= 30))) {
                editjson.push(index)
                return member
            }


        }).slice(this.state.firstitem, this.state.lastitem).map((data, index) => {
            if (this.state.editlist[index] == 1) {
                return (
                    <tr>
                        <td>{data.subject_id}</td>
                        <td>{data.subject_ename}</td>
                        <td>{data.section}</td>
                        <td>{data.teach_time.split(/[- :]/)[0]}:{data.teach_time.split(/[- :]/)[1]}-{data.teach_time2.split(/[- :]/)[0]}:{data.teach_time2.split(/[- :]/)[1]}</td>
                        <td>
                            <select onChange={(e) => this.handleChange_building_no(editjson[((this.state.pageclick - 1) * this.state.itemperpage) + index], e)}>
                                {
                                    buildinglist
                                }
                            </select>
                        </td>
                        <td>
                            <select onClick={(e) => this.handleChange_room_no(editjson[((this.state.pageclick - 1) * this.state.itemperpage) + index], e)}>
                                {
                                    roomlist
                                }
                            </select>

                        </td>
                        <td>{data.seat_num}</td>
                        <td>{data.studentnum}</td>
                        <td>
                            <Button variant="link" onClick={() => this.canceledit(index)}>ยกเลิก</Button>

                            <Button variant="primary" onClick={() => this.confirmedit(editjson[((this.state.pageclick - 1) * this.state.itemperpage) + index])} >ยืนยัน</Button>

                        </td>
                    </tr>

                )
            }
            else {
                return (
                    <tr>
                        <td>{data.subject_id}</td>
                        <td>{data.subject_ename}</td>
                        <td>{data.section}</td>
                        <td>{data.teach_time.split(/[- :]/)[0]}:{data.teach_time.split(/[- :]/)[1]}-{data.teach_time2.split(/[- :]/)[0]}:{data.teach_time2.split(/[- :]/)[1]}</td>
                        <td>{data.building_no}</td>
                        <td>{data.room_no}</td>
                        <td>{data.seat_num}</td>
                        <td>{data.studentnum}</td>
                        <td>
                            <Button variant="light" className="editdata" onClick={() => this.enableedit(index, data.building_no, data.room_no)}>
                                <img src={editbt} className="editicon" alt="edit" />
                            </Button>
                            <Button variant="light" className="deletedata" onClick={() => this.deletebt(data.building_no, data.room_no, editjson[((this.state.pageclick - 1) * this.state.itemperpage) + index])}>
                                <img src={deletebt} className="deleteicon" alt="delete" />
                            </Button>
                        </td>
                    </tr>

                )
            }

        }

        )

        let data_num = this.state.name.filter((member) => {
            var teachtime = member.teach_time.split(/[- :]/);
            var searchtime = this.state.starttime.split(/[- :]/);
            if (this.state.yearsearch == null) {

                this.setState({ starttime: "07:00", curr2search: "01", yearsearch: 2562, semestersearch: 1, daysearch: 1 })
                return member.curr2_id == "01" && member.year == 2562 && member.semester == 1 && member.teach_day == 1 && ((parseInt(teachtime[0]) >= 7 && parseInt(teachtime[0]) < 12) || parseInt(teachtime[0]) == 12 && parseInt(teachtime[1]) < 45)
            }

            else if ((member.curr2_id == this.state.curr2search) && (member.year == this.state.yearsearch) && (member.semester == this.state.semestersearch) && (member.teach_day == this.state.daysearch) && ((parseInt(searchtime[0]) == 7 && parseInt(teachtime[0]) < 12 && parseInt(teachtime[0]) >= 7) || (parseInt(searchtime[0]) == 7 && parseInt(teachtime[0]) == 12 && parseInt(teachtime[1]) < 45)))
                return member

            else if ((member.curr2_id == this.state.curr2search) && (member.year == this.state.yearsearch) && (member.semester == this.state.semestersearch) && (member.teach_day == this.state.daysearch) && ((parseInt(searchtime[0]) == 13 && parseInt(teachtime[0]) == 12 && parseInt(teachtime[1]) >= 45) || ((parseInt(teachtime[0]) >= 13 && parseInt(teachtime[0]) < 16 && parseInt(searchtime[0]) == 13)) || (parseInt(searchtime[0]) == 13 && parseInt(teachtime[0]) == 16 && parseInt(teachtime[1]) < 30)))
                return member
            else if ((member.curr2_id == this.state.curr2search) && (member.year == this.state.yearsearch) && (member.semester == this.state.semestersearch) && (member.teach_day == this.state.daysearch) && ((parseInt(teachtime[0]) > 16 && parseInt(searchtime[0]) == 16) || (parseInt(searchtime[0]) == 16 && parseInt(teachtime[0]) == 16 && parseInt(teachtime[1]) >= 30)))
                return member

        }).length


        const term_num = this.state.semester.map((member) => {
            if (member.year == this.state.yearsearch) {
                while (this.state.result.length) {
                    this.state.result.pop();
                }
                for (let number = 1; number <= member.semester; number++) {
                    this.state.result.push(number)
                }

            }
            return member
        })
        const semester = this.state.result.map((data, index) =>
            <option value={data}>{data}</option>
        )
        return (
            <div className="page-container" >
                <div className="content-wrap">

                    <Nav />
                    <h1 class="state">จัดห้องเรียน</h1>
                    <div id="detail">
                        <div className="filter">
                            <h5 className="yearDLfil">ปีการศึกษา</h5>
                            <select className="selectyearDL" onChange={(e) => this.searchYear(e)}>
                                {
                                    this.state.year.map((data, index) =>
                                        <option value={data.year}>{data.year}</option>
                                    )
                                }
                            </select>
                            <h5 className="termDLfil">ภาคเรียน</h5>
                            <select className="selecttermDL" onChange={(e) => this.searchSemester(e)}>
                                {
                                    semester
                                }
                            </select>
                        </div>
                        <div className="filter">
                            <h5 className="departManfil2">สาขาวิชา</h5>
                            <select className="selectdepart" onChange={(e) => this.searchCurr2(e)}>
                                {
                                    this.state.curr2.map((data, index) =>
                                        <option value={data.curr2_id}>{data.curr2_tname}</option>
                                    )
                                }
                            </select>

                        </div>
                        <div className="filter">
                            <h5 className="dayfil">วันที่เรียน</h5>
                            <select className="selectday" onChange={(e) => this.searchDay(e)}>
                                <option value="1">อาทิตย์</option>
                                <option value="2">จันทร์</option>
                                <option value="3">อังคาร</option>
                                <option value="4">พุธ</option>
                                <option value="5">พฤหัสบดี</option>
                                <option value="6">ศุกร์</option>
                                <option value="7">เสาร์</option>
                            </select>
                            <h5 className="periodTimefil">ช่วงเวลาที่เรียน</h5>
                            <select className="selectime" onChange={(e) => this.searchTime(e)}>
                                <option value="7:00">เช้า</option>
                                <option value="13:00">บ่าย</option>
                                <option value="16:30">ค่ำ</option>
                            </select>
                            <div id="ManageInbtn">
                                <Button variant="primary" className="ManageCrbtn" onClick={(e) => this.manageroom(e)}>จัดห้อง</Button>
                            </div>
                            <div >
                                <Button variant="primary" className="downloadbtn" onClick={() => this.downloadexcel()}>Download เอกสาร</Button>
                            </div>
                        </div>

                        <Table striped responsive className="Crtable">
                            <thead>
                                <tr className="ManageTable">
                                    <th>รหัสวิชา</th>
                                    <th>ชื่อวิชา</th>
                                    <th>กลุ่ม</th>
                                    <th>เวลาเรียน</th>
                                    <th>รหัสอาคาร</th>
                                    <th>ห้อง</th>
                                    <th>จำนวนที่นั่ง</th>
                                    <th>จำนวนนศ.</th>
                                    <th>แก้ไขข้อมูล</th>
                                </tr>
                            </thead>
                            <tbody>
                                {item}
                            </tbody>
                        </Table>
                        {/* <Button variant="light" className="adddata">
                            <img src={addbt} className="addicon" alt="add" />
                        </Button> */}
                        <Pagination
                            activePage={this.state.pageclick}
                            itemsCountPerPage={this.state.itemperpage}
                            totalItemsCount={data_num}
                            itemClass="page-item"
                            linkClass="page-link"
                            pageRangeDisplayed={5}
                            onChange={this.pageselectvalue}

                        />
                        {/* <p id="missclass">*วิชาที่จัดห้องเรียนไม่ได้ : 01066737 CONTROL VALVES</p> */}
                    </div>
                </div>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>คำเตือน</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>คุณแน่ใจหรือไม่ที่จะต้องการลบข้อมูลนี้</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            ยกเลิก
                        </Button>
                        <Button variant="primary" onClick={this.confirmdelete}>
                            ยืนยัน
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal size="sm" show={this.state.showsubmit} onHide={this.handleClosesubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Success</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>บันทึกข้อมูลสำเร็จ</Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>

                <Modal size="sm" show={this.state.showfailed} onHide={this.handleClosefailed}>
                    <Modal.Header closeButton>
                        <Modal.Title>Failed</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>บันทึกข้อมูลล้มเหลว</Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>

                <div className="footer">
                    <Foot />
                </div>
            </div>
        )

    }


}
