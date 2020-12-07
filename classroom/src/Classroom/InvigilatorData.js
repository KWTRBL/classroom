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
import { parse } from 'papaparse';
export default class FacultyData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            dept: [],
            teacher: [],
            officer: [],
            deptid: null,
            Typesearch: 1,
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
        this.searchType = this.searchType.bind(this)
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

        axios.get('http://localhost:7777/officer')
            .then(res => {
                const newIds = this.state.editlist.slice()
                for (var i = 0; i < res.data.length; i++) {
                    newIds.push(0)
                }

                this.setState({
                    officer: res.data,
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

    searchType = (event) => {
        let newId = this.state.editlist.slice()
        for (var i = 0; i < newId.length; i++) {
            if (newId[i] == 1) {
                newId[i] = 0
            }
        }
        let keyword = event.target.value;
        this.setState({
            Typesearch: parseInt(keyword),
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
        var tabledata = []
        var datalength = 0
        var typestring = ['สำนักงาน', 'ตำแหน่ง']

        if (this.state.Typesearch == 1) {
            tabledata = this.state.officer.filter((data, index) => {


                editjson.push(index)
                return data

            }).slice(this.state.firstitem, this.state.lastitem).map((tabledata, index) => {
                if (this.state.editlist[index] == 1) { }
                else {
                    return (
                        <tr>
                            <td>{tabledata.officer_id}</td>
                            <td>{tabledata.officer_prename}</td>
                            <td>{tabledata.officer_firstname}</td>
                            <td>{tabledata.officer_lastname}</td>
                            <td>เจ้าหน้าที</td>
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
            datalength = this.state.officer.map((data) => {
                return data

            }).length
        }
        if (this.state.Typesearch == 2) {
            tabledata = this.state.teacher.filter((data, index) => {

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
                            <td>{tabledata.FIRSTNAME_TH}</td>
                            <td>{tabledata.LASTNAME_TH}</td>
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
            var teacherlist = []
            this.state.teacher.map((data) => {
                if (data.dept_id == this.state.deptid) {
                    teacherlist.push(data)

                    return data
                }
            })

            datalength = teacherlist.length

        }



        return (
            <div className="page-container" >
                <div className="content-wrap">

                    <Nav />
                    <h1 class="state">ข้อมูลบุคลากรในคณะ</h1>

                    <div id="detail">
                        <div className="filter">
                            <h5 className="yearDLfil">บุคลากร</h5>
                            <select className="selectyearDL" onChange={(e) => this.searchType(e)}>
                                <option value='1'>เจ้าหน้าที</option>
                                <option value='2'>อาจารย์</option>

                            </select>
                            <h5 className="yearDLfil" hidden={this.state.Typesearch % 2} >ภาควิชา</h5>
                            <select className="selectDept" hidden={this.state.Typesearch % 2} onChange={(e) => this.searchDept(e)}>
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
                                    <th>ชื่อ</th>
                                    <th>นามสกุล</th>
                                    <th>{typestring[this.state.Typesearch - 1]}</th>
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
                        <Button variant="light" className="adddata">
                            <img src={addbt} className="addicon" alt="add" />
                        </Button>
                        <Pagination
                            activePage={this.state.pageclick}
                            itemsCountPerPage={this.state.itemperpage}
                            totalItemsCount={datalength}
                            itemClass="page-item"
                            linkClass="page-link"
                            pageRangeDisplayed={5}
                            onChange={this.pageselectvalue}

                        />

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
                            <h5 className="yearDLfil">ผศ.ดร. ชมพูนุท	จินจาคาม	</h5>
                        </div>

                        <div className="filter">
                            <h5 className="yearDLfil">เงื่อนไขอาคาร</h5>
                            <select className="selectbuilding" onChange={(e) => this.searchYear(e)}>
                                <option value='10'>อาคาร 12 ชั้น</option>
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
                            <select className="selectweek" onChange={(e) => this.searchYear(e)}>
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
                            </Form>
                            <br></br>

                        </div>
                        <div className="filter">
                            <h5 className="yearDLfil">ตารางเวลา</h5>

                        </div>
                        <Table striped responsive className="conditionTB">
                            <thead>
                                <tr className="">
                                    <th colspan="2">จันทร์</th>
                                    <th colspan="2">อังคาร</th>
                                    <th colspan="2">พุธ</th>
                                    <th colspan="2">พฤหัสบดี</th>
                                    <th colspan="2">ศุกร์</th>
                                    <th colspan="2">เสาร์</th>
                                    <th colspan="2">อาทิตย์</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="2">
                                        02/03/63
                                    </td>
                                    <td colspan="2">
                                        03/03/63
                                    </td>
                                    <td colspan="2">
                                        04/03/63
                                    </td>
                                    <td colspan="2">
                                        05/03/63
                                    </td>
                                    <td colspan="2">
                                        06/03/63
                                    </td>
                                    <td colspan="2">
                                        07/03/63
                                    </td>
                                    <td colspan="2">
                                        08/03/63
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        เช้า
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={1}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        บ่าย
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={0}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        เช้า
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={1}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        บ่าย
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={0}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        เช้า
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={1}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        บ่าย
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={0}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        เช้า
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={1}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        บ่าย
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={0}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        เช้า
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={1}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        บ่าย
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={0}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        เช้า
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={1}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        บ่าย
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={0}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        เช้า
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={1}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        บ่าย
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={0}
                                            />
                                        </Form>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        09/03/63
                                    </td>
                                    <td colspan="2">
                                        10/03/63
                                    </td>
                                    <td colspan="2">
                                        11/03/63
                                    </td>
                                    <td colspan="2">
                                        12/03/63
                                    </td>
                                    <td colspan="2">
                                        13/03/63
                                    </td>
                                    <td colspan="2">
                                        14/03/63
                                    </td>
                                    <td colspan="2">
                                        15/03/63
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        เช้า
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={1}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        บ่าย
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={0}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        เช้า
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={1}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        บ่าย
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={0}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        เช้า
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={1}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        บ่าย
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={0}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        เช้า
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={1}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        บ่าย
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={0}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        เช้า
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={1}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        บ่าย
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={0}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        เช้า
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={1}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        บ่าย
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={0}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        เช้า
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={1}
                                            />
                                        </Form>
                                    </td>
                                    <td>
                                        บ่าย
                                        <br></br>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={1}
                                                label=""
                                                checked={0}
                                            />
                                        </Form>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>

                    </Modal.Body>
                </Modal>




            </div>
        )
    }


}