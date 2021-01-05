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
        }
        this.searchOffice = this.searchOffice.bind(this)
        this.pageselectvalue = this.pageselectvalue.bind(this);

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
        const deptdata = this.state.dept.filter((data, index) => {
            if(data.Office_type == this.state.Officesearch){
                editjson.push(index)
                return data
            }
            
        }).slice(this.state.firstitem, this.state.lastitem).map((deptdata, index) => {
            if (this.state.editlist[index] == 1) { }
            else {
                if(deptdata.Office_type == this.state.Officesearch){
                    
                    return (
                        <tr>
                            <td>{deptdata.Office_id}</td>
                            <td>{deptdata.Office_name}</td>
    
                            <td>
                                <Button variant="light" className="editFDdata" >
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