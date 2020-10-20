import { Component } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavIn'
import Foot from '../Navbar/FooterCr'
import Table from 'react-bootstrap/Table';
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import React from 'react';
import addbt from './icon/plus.png';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Pagination from "react-js-pagination";

import './InvigilatorData.css'
export default class FacultyData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            dept: [],
            teacher: [],
            deptid: null,
            editlist: [],
            olddata: [],
            pageclick: 1,
            itemperpage: 10,
            firstitem: null,
            lastitem: null,


        }
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.searchDept = this.searchDept.bind(this)
        this.pageselectvalue = this.pageselectvalue.bind(this);


    }
    componentWillMount() {
        axios.get('http://localhost:7777/department')
            .then(res => {

                this.setState({
                    dept: res.data,
                    deptid: res.data[0].dept_id,

                })

            })
            .catch(function (error) {
                console.log(error);
            })

        axios.get('http://localhost:7777/teacher')
            .then(res => {
                const newIds = this.state.editlist.slice()
                for (var i = 0; i < res.data.length; i++) {
                    newIds.push(0)
                }

                this.setState({
                    teacher: res.data,
                    editlist: newIds,
                    olddata: JSON.stringify(res.data)
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
            teacher: JSON.parse(this.state.olddata),

        })
    }

    searchDept = (event) => {
        let newId = this.state.editlist.slice()
        for (var i = 0; i < newId.length; i++) {
            if (newId[i] == 1) {
                newId[i] = 0
            }
        }
        let keyword = event.target.value;
        this.setState({
            deptid: keyword,
            editlist: newId,
            teacher: JSON.parse(this.state.olddata)
        })
        this.pageselectvalue(1)

    }

    handleOpen() {
        this.setState({
            show: true
        })
    }
    handleClose() {
        this.setState({
            show: false
        })
    }



    render() {
        var editjson = []
        const tabledata = this.state.teacher.filter((data, index) => {

            if (data.dept_id == this.state.deptid) {
                editjson.push(index)
                return data
            }
        }).slice(this.state.firstitem, this.state.lastitem).map((tabledata, index) => {
            if (this.state.editlist[index] == 1) { }
            else {
                return (
                    <tr>
                        <td>{tabledata.teacher_id}</td>
                        <td>{tabledata.t_prename}</td>
                        <td>{tabledata.teacher_tname}</td>
                        <td>อาจารย์</td>
                        <td>
                            <Form>
                                {['radio'].map((type) => (
                                    <div key={`inline-${type}`}  >
                                        <Form.Group className="radiotable">
                                            <Form.Check inline label="ไม่คุม" name="line" type={type} id={`inline-${type}-1`} />

                                            <Form.Check inline label="คุม" name="line" type={type} id={`inline-${type}-1`} />
                                            <Form.Check inline label="คุม 1 ครั้ง" name="line" type={type} id={`inline-${type}-2`} />
                                        </Form.Group>

                                    </div>
                                ))}
                            </Form>

                        </td>
                        <td>
                            <Button type="primary" onClick={() => this.handleOpen()}>กำหนดเงื่อนไข</Button>
                        </td>
                        <td>
                            <Button variant="light" className="editdata" >
                                <img src={editbt} className="editicon" alt="edit" />
                            </Button>
                        </td>
                        <td>
                            <Button variant="light" className="deletedata" >
                                <img src={deletebt} className="deleteicon" alt="delete" />
                            </Button>

                        </td>

                    </tr>
                )
            }
        })

        let datalength = this.state.teacher.map((data) => {
            if (data.dept_id == this.state.deptid) {
                return data
            }
        }).length
        return (
            <div className="page-container" >
                <div className="content-wrap">

                    <Nav />
                    <h1 class="state">ข้อมูลหน่วยงานในคณะ</h1>

                    <div id="detail">
                        <div className="filter">
                            <h5 className="yearDLfil">บุคลากร</h5>
                            <select className="selectyearDL" onChange={(e) => this.searchYear(e)}>
                                <option value='10'>อาจารย์</option>
                            </select>
                            <h5 className="yearDLfil">ภาควิชา</h5>
                            <select className="selectyearDL" onChange={(e) => this.searchDept(e)}>
                                {
                                    this.state.dept.map(data =>
                                        <option value={data.dept_id}>{data.dept_name}</option>
                                    )
                                }

                            </select>
                        </div>
                        <Table striped responsive className="Crtable">
                            <thead>
                                <tr className="">
                                    <th>รหัสบุคลากร</th>
                                    <th>คำนำหน้า</th>
                                    <th>ชื่อ - นามสกุล</th>
                                    <th>ตำแหน่ง</th>
                                    <th>คุมสอบ</th>
                                    <th>เงื่อนไข</th>
                                    <th>แก้ไขข้อมูล</th>
                                    <th>ลบข้อมูล</th>

                                </tr>
                            </thead>
                            <tbody>
                                {tabledata}

                            </tbody>
                        </Table>
                        <Pagination
                            activePage={this.state.pageclick}
                            itemsCountPerPage={this.state.itemperpage}
                            totalItemsCount={datalength}
                            itemClass="page-item"
                            linkClass="page-link"
                            pageRangeDisplayed={5}
                            onChange={this.pageselectvalue}

                        />
                        <Button variant="light" className="adddata">
                            <img src={addbt} className="addicon" alt="add" />
                        </Button>
                    </div>
                </div>

                <div className="footer">
                    <Foot />
                </div>

                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Body >
                        <button type="button" onClick={this.handleClose} class="close"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>

                        <div className="filter">
                            <h5 className="yearDLfil">เงื่อนไขอาคาร</h5>
                            <select className="selectyearDL" onChange={(e) => this.searchYear(e)}>
                                <option value='10'>อาจารย์</option>
                            </select>
                        </div>
                        <div className="filter">
                            <h5 className="yearDLfil">คุมสอบวิชาตัวเอง</h5>
                            <Form>
                                {['radio'].map((type) => (
                                    <div key={`inline-${type}`}>
                                        <Form.Group>

                                            <Form.Check inline label="ไม่คุม" name="line" type={type} id={`inline-${type}-1`} />
                                            <Form.Check inline label="คุม" name="line" type={type} id={`inline-${type}-2`} />
                                        </Form.Group>

                                    </div>
                                ))}
                            </Form>
                        </div>

                        <div className="filter">
                            <h5 className="yearDLfil">เงื่อนไขสัปดาห์</h5>
                            <select className="selectyearDL" onChange={(e) => this.searchYear(e)}>
                                <option value='10'>สัปดาห์ที่ 1</option>
                            </select>
                        </div>

                        <div className="filter">
                            <h5 className="yearDLfil">เงื่อนไขช่วงเวลา</h5>
                            <Form>
                                {['radio'].map((type) => (
                                    <div key={`inline-${type}`} >
                                        <Form.Group>
                                            <Form.Check inline label="เช้า" name="line" type={type} id={`inline-${type}-1`} />

                                            <Form.Check inline label="บ่าย" name="line" type={type} id={`inline-${type}-1`} />
                                            <Form.Check inline label="เช้าและบ่ายในวันเดียวกัน" name="line" type={type} id={`inline-${type}-2`} />
                                        </Form.Group>

                                    </div>
                                ))}
                            </Form>
                        </div>

                        <div className="filter">
                            <h5 className="yearDLfil">คุมสอบเสาร์อาทิตย์</h5>
                            <Form>
                                {['radio'].map((type) => (
                                    <div key={`inline-${type}`} >
                                        <Form.Group>
                                            <Form.Check inline label="ไม่คุม" name="line" type={type} id={`inline-${type}-1`} />
                                            <Form.Check inline label="คุม" name="line" type={type} id={`inline-${type}-2`} />
                                        </Form.Group>

                                    </div>
                                ))}
                            </Form>                            </div>

                        <div className="filter">
                            <h5 className="yearDLfil">เงื่อนไขวัน</h5>
                            <select className="selectyearDL" onChange={(e) => this.searchYear(e)}>
                                <option value='10'>สัปดาห์ที่ 1</option>
                            </select>
                        </div>

                    </Modal.Body>
                </Modal>




            </div>
        )
    }


}