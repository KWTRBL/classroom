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
import axios from 'axios';
import Pagination from "react-js-pagination";

import './FacultyData.css'
export default class FacultyData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            dept: [],
            deptid: null,
            editlist: [],
            olddata: [],
            Officesearch: 1,
            pageclick: 1,
            itemperpage: 10,
            firstitem: null,
            lastitem: null,
            Office_id: null,
            Office_name: null,
            name: [],

        }
        this.searchOffice = this.searchOffice.bind(this)
        this.pageselectvalue = this.pageselectvalue.bind(this);

        //edit data
        this.enableedit = this.enableedit.bind(this)
        this.canceledit = this.canceledit.bind(this)
        this.confirmedit = this.confirmedit.bind(this)
        this.handleChange_editoffice_id = this.handleChange_editoffice_id.bind(this)
        this.handleChange_editoffice_name = this.handleChange_editoffice_name.bind(this)

        this.componentWillMount = this.componentWillMount.bind(this);
    }

    //edit data handle
    handleChange_editoffice_name(index, event) {
        const newIds = this.state.dept //copy the array
        newIds[index].Office_name = event.target.value//execute the manipulations
        this.setState({ name: newIds }) //set the new state
        //console.log(event.target.value)
        
    }
    handleChange_editoffice_id(index, event) {
        const newIds = this.state.dept //copy the array
        newIds[index].Office_id = event.target.value//execute the manipulations
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
        // console.log(this.state.dept[index].Office_id)
        // console.log(this.state.dept[index].Office_name)
        // console.log(olddata[index].Office_id)
        axios
            .put("http://localhost:7777/t_office/update", {

                Office_id: this.state.dept[index].Office_id,
                Office_name: this.state.dept[index].Office_name,
                Office_id_select: olddata[index].Office_id
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

    componentWillMount() {
        axios.get('http://localhost:7777/t_office')
            .then(res => {
                const newIds = this.state.editlist.slice()
                for (var i = 0; i < res.data.length; i++) {
                    newIds.push(0)
                }
                this.setState({
                    dept: res.data,
                    deptid: res.data[0].Office_id,
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
            dept: JSON.parse(this.state.olddata),

        })
    }

    searchOffice = (event) => {
        let keyword = event.target.value;
        this.setState({ Officesearch: keyword })
        this.pageselectvalue(1)
    }
    render() {
        var editjson = []
        const deptdata = this.state.dept.filter((deptdata, index) => {
            if (deptdata.Office_type == this.state.Officesearch) {
                editjson.push(index)
                return deptdata
            }

        }).slice(this.state.firstitem, this.state.lastitem).map((deptdata, index) => {
            if (this.state.editlist[index] == 1) {
                return (
                    <tr>
                        <td>
                            <input
                                value={deptdata.Office_id}
                                type="text"
                                className="form-control"
                                id="formGroupExampleInput"
                                //onChange={(e) => this.handleChange_editoffice_id(((this.state.pageclick - 1) * this.state.itemperpage) + index, e)}
                                onChange={(e) => this.handleChange_editoffice_id(editjson[((this.state.pageclick - 1) * this.state.itemperpage) + index], e)}
                            />
                        </td>
                        <td>
                            <input
                                value={deptdata.Office_name}
                                type="text"
                                className="form-control"
                                id="formGroupExampleInput"
                                //onChange={(e) => this.handleChange_editoffice_name(((this.state.pageclick - 1) * this.state.itemperpage) + index, e)}                               
                                onChange={(e) => this.handleChange_editoffice_name(editjson[((this.state.pageclick - 1) * this.state.itemperpage) + index], e)}
                            /></td>
                        <td>
                            <Button variant="link" onClick={() => this.canceledit(index)}>ยกเลิก</Button>
                            <Button variant="primary" onClick={() => this.confirmedit(editjson[((this.state.pageclick - 1) * this.state.itemperpage) + index])} >ยืนยัน</Button>
                        </td>
                        <td>
                            <Button variant="light" className="deletedata" >
                                <img src={deletebt} className="deleteicon" alt="delete" />
                            </Button>
                        </td>
                    </tr>
                )
            }
            else {
                if (deptdata.Office_type == this.state.Officesearch) {

                    return (
                        <tr>
                            <td>{deptdata.Office_id}</td>
                            <td>{deptdata.Office_name}</td>

                            <td>
                                <Button variant="light" className="editFDdata" onClick={() => this.enableedit(index)}>
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

            }
        })
        let datalength = editjson.length
        return (
            <div className="page-container">
                <div className="content-wrap">

                    <Nav />
                    <h1 class="state">ข้อมูลหน่วยงานในคณะ</h1>

                    <div id="detail">
                        <div className="filter">
                            <h5 className="Officefil">หน่วยงานในคณะ</h5>
                            <select className="selectOffice" onChange={(e) => this.searchOffice(e)}>
                                <option value="1"> ภาควิชา </option>
                                <option value="2"> สำนักงานคณบดี </option>

                            </select>

                        </div>
                        <Table striped responsive className="Crtable">
                            <thead>
                                <tr className="Buildtable">
                                    <th>รหัสหน่วยงาน</th>
                                    <th>ชื่อหน่วยงาน</th>
                                    <th>แก้ไขข้อมูล</th>
                                    <th>ลบข้อมูล</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deptdata}
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
            </div>
        )
    }


}