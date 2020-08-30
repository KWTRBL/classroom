import React from 'react';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import addbt from './icon/plus.png';
import Foot from '../Navbar/FooterCr'
import axios from 'axios';
import { Component } from 'react';
import { json } from 'body-parser';
import './ClassroomData.css';
import Modal from 'react-bootstrap/Modal'

import Pagination from "react-js-pagination";

export default class ClassroomData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: [],
            building: [],
            result: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            search: null,
            floor_no: null,
            pageclick: 1,
            itemperpage: 10,
            firstitem: null,
            lastitem: null,
            show: false,
            showsubmit: false,
            showfailed: false,
            rows: null,
            room_no_data: null,
            building_no: null,
            building_name: null,
            room_no: null,
            seat_num: null,
            room_status: 1,
            editlist: [],
            olddata: []
        }
        this.pageselectvalue = this.pageselectvalue.bind(this)
        this.componentWillMount = this.componentWillMount.bind(this);
        //delete row
        this.deletebt = this.deletebt.bind(this)
        this.confirmdelete = this.confirmdelete.bind(this);

        //modal
        this.handleClose = this.handleClose.bind(this);
        this.handleClosesubmit = this.handleClosesubmit.bind(this);
        this.handleClosefailed = this.handleClosefailed.bind(this);

        //add row
        this.addrow = this.addrow.bind(this);
        this.handleChange_room_no = this.handleChange_room_no.bind(this)
        this.handleChange_seatnum = this.handleChange_seatnum.bind(this)
        this.handleChange_room_status = this.handleChange_room_status.bind(this)

        //edit data
        this.enableedit = this.enableedit.bind(this)
        this.canceledit = this.canceledit.bind(this)
        this.confirmedit = this.confirmedit.bind(this)
        this.handleChange_editroom_no = this.handleChange_editroom_no.bind(this)
        this.handleChange_editseat_num = this.handleChange_editseat_num.bind(this)
        this.handleChange_editroom_status = this.handleChange_editroom_status.bind(this)

    }

    componentWillMount() {
        axios.get('http://localhost:7777/classroom')
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
                res.data.map((data, index) => {
                    if (data.building_no == "CCA") {
                        this.setState({ building_name: data.building_name })
                    }
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
    searchSpace = (event) => {
        let keyword = event.target.value;
        let newId = this.state.editlist.slice()
        for (var i = 0; i < newId.length; i++) {
            if (newId[i] == 1) {
                newId[i] = 0
            }
        }
        this.setState({
            search: keyword, building_no: keyword,
            editlist: newId,
            name: JSON.parse(this.state.olddata),
        })
        this.delrow()
        this.state.building.map((data, index) => {
            if (data.building_no == keyword) {
                this.setState({ building_name: data.building_name })
            }
        }
        )
        this.pageselectvalue(1)
    }
    searchSpace1 = (event) => {
        let keyword = event.target.value;
        let newId = this.state.editlist.slice()
        for (var i = 0; i < newId.length; i++) {
            if (newId[i] == 1) {
                newId[i] = 0
            }
        }
        this.setState({
            floor_no: keyword, pageclick: 1,
            editlist: newId,
            name: JSON.parse(this.state.olddata),
        })
        this.pageselectvalue(1)

    }



    pageselectvalue(value) {
        let newId = this.state.editlist.slice()
        for (var i = 0; i < newId.length; i++) {
            if (newId[i] == 1) {
                newId[i] = 0
            }
        }
        this.setState({
            pageclick: parseInt(value),
            firstitem: (this.state.itemperpage * parseInt(value)) - this.state.itemperpage,
            lastitem: (this.state.itemperpage * parseInt(value)),
            editlist: newId,
            name: JSON.parse(this.state.olddata),

        })
    }

    //handle modal
    handleClose() {
        this.setState({
            show: false
        })
    }
    handleClosesubmit() {

        this.setState({
            showsubmit: false
        })
        window.location.reload(false);
    }

    handleClosefailed() {
        this.setState({
            showfailed: false
        })
        window.location.reload(false);

    }

    //delete row button 
    deletebt = (data) => {
        this.setState({
            show: true,
            room_no: data
        })
    }

    //confirm delete row in table function
    confirmdelete() {
        axios
            .delete("http://localhost:7777/classroom/delete", { data: { room_no: this.state.room_no } })
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

    //handle addrow data 
    handleChange_room_no(event) {
        this.setState({ room_no_data: event.target.value })
    }
    handleChange_seatnum(event) {
        this.setState({ seat_num: event.target.value })
    }
    async handleChange_room_status(event) {
        await this.setState({ room_status: event.target.checked })
        await this.addrow()
    }

    //show row input for insert
    addrow = () => {
        this.setState({
            rows: <tr>
                <td>{this.state.building_no}</td>
                <td>
                    {this.state.building_name}
                </td>
                <td>
                    <input
                        value={this.state.room_no_data}
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput"
                        onChange={this.handleChange_room_no}
                    />
                </td>
                <td>
                    <input
                        value={this.state.seat_num}
                        type="number"
                        className="form-control"
                        id="formGroupExampleInput"
                        onChange={this.handleChange_seatnum}
                        min="0"
                        pattern="0-9"
                    />
                </td>
                <td>
                    <Form>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label=""
                            checked={this.state.room_status}
                            onClick={this.handleChange_room_status}
                        />
                    </Form>
                </td>
                <td>
                    <Button variant="link" onClick={() => this.delrow()}>ยกเลิก</Button>
                    <Button variant="primary" onClick={() => this.confirmdata()} >ยืนยัน</Button>
                </td>
            </tr>
        })
    }

    //delete row input
    delrow = () => {
        this.setState({
            rows: null,
            room_no_data: null,
            seat_num: null,
            room_status: null
        })
        this.state.building.map((data, index) => {
            if (data.building_no == "CCA") {
                this.setState({ building_name: data.building_name })
            }
        })
    }
    //insert row confirm
    confirmdata = () => {
        axios
            .post("http://localhost:7777/classroom/insert", {
                data: {
                    building_no: this.state.building_no,
                    room_no: this.state.room_no_data,
                    room_name: this.state.room_no_data,
                    seat_num: this.state.seat_num,
                    room_status: this.state.room_status,
                    room_floor: this.state.floor_no
                }
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
    //edit data handle
    handleChange_editroom_no(index, event) {
        const newIds = this.state.name //copy the array
        newIds[index].room_no = event.target.value//execute the manipulations
        this.setState({ name: newIds }) //set the new state
    }
    handleChange_editseat_num(index, event) {
        const newIds = this.state.name //copy the array
        newIds[index].seat_num = event.target.value //execute the manipulations
        this.setState({ name: newIds }) //set the new state
        //this.setState({ building_name: event.target.value })
    }
    async handleChange_editroom_status(index, event) {
        const newIds = this.state.name //copy the array
        newIds[index].room_status = event.target.checked//execute the manipulations
        await this.setState({ name: newIds }) //set the new state
        await this.enableedit(index)

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
            .put("http://localhost:7777/classroom/update", {

                room_no: this.state.name[index].room_no,
                room_name: this.state.name[index].room_no,
                seat_num: this.state.name[index].seat_num,
                room_status: this.state.name[index].room_status,
                room_no_select: olddata[index].room_no,
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
        var editjson = []
        const item = this.state.name.filter((member, index) => {
            if (this.state.search == null) {

                this.setState({ search: "CCA", floor_no: 1, building_no: "CCA" })
                if (member.building_no == "CCA" && (member.room_floor == "1")) {
                    editjson.push(index)
                    console.log(editjson)
                }

                return member.building_no == "CCA" && (member.room_floor == "1")
            }
            else if ((member.building_no == this.state.search) && (member.room_floor == this.state.floor_no)) {
                editjson.push(index)
                console.log(editjson)
                return member
            }
        }).slice(this.state.firstitem, this.state.lastitem).map((data, index) => {
            if (this.state.editlist[index] == 1) {
                return (

                    <tr>
                        <td>{data.building_no}</td>
                        <td>{data.building_name}</td>
                        <td>
                            <input
                                value={data.room_no}
                                type="text"
                                className="form-control"
                                id="formGroupExampleInput"
                                onChange={(e) => this.handleChange_editroom_no(editjson[index], e)}
                            />
                        </td>
                        <td>
                            <input
                                value={data.seat_num}
                                type="number"
                                className="form-control"
                                id="formGroupExampleInput"
                                min="0"
                                onChange={(e) => this.handleChange_editseat_num(editjson[index], e)}
                            /></td>
                        <td>
                            <Form>
                                <Form.Check
                                    type="switch"
                                    id={data.building_name}                                    
                                    label=""
                                    checked={data.room_status}
                                    onClick={(e) => this.handleChange_editroom_status(editjson[index], e)}
                                />
                            </Form>
                        </td>
                        <td>
                            <Button variant="link" onClick={() => this.canceledit(index)}>ยกเลิก</Button>

                            <Button variant="primary" onClick={() => this.confirmedit(editjson[index])} >ยืนยัน</Button>
                        </td>
                    </tr>

                )
            } else {
                return (
                    <tr>
                        <td>{data.building_no}</td>
                        <td>{data.building_name}</td>
                        <td>{data.room_no}</td>
                        <td>{data.seat_num}</td>
                        <td>
                            <Form>
                                <Form.Check
                                    disabled
                                    type="switch"
                                    id="custom-switch2"
                                    label=""
                                    checked={data.room_status}
                                />
                            </Form>
                        </td>
                        <td>
                            <Button variant="light" className="editdata" onClick={() => this.enableedit(index)}>
                                <img src={editbt} className="editicon" alt="edit" />
                            </Button>
                            <Button variant="light" className="deletedata" onClick={() => this.deletebt(data.room_no)}>
                                <img src={deletebt} className="deleteicon" alt="delete" />
                            </Button>
                        </td>
                    </tr>

                )
            }

        }
        )

        let data_num = this.state.name.filter((member) => {
            if (this.state.search == null)
                return member.building_no == "ECC" && (member.room_floor == "1")
            else if ((member.building_no == this.state.search) && (member.room_floor == this.state.floor_no))
                return member
        }).length



        const floor_num = this.state.building.filter((member) => {
            if (member.building_no == this.state.search) {
                while (this.state.result.length) {
                    this.state.result.pop();
                }
                for (let i = 1; i <= member.floor_num; i++) {

                    this.state.result.push(i)
                }
                return member
            }
        })

        const test = this.state.result.map((data, index) =>
            <option value={data}>{data}</option>
        )



        return (
            <div >
                <Nav />
                <h1 class="state">ข้อมูลห้องเรียน</h1>
                <div id="detail">
                    <div className="filterCrData">
                        <h5 className="buildfil1">อาคารเรียน</h5>
                        <div className="buildfildetail1">
                            <select id="building" onChange={(e) => this.searchSpace(e)} >
                                {
                                    this.state.building.map((data, index) =>
                                        <option value={data.building_no}>{data.building_name}</option>
                                    )
                                }
                            </select>
                        </div>
                        <h5 className="buildfil2">ชั้น</h5>
                        <div className="buildfildetail2">
                            <select id="floor_num" onChange={(e) => this.searchSpace1(e)}>
                                {
                                    test
                                }
                            </select>
                        </div>
                    </div>

                    <Table striped responsive className="Crtable">
                        <thead>
                            <tr className="Classroomtable">
                                <th>รหัสอาคาร</th>
                                <th>อาคารเรียน</th>
                                <th>รหัสห้อง</th>
                                <th>จำนวนที่นั่ง</th>
                                <th>สถานะ</th>
                                <th>แก้ไขข้อมูล</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                item
                            }
                            {this.state.rows}
                        </tbody>
                    </Table>
                    <Button variant="light" className="adddata" onClick={() => this.addrow()}>
                        <img src={addbt} className="addicon" alt="add" />
                    </Button>
                    <Pagination
                        activePage={this.state.pageclick}
                        itemsCountPerPage={this.state.itemperpage}
                        totalItemsCount={data_num}
                        itemClass="page-item"
                        linkClass="page-link"
                        pageRangeDisplayed={5}
                        onChange={this.pageselectvalue}

                    />
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
        );
    }

}



