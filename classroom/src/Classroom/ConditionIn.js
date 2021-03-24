import { Component } from 'react';
//import React, { useState } from 'react';
//import Calendar from 'react-calendar';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavIn'
import Foot from '../Navbar/FooterCr'
import Table from 'react-bootstrap/Table';
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import React from 'react';
import addbt from './icon/plus.png';
import Modal from 'react-bootstrap/Modal'
import axios from 'axios';

import './ConditionIn.css'
export default class ConditionIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stdnum: null,
            oldstdnum: null,
            editstdnum: false,
            stdnummodal: false,
            examweek: [],
            editlist: [],
            olddata: [],
            year: [],
            semester: [],
            result: [],
            searchYear: null,
            searchTerm: null,
            searchPart: 'M',
            editweek1: false,
            editweek2: false,
            editweek3: false,
            editweek4: false,
        }

        this.handleChange_stdnum = this.handleChange_stdnum.bind(this)
        //edit week1
        this.handleChange_week1_start = this.handleChange_week1_start.bind(this)
        this.handleChange_week1_end = this.handleChange_week1_end.bind(this)
        //edit week2
        this.handleChange_week2_start = this.handleChange_week2_start.bind(this)
        this.handleChange_week2_end = this.handleChange_week2_end.bind(this)
        //edit week3
        this.handleChange_week3_start = this.handleChange_week3_start.bind(this)
        this.handleChange_week3_end = this.handleChange_week3_end.bind(this)
        //edit week4
        this.handleChange_week4_start = this.handleChange_week4_start.bind(this)
        this.handleChange_week4_end = this.handleChange_week4_end.bind(this)
    }

    componentWillMount() {
        axios.get('http://localhost:7777/facultycondition')
            .then(res => {

                this.setState({
                    stdnum: res.data[0].committee_per_student,
                    oldstdnum: res.data[0].committee_per_student
                })

            })
            .catch(function (error) {
                console.log(error);
            })

        axios.get('http://localhost:7777/examweek')
            .then(res => {
                const newIds = this.state.editlist.slice()
                for (var i = 0; i < res.data.length; i++) {
                    newIds.push(0)
                }

                this.setState({
                    examweek: res.data,
                    editlist: newIds,
                    olddata: JSON.stringify(res.data)
                })

            })
            .catch(function (error) {
                console.log(error);
            })

        axios.get('http://localhost:7777/yeardata')
            .then(res => {
                this.setState({
                    year: res.data,
                    searchYear: res.data[0].year
                })

            })
            .catch(function (error) {
                console.log(error);
            })

        axios.get('http://localhost:7777/semesterdata')
            .then(res => {
                this.setState({
                    semester: res.data,
                    searchTerm: 1
                })
            })
            .catch(function (error) {
                console.log(error);
            })


    }

    handleChange_stdnum = (event) => {
        var value = event.target.value
        this.setState({
            stdnum: value
        })

    }
    //edit week1
    handleChange_week1_start = (event) => {
        const value = new Date(event.target.value).toISOString().substring(0, 10)
        this.setState({
            week1_start: value.substring(0, 10)
        })
    }
    handleChange_week1_end = (event) => {
        const value = new Date(event.target.value).toISOString().substring(0, 10)
        this.setState({
            week1_end: value.substring(0, 10)
        })
    }
    // componentDidUpdate() {
    //     console.log(this.state.week1_start)
    //     console.log(this.state.week1_end)
    // }
    //edit week2
    handleChange_week2_start = (event) => {
        const value = new Date(event.target.value).toISOString().substring(0, 10)
        this.setState({
            week2_start: value.substring(0, 10)
        })
    }
    handleChange_week2_end = (event) => {
        const value = new Date(event.target.value).toISOString().substring(0, 10)
        this.setState({
            week2_end: value.substring(0, 10)
        })
    }

    //edit week3
    handleChange_week3_start = (event) => {
        const value = new Date(event.target.value).toISOString().substring(0, 10)
        this.setState({
            week3_start: value.substring(0, 10)
        })
    }
    handleChange_week3_end = (event) => {
        const value = new Date(event.target.value).toISOString().substring(0, 10)
        this.setState({
            week3_end: value.substring(0, 10)
        })
    }

    //edit week4
    handleChange_week4_start = (event) => {
        const value = new Date(event.target.value).toISOString().substring(0, 10)
        this.setState({
            week4_start: value.substring(0, 10)
        })
    }
    handleChange_week4_end = (event) => {
        const value = new Date(event.target.value).toISOString().substring(0, 10)
        this.setState({
            week4_end: value.substring(0, 10)
        })
    }


    searchYear = (event) => {

        let keyword = event.target.value;
        let newId = this.state.editlist.slice()
        for (var i = 0; i < newId.length; i++) {
            if (newId[i] == 1) {
                newId[i] = 0
            }
        }
        this.setState({
            searchYear: keyword,
            editlist: newId,
            examweek: JSON.parse(this.state.olddata)
        })

    }



    searchTerm = (event) => {

        let newId = this.state.editlist.slice()
        for (var i = 0; i < newId.length; i++) {
            if (newId[i] == 1) {
                newId[i] = 0
            }
        }
        let keyword = event.target.value;
        this.setState({
            searchTerm: keyword,
            editlist: newId,
            examweek: JSON.parse(this.state.olddata)
        })


    }

    searchPart = (event) => {
        let newId = this.state.editlist.slice()
        for (var i = 0; i < newId.length; i++) {
            if (newId[i] == 1) {
                newId[i] = 0
            }
        }
        let keyword = event.target.value;
        this.setState({
            searchPart: keyword,
            editlist: newId,
            examweek: JSON.parse(this.state.olddata)
        })
    }


    enable_stdnumedit = () => {
        document.getElementById("stdcount").style.width = "250px";
        this.setState({
            editstdnum: true
        })

    }

    disable_stdnumedit = () => {
        document.getElementById("stdcount").style.width = "150px";
        this.setState({
            editstdnum: false,
            stdnum: this.state.oldstdnum
        })

    }
    confirm_stdnumedit = (value) => {
        var data = parseInt(value);
        if (data < 2) {
            alert('กรุณาใส่ข้อมูลที่มีค่าเท่ากับหรือมากกว่า 2')
        } else {
            axios
                .post("http://localhost:7777/facultycondition/update", {

                    committee_per_student: this.state.stdnum
                })
                .then(response => {
                    console.log("response: ", response)
                })
                .catch(err => {
                    console.error(err)
                })
            window.location.reload(false);
        }

    }
    //edit week1
    enable_week1edit = () => {

        this.setState({
            editweek1: true
        })

    }

    disable_week1edit = () => {

        this.setState({
            editweek1: false,

        })

    }
    confirm_week1edit = () => {
        //console.log(this.state.week1_start)
        if (this.state.week1_start != null) {
            axios
                .post("http://localhost:7777/facultycondition/updateweek1", {
                    week1_start: this.state.week1_start,
                    year: this.state.searchYear,
                    semester: this.state.searchTerm,
                    mid_or_final: this.state.searchPart,
                })
                .then(response => {
                    console.log("response: ", response)
                })
                .catch(err => {
                    console.error(err)
                })

        }
        if (this.state.week1_end != null) {
            axios
                .post("http://localhost:7777/facultycondition/updateweek1_end", {
                    year: this.state.searchYear,
                    semester: this.state.searchTerm,
                    mid_or_final: this.state.searchPart,
                    week1_end: this.state.week1_end
                })
                .then(response => {
                    console.log("response: ", response)
                })
                .catch(err => {
                    console.error(err)
                })

        }
        window.location.reload(false);
    }
    //edit week2
    enable_week2edit = () => {

        this.setState({
            editweek2: true
        })

    }

    disable_week2edit = () => {

        this.setState({
            editweek2: false,

        })

    }
    confirm_week2edit = () => {
        //console.log(this.state.week1_start)
        if (this.state.week2_start != null) {
            axios
                .post("http://localhost:7777/facultycondition/updateweek2", {
                    week2_start: this.state.week2_start,
                    year: this.state.searchYear,
                    semester: this.state.searchTerm,
                    mid_or_final: this.state.searchPart,
                })
                .then(response => {
                    console.log("response: ", response)
                })
                .catch(err => {
                    console.error(err)
                })

        }
        if (this.state.week2_end != null) {
            axios
                .post("http://localhost:7777/facultycondition/updateweek2_end", {
                    year: this.state.searchYear,
                    semester: this.state.searchTerm,
                    mid_or_final: this.state.searchPart,
                    week2_end: this.state.week2_end
                })
                .then(response => {
                    console.log("response: ", response)
                })
                .catch(err => {
                    console.error(err)
                })

        }
        window.location.reload(false);
    }
    //edit week3
    enable_week3edit = () => {

        this.setState({
            editweek3: true
        })

    }

    disable_week3edit = () => {

        this.setState({
            editweek3: false,

        })

    }
    confirm_week3edit = () => {
        //console.log(this.state.week1_start)
        if (this.state.week3_start != null) {
            axios
                .post("http://localhost:7777/facultycondition/updateweek3", {
                    week3_start: this.state.week3_start,
                    year: this.state.searchYear,
                    semester: this.state.searchTerm,
                    mid_or_final: this.state.searchPart,
                })
                .then(response => {
                    console.log("response: ", response)
                })
                .catch(err => {
                    console.error(err)
                })

        }
        if (this.state.week3_end != null) {
            axios
                .post("http://localhost:7777/facultycondition/updateweek3_end", {
                    year: this.state.searchYear,
                    semester: this.state.searchTerm,
                    mid_or_final: this.state.searchPart,
                    week3_end: this.state.week3_end
                })
                .then(response => {
                    console.log("response: ", response)
                })
                .catch(err => {
                    console.error(err)
                })

        }
        window.location.reload(false);
    }
    //edit week4
    enable_week4edit = () => {

        this.setState({
            editweek4: true
        })

    }

    disable_week4edit = () => {

        this.setState({
            editweek4: false,

        })

    }
    confirm_week4edit = () => {
        //console.log(this.state.week1_start)
        if (this.state.week4_start != null) {
            axios
                .post("http://localhost:7777/facultycondition/updateweek4", {
                    week4_start: this.state.week4_start,
                    year: this.state.searchYear,
                    semester: this.state.searchTerm,
                    mid_or_final: this.state.searchPart,
                })
                .then(response => {
                    console.log("response: ", response)
                })
                .catch(err => {
                    console.error(err)
                })

        }
        if (this.state.week4_end != null) {
            axios
                .post("http://localhost:7777/facultycondition/updateweek4_end", {
                    year: this.state.searchYear,
                    semester: this.state.searchTerm,
                    mid_or_final: this.state.searchPart,
                    week4_end: this.state.week4_end
                })
                .then(response => {
                    console.log("response: ", response)
                })
                .catch(err => {
                    console.error(err)
                })

        }
        window.location.reload(false);
    }

    deldata_modalclose = () => {
        this.setState({
            stdnummodal: false
        })
        this.disable_stdnumedit()
    }
    render() {
        const term_num = this.state.semester.map((member) => {

            if (member.year == this.state.searchYear) {
                while (this.state.result.length) {
                    this.state.result.pop();
                }
                for (let number = 1; number <= member.semester; number++) {
                    //console.log(number)
                    this.state.result.push(number)
                }

            }
            return member
        })

        const semester = this.state.result.map((data, index) =>
            <option value={data}>{data}</option>
        )

        const tabledata = this.state.examweek.map((data) => {
            //edit week1
            if (this.state.editweek1 == true) {
                if (this.state.searchYear == data.year && this.state.searchTerm == data.semester && this.state.searchPart == data.mid_or_final)
                    return (
                        <tbody>
                            <tr>
                                <td>{1}</td>
                                <td>
                                    <input
                                        defaultValue={data.week1_start.substring(0, 10)}
                                        value={this.state.week1_start}
                                        type="date"
                                        className="form-control"
                                        id="formGroupExampleInput"
                                        onChange={this.handleChange_week1_start}
                                    />
                                </td>
                                <td>
                                    <input
                                        defaultValue={data.week1_end.substring(0, 10)}
                                        value={this.state.week1_end}
                                        type="date"
                                        className="form-control"
                                        id="formGroupExampleInput"
                                        onChange={this.handleChange_week1_end}
                                    />
                                </td>
                                <td>
                                    <Button variant="link" onClick={() => this.disable_week1edit()}>ยกเลิก</Button>

                                    <Button variant="primary" onClick={() => this.confirm_week1edit()} >ยืนยัน</Button>
                                </td>
                            </tr>
                            <tr>
                                <td>{2}</td>
                                <td>{data.week2_start.substring(8, 10) + '-' + data.week2_start.substring(5, 7) + '-' + data.week2_start.substring(0, 4)}</td>
                                <td>{data.week2_end.substring(8, 10) + '-' + data.week2_end.substring(5, 7) + '-' + data.week2_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata" >
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td>{3}</td>
                                <td>{data.week3_start.substring(8, 10) + '-' + data.week3_start.substring(5, 7) + '-' + data.week3_start.substring(0, 4)}</td>
                                <td>{data.week3_end.substring(8, 10) + '-' + data.week3_end.substring(5, 7) + '-' + data.week3_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata" >
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td>{4}</td>
                                <td>{data.week4_start.substring(8, 10) + '-' + data.week4_start.substring(5, 7) + '-' + data.week4_start.substring(0, 4)}</td>
                                <td>{data.week4_end.substring(8, 10) + '-' + data.week4_end.substring(5, 7) + '-' + data.week4_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata" >
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                            </tr>

                        </tbody>


                    )
            }
            //edit week2
            if (this.state.editweek2 == true) {
                if (this.state.searchYear == data.year && this.state.searchTerm == data.semester && this.state.searchPart == data.mid_or_final)
                    return (
                        <tbody>
                            <tr>
                                <td>{1}</td>
                                <td>{data.week1_start.substring(8, 10) + '-' + data.week1_start.substring(5, 7) + '-' + data.week1_start.substring(0, 4)}
                                </td>
                                <td>{data.week1_end.substring(8, 10) + '-' + data.week1_end.substring(5, 7) + '-' + data.week1_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata">
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                            </tr>
                            <tr>

                                <td>{2}</td>
                                <td>
                                    <input
                                        defaultValue={data.week2_start.substring(0, 10)}
                                        value={this.state.week2_start}
                                        type="date"
                                        className="form-control"
                                        id="formGroupExampleInput"
                                        onChange={this.handleChange_week2_start}
                                    />
                                </td>
                                <td>
                                    <input
                                        defaultValue={data.week2_end.substring(0, 10)}
                                        value={this.state.week2_end}
                                        type="date"
                                        className="form-control"
                                        id="formGroupExampleInput"
                                        onChange={this.handleChange_week2_end}
                                    />
                                </td>
                                <td>
                                    <Button variant="link" onClick={() => this.disable_week2edit()}>ยกเลิก</Button>

                                    <Button variant="primary" onClick={() => this.confirm_week2edit()} >ยืนยัน</Button>
                                </td>

                            </tr>
                            <tr>
                                <td>{3}</td>
                                <td>{data.week3_start.substring(8, 10) + '-' + data.week3_start.substring(5, 7) + '-' + data.week3_start.substring(0, 4)}</td>
                                <td>{data.week3_end.substring(8, 10) + '-' + data.week3_end.substring(5, 7) + '-' + data.week3_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata" >
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td>{4}</td>
                                <td>{data.week4_start.substring(8, 10) + '-' + data.week4_start.substring(5, 7) + '-' + data.week4_start.substring(0, 4)}</td>
                                <td>{data.week4_end.substring(8, 10) + '-' + data.week4_end.substring(5, 7) + '-' + data.week4_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata" >
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                            </tr>

                        </tbody>


                    )
            }
            //edit week3
            if (this.state.editweek3 == true) {
                if (this.state.searchYear == data.year && this.state.searchTerm == data.semester && this.state.searchPart == data.mid_or_final)
                    return (
                        <tbody>
                            <tr>
                                <td>{1}</td>
                                <td>{data.week1_start.substring(8, 10) + '-' + data.week1_start.substring(5, 7) + '-' + data.week1_start.substring(0, 4)}
                                </td>
                                <td>{data.week1_end.substring(8, 10) + '-' + data.week1_end.substring(5, 7) + '-' + data.week1_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata">
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td>{2}</td>
                                <td>{data.week2_start.substring(8, 10) + '-' + data.week2_start.substring(5, 7) + '-' + data.week2_start.substring(0, 4)}</td>
                                <td>{data.week2_end.substring(8, 10) + '-' + data.week2_end.substring(5, 7) + '-' + data.week2_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata" onClick={this.enable_week2edit}>
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td>{3}</td>
                                <td>
                                    <input
                                        defaultValue={data.week3_start.substring(0, 10)}
                                        value={this.state.week3_start}
                                        type="date"
                                        className="form-control"
                                        id="formGroupExampleInput"
                                        onChange={this.handleChange_week3_start}
                                    />
                                </td>
                                <td>
                                    <input
                                        defaultValue={data.week3_end.substring(0, 10)}
                                        value={this.state.week3_end}
                                        type="date"
                                        className="form-control"
                                        id="formGroupExampleInput"
                                        onChange={this.handleChange_week3_end}
                                    />
                                </td>
                                <td>
                                    <Button variant="link" onClick={() => this.disable_week3edit()}>ยกเลิก</Button>

                                    <Button variant="primary" onClick={() => this.confirm_week3edit()} >ยืนยัน</Button>
                                </td>

                            </tr>
                            <tr>
                                <td>{4}</td>
                                <td>{data.week4_start.substring(8, 10) + '-' + data.week4_start.substring(5, 7) + '-' + data.week4_start.substring(0, 4)}</td>
                                <td>{data.week4_end.substring(8, 10) + '-' + data.week4_end.substring(5, 7) + '-' + data.week4_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata" >
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                            </tr>

                        </tbody>


                    )
            }
            //edit week4
            if (this.state.editweek4 == true) {
                if (this.state.searchYear == data.year && this.state.searchTerm == data.semester && this.state.searchPart == data.mid_or_final)
                    return (
                        <tbody>
                            <tr>
                                <td>{1}</td>
                                <td>{data.week1_start.substring(8, 10) + '-' + data.week1_start.substring(5, 7) + '-' + data.week1_start.substring(0, 4)}
                                </td>
                                <td>{data.week1_end.substring(8, 10) + '-' + data.week1_end.substring(5, 7) + '-' + data.week1_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata">
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td>{2}</td>
                                <td>{data.week2_start.substring(8, 10) + '-' + data.week2_start.substring(5, 7) + '-' + data.week2_start.substring(0, 4)}</td>
                                <td>{data.week2_end.substring(8, 10) + '-' + data.week2_end.substring(5, 7) + '-' + data.week2_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata" onClick={this.enable_week2edit}>
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td>{3}</td>
                                <td>{data.week3_start.substring(8, 10) + '-' + data.week3_start.substring(5, 7) + '-' + data.week3_start.substring(0, 4)}</td>
                                <td>{data.week3_end.substring(8, 10) + '-' + data.week3_end.substring(5, 7) + '-' + data.week3_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata" onClick={this.enable_week3edit}>
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>

                            </tr>
                            <tr>
                                <td>{4}</td>
                                <td>
                                    <input
                                        defaultValue={data.week4_start.substring(0, 10)}
                                        value={this.state.week4_start}
                                        type="date"
                                        className="form-control"
                                        id="formGroupExampleInput"
                                        onChange={this.handleChange_week4_start}
                                    />
                                </td>
                                <td>
                                    <input
                                        defaultValue={data.week4_end.substring(0, 10)}
                                        value={this.state.week4_end}
                                        type="date"
                                        className="form-control"
                                        id="formGroupExampleInput"
                                        onChange={this.handleChange_week4_end}
                                    />
                                </td>
                                <td>
                                    <Button variant="link" onClick={() => this.disable_week4edit()}>ยกเลิก</Button>

                                    <Button variant="primary" onClick={() => this.confirm_week4edit()} >ยืนยัน</Button>
                                </td>
                            </tr>

                        </tbody>


                    )
            }
            else {
                if (this.state.searchYear == data.year && this.state.searchTerm == data.semester && this.state.searchPart == data.mid_or_final) {
                    return (
                        <tbody>
                            <tr>
                                <td>{1}</td>
                                <td>{data.week1_start.substring(8, 10) + '-' + data.week1_start.substring(5, 7) + '-' + data.week1_start.substring(0, 4)}
                                </td>
                                <td>{data.week1_end.substring(8, 10) + '-' + data.week1_end.substring(5, 7) + '-' + data.week1_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata" onClick={this.enable_week1edit}>
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td>{2}</td>
                                <td>{data.week2_start.substring(8, 10) + '-' + data.week2_start.substring(5, 7) + '-' + data.week2_start.substring(0, 4)}</td>
                                <td>{data.week2_end.substring(8, 10) + '-' + data.week2_end.substring(5, 7) + '-' + data.week2_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata" onClick={this.enable_week2edit}>
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td>{3}</td>
                                <td>{data.week3_start.substring(8, 10) + '-' + data.week3_start.substring(5, 7) + '-' + data.week3_start.substring(0, 4)}</td>
                                <td>{data.week3_end.substring(8, 10) + '-' + data.week3_end.substring(5, 7) + '-' + data.week3_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata" onClick={this.enable_week3edit}>
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td>{4}</td>
                                <td>{data.week4_start.substring(8, 10) + '-' + data.week4_start.substring(5, 7) + '-' + data.week4_start.substring(0, 4)}</td>
                                <td>{data.week4_end.substring(8, 10) + '-' + data.week4_end.substring(5, 7) + '-' + data.week4_end.substring(0, 4)}</td>
                                <td>
                                    <Button variant="light" className="editdata" onClick={this.enable_week4edit}>
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                </td>
                            </tr>

                        </tbody>


                    )
                }
            }
        })
        return (
            <div className="page-container" >
                <div className="content-wrap">

                    <Nav />
                    <h1 class="state">กำหนดเงื่อนไขจำนวนกรรมการคุมสอบ</h1>
                    <div className="top">
                        <p>
                            <div className="topstdcount">
                                <div className="text">
                                    จำนวนกรรมการต่ำสุด 2 คนต่อห้อง   &emsp; จำนวนกรรมการ 1 คนต่อนักศึกษา

                            </div>
                                <div id="stdcount">
                                    <input
                                        value={this.state.stdnum}
                                        type="number"
                                        min="2"
                                        className="form-control textboxCon"
                                        id="formGroupExampleInput"
                                        onChange={this.handleChange_stdnum}
                                        disabled={!this.state.editstdnum}
                                    />
                                    <Button variant="light" className="editdata ConIn" onClick={this.enable_stdnumedit} hidden={this.state.editstdnum}>
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                    <Button variant="link" hidden={!this.state.editstdnum} onClick={() => this.disable_stdnumedit()}>ยกเลิก</Button>
                                    <Button variant="primary" hidden={!this.state.editstdnum} onClick={() => this.confirm_stdnumedit(this.state.stdnum)} >ยืนยัน</Button>
                                </div>
                            </div>

                        </p>


                    </div>
                    <br />
                    <hr />

                    <div id="detail">
                        <h1 class="state">กำหนดสัปดาห์การสอบ</h1>
                        <br />
                        <div className="filter">
                            <h5 className="yearConfil">ปีการศึกษา</h5>
                            <select className="selectyearCon" onChange={(e) => this.searchYear(e)}>
                                {
                                    this.state.year.map((data, index) =>
                                        <option value={data.year}>{data.year}</option>
                                    )
                                }
                            </select>
                            <h5 className="termConfil">ภาคการศึกษา</h5>
                            <select className="selecttermCon" onChange={(e) => this.searchTerm(e)}>
                                {semester}
                            </select>
                            <h5 className="partConfil">การสอบ</h5>
                            <select className="selectpartCon" onChange={(e) => this.searchPart(e)}>
                                <option value='M'>กลางภาค</option>
                                <option value='F'>ปลายภาค</option>
                            </select>
                        </div>
                        <Table striped responsive className="Crtable">
                            <thead>
                                <tr className="">
                                    <th>สัปดาห์ที่</th>
                                    <th>วันที่เริ่ม</th>
                                    <th>วันที่สิ้นสุด</th>
                                    <th>แก้ไขข้อมูล</th>
                                </tr>

                            </thead>

                            {tabledata}

                        </Table>

                    </div>
                </div>
                <Modal show={this.state.stdnummodal} onHide={this.deldata_modalclose}>
                    <Modal.Header closeButton>
                        <Modal.Title>คำเตือน</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>คุณแน่ใจหรือไม่ที่จะต้องการลบข้อมูลนี้</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.deldata_modalclose}>
                            ยกเลิก
                        </Button>
                        <Button variant="primary" onClick={this.deldata_modalclose}>
                            ยืนยัน
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="footer">
                    <Foot />
                </div>
            </div>
        )
    }


}