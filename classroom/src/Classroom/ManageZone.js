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
import './ManageZone.css'

export default class ManageZone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: [],
            pageclick: 1,
            itemperpage: 10,
            firstitem: null,
            lastitem: null,
            editlist: [],
            olddata: [],
            building: [],
            floornum: []
        }
        this.pageselect = this.pageselect.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);

        //edit data
        this.enableedit = this.enableedit.bind(this)
        this.canceledit = this.canceledit.bind(this)
        this.confirmedit = this.confirmedit.bind(this)
        this.handleChange_editbuilding_zone = this.handleChange_editbuilding_zone.bind(this)
        this.handleChange_editfloor_zone = this.handleChange_editfloor_zone.bind(this)
    }

    componentWillMount() {
        axios.get('http://localhost:7777/zonedata')
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
        axios.get('http://localhost:7777/building')
            .then(res => {
                this.setState({
                    building: res.data,
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
    pageselect(pageNumber) {
        let newId = this.state.editlist.slice()
        for (var i = 0; i < newId.length; i++) {
            if (newId[i] == 1) {
                newId[i] = 0
            }
        }
        this.setState({
            pageclick: pageNumber,
            firstitem: (this.state.itemperpage * pageNumber) - this.state.itemperpage,
            lastitem: (this.state.itemperpage * pageNumber),
            editlist: newId,
            name: JSON.parse(this.state.olddata),

        })
    }

    //edit data handle
    handleChange_editbuilding_zone(index, event) {
        const newIds = this.state.name //copy the array
        newIds[index].building_zone = event.target.value//execute the manipulations
        this.setState({ name: newIds }) //set the new state
    }
    handleChange_editfloor_zone(index, event) {
        //console.log(typeof(event))
        const newIds = this.state.name //copy the array
        newIds[index].floor_zone = event.target.value //execute the manipulation
        this.setState({ name: newIds }) //set the new state
    }

    //edit floornum if maxfloor < floorzone
    editfloor_zone(index, value) {
        //console.log(typeof(event))
        const newIds = this.state.name //copy the array
        newIds[index].floor_zone = value //execute the manipulation
        this.setState({ name: newIds }) //set the new state
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

    //confirm edit data sent to database
    confirmedit = (index) => {
        let olddata = JSON.parse(this.state.olddata)
        axios
            .put("http://localhost:7777/groupdata/update", {

                curr2_id: olddata[index].curr2_id,
                class: olddata[index].class,
                sec1: this.state.name[index].sec1,
                sec2: this.state.name[index].sec2,
            })
            .then(response => {
                console.log("response: ", response)

                // do something about response
            })
            .catch(err => {
                console.error(err)
            })
        window.location.reload(false);

    }

    //enable edit row
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

    render() {
        const item = this.state.name.filter((member) => {
            return member
        }).slice(this.state.firstitem, this.state.lastitem).map((data, index) => {
            var floor_num = 0

            if (this.state.editlist[index] == 1) {
                return (
                    <tr>
                        <td>{data.curr2_tname}</td>
                        <td>
                            <select class="form-control" onChange={(e) => this.handleChange_editbuilding_zone(((this.state.pageclick - 1) * this.state.itemperpage) + index, e)}>
                                {
                                    this.state.building.map((member) => {
                                        if (member.building_no == data.building_zone) {
                                            floor_num = member.floor_num
                                            return (<option value={member.building_no} selected  >{member.building_no}</option>)
                                        }
                                        else {
                                            return (<option value={member.building_no} >{member.building_no}</option>)
                                        }
                                    }
                                    )
                                }
                            </select>
                        </td>
                        <td>
                            <select class="form-control" onChange={(e) => this.handleChange_editfloor_zone(((this.state.pageclick - 1) * this.state.itemperpage) + index, e)}>
                                {

                                    this.state.building.map((member) => {
                                        if (member.building_no == data.building_zone) {
                                            var result = []
                                            if (floor_num < data.floor_zone) {
                                                this.editfloor_zone(((this.state.pageclick - 1) * this.state.itemperpage) + index, floor_num)
                                            }
                                            for (var i = 1; i <= floor_num; i++) {
                                                if (data.floor_zone == i) {
                                                    result.push(<option value={i} selected >{i}</option>)
                                                } else {
                                                    result.push(<option value={i} >{i}</option>)
                                                }
                                            }
                                            return (
                                                result
                                            )

                                        }
                                    }
                                    )
                                }
                            </select>
                        </td>
                        <td>
                            <Button variant="link" onClick={() => this.canceledit(index)}>ยกเลิก</Button>

                            <Button variant="primary" onClick={() => this.confirmedit(((this.state.pageclick - 1) * this.state.itemperpage) + index)} >ยืนยัน</Button>
                        </td>
                    </tr>

                )
            }
            else {
                return (<tr>
                    <td>{data.curr2_tname}</td>
                    <td>{data.building_zone}</td>
                    <td>{data.floor_zone}</td>
                    <td>
                        <Button variant="light" className="editdata" onClick={() => this.enableedit(index)}>
                            <img src={editbt} className="editicon" alt="edit" />
                        </Button>
                        <Button variant="light" className="deletedata">
                            <img src={deletebt} className="deleteicon" alt="delete" />
                        </Button>
                    </td>
                </tr>
                )


            }
        }
        )

        let data_num = this.state.name.filter((member) => {
            return member
        }).length


        return (
            <div className="page-container" >
                <div className="content-wrap">

                    <Nav />
                    <h1 class="state">แบ่งโซนห้องเรียนแต่ละภาควิชา</h1>
                    <div id="detail">
                        <Table striped responsive className="Crtable">
                            <thead>
                                <tr className="ManZoneTable">
                                    <th>สาขาวิชา</th>
                                    <th>อาคารเรียน</th>
                                    <th>ชั้น</th>
                                    <th>แก้ไขข้อมูล</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    item
                                }
                            </tbody>
                        </Table>
                        <Button variant="light" className="adddata">
                            <img src={addbt} className="addicon" alt="add" />
                        </Button>

                        <Pagination
                            activePage={this.state.pageclick}
                            itemsCountPerPage={this.state.itemperpage}
                            totalItemsCount={data_num}
                            itemClass="page-item"
                            linkClass="page-link"
                            pageRangeDisplayed={5}
                            onChange={this.pageselect}

                        />
                    </div>
                </div>
                <div className="footer">
                    <Foot />
                </div>
            </div>
        );
    }
}

